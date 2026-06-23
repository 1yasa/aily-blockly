import { readConnectedSerialSession } from '../serial/manager/shared'
import { createSerialTimestamp, pushSerialMessage } from '../serial/state'

import type { SscmaAtResponse } from './types'

const toCommandName = (command: string) => {
	const trimmed = command.trim().replace(/\r$/, '')
	const withoutPrefix = trimmed.replace(/^AT\+/, '')
	return withoutPrefix.includes('=') ? withoutPrefix.split('=')[0] : withoutPrefix
}

const toChunkText = (chunk: unknown) => {
	if (typeof chunk === 'string') return chunk
	if (chunk instanceof Uint8Array) return Buffer.from(chunk).toString('utf8')
	return Buffer.from(chunk as ArrayBufferLike).toString('utf8')
}

const extractResponsesFromBuffer = (buffer: string) => {
	const responses: Array<{ response: SscmaAtResponse; endIndex: number }> = []
	const patterns = [/\r(\{[\s\S]*?\})\n/g, /(\{[\s\S]*?\})\n/g]

	for (const pattern of patterns) {
		let match: RegExpExecArray | null
		while ((match = pattern.exec(buffer)) !== null) {
			try {
				const response = JSON.parse(match[1]) as SscmaAtResponse
				responses.push({
					response,
					endIndex: match.index + match[0].length
				})
			} catch {
				continue
			}
		}
		if (responses.length > 0) break
	}

	return responses.sort((left, right) => left.endIndex - right.endIndex)
}

/**
 * 向已连接串口发送 SSCMA AT 命令并等待匹配响应。
 * @param input - 串口路径、命令和超时时间
 */
export const sendSscmaAtCommand = async (input: {
	port: string
	command: string
	timeoutMs?: number
}): Promise<SscmaAtResponse> => {
	const session = readConnectedSerialSession(input.port)
	const commandName = toCommandName(input.command)
	const fullCommand = input.command.endsWith('\r') ? input.command : `${input.command}\r`

	return new Promise<SscmaAtResponse>((resolve, reject) => {
		let receiveBuffer = ''
		const timeoutHandle = setTimeout(() => {
			session.port.off('data', handleData)
			reject(new Error(`SSCMA command timed out: ${input.command}`))
		}, input.timeoutMs ?? 3000)

		const cleanup = () => {
			clearTimeout(timeoutHandle)
			session.port.off('data', handleData)
		}

		/**
		 * 解析串口增量数据，匹配与当前命令同名的 JSON 响应。
		 */
		const handleData = (chunk: unknown) => {
			receiveBuffer += toChunkText(chunk)
			const parsedResponses = extractResponsesFromBuffer(receiveBuffer)
			if (parsedResponses.length === 0) {
				if (receiveBuffer.length > 512 * 1024 && !receiveBuffer.includes('{')) {
					receiveBuffer = ''
				}
				return
			}

			let consumedIndex = 0
			for (const item of parsedResponses) {
				consumedIndex = Math.max(consumedIndex, item.endIndex)
				if (item.response.name === commandName || item.response.name.includes(commandName)) {
					cleanup()
					resolve(item.response)
					return
				}
			}

			if (consumedIndex > 0) {
				receiveBuffer = receiveBuffer.slice(consumedIndex)
			}
		}

		session.port.on('data', handleData)
		session.port.write(fullCommand, error => {
			if (error) {
				cleanup()
				reject(new Error(`SSCMA command write failed: ${error.message}`))
				return
			}

			pushSerialMessage(session.messages, {
				direction: 'tx',
				timestamp: createSerialTimestamp(),
				text: fullCommand,
				hex:
					Buffer.from(fullCommand, 'utf8')
						.toString('hex')
						.toUpperCase()
						.match(/.{1,2}/g)
						?.join(' ') || ''
			})
		})
	})
}
