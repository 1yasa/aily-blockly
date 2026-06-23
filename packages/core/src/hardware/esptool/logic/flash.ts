import { spawn } from 'node:child_process'

import { parseHardwareUploadProgressLine } from '../../upload/progress'
import { detectHardwareEsptool } from './detect'
import { installHardwareEsptool } from './install'

import type { HardwareEsptoolFlashFileInput, HardwareEsptoolFlashResult } from '../types'

const buildEsptoolArgs = (input: HardwareEsptoolFlashFileInput) => {
	const chip = input.chip || 'esp32s3'
	const baudRate = input.baudRate || 460800
	const beforeFlash = input.beforeFlash || 'default_reset'
	const afterFlash = input.afterFlash || 'hard_reset'
	const address = `0x${input.address.toString(16)}`

	return [
		'--chip',
		chip,
		'--port',
		input.port,
		'--baud',
		String(baudRate),
		'--before',
		beforeFlash,
		'--after',
		afterFlash,
		'write_flash',
		'-z',
		'--flash_mode',
		'dio',
		'--flash_freq',
		'80m',
		'--flash_size',
		'detect',
		address,
		input.filePath
	]
}

/**
 * 直接使用 esptool 刷写单个二进制文件。
 * @param input - 刷写输入
 */
export const flashHardwareEsptoolFile = async (
	input: HardwareEsptoolFlashFileInput
): Promise<HardwareEsptoolFlashResult> => {
	let packageInfo = detectHardwareEsptool({
		appDataPath: input.appDataPath,
		platform: input.platform
	})

	if (!packageInfo && input.packageSpec) {
		const installResult = await installHardwareEsptool({
			appDataPath: input.appDataPath,
			platform: input.platform,
			packageSpec: input.packageSpec
		})
		packageInfo = installResult.packageInfo ?? null
	}

	if (!packageInfo?.esptoolPath) {
		return {
			success: false,
			stdout: '',
			stderr: '',
			exitCode: 1,
			progressEvents: [],
			message: 'esptool executable is unavailable',
			error: 'esptool executable is unavailable'
		}
	}

	const args = buildEsptoolArgs(input)
	const command = packageInfo.esptoolPath

	return new Promise<HardwareEsptoolFlashResult>((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: ['ignore', 'pipe', 'pipe']
		})
		let stdout = ''
		let stderr = ''
		let stdoutLineBuffer = ''
		let stderrLineBuffer = ''
		const progressEvents: HardwareEsptoolFlashResult['progressEvents'] = []

		const collectProgress = (bufferValue: string, chunkText: string) => {
			const nextBuffer = bufferValue + chunkText
			const lines = nextBuffer.split(/\r?\n/)
			const rest = lines.pop() || ''
			for (const line of lines) {
				const event = parseHardwareUploadProgressLine('flash:esptool', line)
				if (event) progressEvents.push(event)
			}
			return rest
		}

		child.stdout.on('data', chunk => {
			const text = chunk.toString()
			stdout += text
			stdoutLineBuffer = collectProgress(stdoutLineBuffer, text)
		})
		child.stderr.on('data', chunk => {
			const text = chunk.toString()
			stderr += text
			stderrLineBuffer = collectProgress(stderrLineBuffer, text)
		})
		child.on('error', reject)
		child.on('close', exitCode => {
			for (const trailingLine of [stdoutLineBuffer, stderrLineBuffer]) {
				const event = parseHardwareUploadProgressLine('flash:esptool', trailingLine)
				if (event) progressEvents.push(event)
			}

			const success = (exitCode ?? 1) === 0
			resolve({
				success,
				command: [command, ...args].join(' '),
				stdout,
				stderr,
				exitCode: exitCode ?? 1,
				progressEvents,
				message: success ? 'esptool flash finished successfully' : 'esptool flash failed',
				...(success ? {} : { error: stderr.trim() || stdout.trim() || 'esptool flash failed' })
			})
		})
	})
}
