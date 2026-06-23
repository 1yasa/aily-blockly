import { sendSscmaAtCommand } from './command'

import type { SscmaModelInfo, SscmaSensorInfo, SscmaVersionInfo } from './types'

/**
 * 获取设备 ID。
 * @param port - 已连接串口路径
 */
export const getSscmaDeviceId = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+ID?' })
	if (response.code !== 0) throw new Error(`Failed to get device id: code=${response.code}`)
	return String(response.data)
}

/**
 * 获取设备名称。
 * @param port - 已连接串口路径
 */
export const getSscmaDeviceName = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+NAME?' })
	if (response.code !== 0) throw new Error(`Failed to get device name: code=${response.code}`)
	return String(response.data)
}

/**
 * 获取 SSCMA 固件版本信息。
 * @param port - 已连接串口路径
 */
export const getSscmaVersion = async (port: string): Promise<SscmaVersionInfo> => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+VER?' })
	if (response.code !== 0) throw new Error(`Failed to get version: code=${response.code}`)
	return response.data as SscmaVersionInfo
}

/**
 * 获取默认传输类型。
 * @param port - 已连接串口路径
 */
export const getSscmaDefaultTransport = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+DFTTPT?' })
	if (response.code !== 0) throw new Error(`Failed to get default transport: code=${response.code}`)
	return Number(response.data)
}

/**
 * 设置默认传输类型。
 * @param port - 已连接串口路径
 * @param transport - 目标传输类型编号
 */
export const setSscmaDefaultTransport = async (port: string, transport: number) => {
	const response = await sendSscmaAtCommand({
		port,
		command: `AT+DFTTPT=${transport}`
	})
	if (response.code !== 0) throw new Error(`Failed to set default transport: code=${response.code}`)
	return Number(response.data)
}

/**
 * 获取当前模型信息。
 * @param port - 已连接串口路径
 */
export const getSscmaCurrentModel = async (port: string): Promise<SscmaModelInfo> => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+MODEL?' })
	if (response.code !== 0) throw new Error(`Failed to get current model: code=${response.code}`)
	return response.data as SscmaModelInfo
}

/**
 * 获取当前传感器信息。
 * @param port - 已连接串口路径
 */
export const getSscmaCurrentSensor = async (port: string): Promise<SscmaSensorInfo> => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+SENSOR?' })
	if (response.code !== 0) throw new Error(`Failed to get current sensor: code=${response.code}`)
	return response.data as SscmaSensorInfo
}

/**
 * 设置 score threshold。
 * @param port - 已连接串口路径
 * @param score - 阈值
 */
export const setSscmaScoreThreshold = async (port: string, score: number) => {
	const response = await sendSscmaAtCommand({
		port,
		command: `AT+TSCORE=${score}`
	})
	if (response.code !== 0) throw new Error(`Failed to set score threshold: code=${response.code}`)
	return Number(response.data)
}

/**
 * 获取 score threshold。
 * @param port - 已连接串口路径
 */
export const getSscmaScoreThreshold = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+TSCORE?' })
	if (response.code !== 0) throw new Error(`Failed to get score threshold: code=${response.code}`)
	return Number(response.data)
}

/**
 * 设置 IoU threshold。
 * @param port - 已连接串口路径
 * @param iou - 阈值
 */
export const setSscmaIouThreshold = async (port: string, iou: number) => {
	const response = await sendSscmaAtCommand({
		port,
		command: `AT+TIOU=${iou}`
	})
	if (response.code !== 0) throw new Error(`Failed to set IoU threshold: code=${response.code}`)
	return Number(response.data)
}

/**
 * 获取 IoU threshold。
 * @param port - 已连接串口路径
 */
export const getSscmaIouThreshold = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+TIOU?' })
	if (response.code !== 0) throw new Error(`Failed to get IoU threshold: code=${response.code}`)
	return Number(response.data)
}

/**
 * 启动 invoke。
 * @param input - 串口和运行参数
 */
export const startSscmaInvoke = async (input: {
	port: string
	times?: number
	differed?: number
	resultOnly?: number
}) => {
	const response = await sendSscmaAtCommand({
		port: input.port,
		command: `AT+INVOKE=${input.times ?? -1},${input.differed ?? 0},${input.resultOnly ?? 0}`
	})
	if (response.code !== 0) throw new Error(`Failed to start invoke: code=${response.code}`)
	return response
}

/**
 * 停止当前所有任务。
 * @param port - 已连接串口路径
 */
export const stopSscmaTasks = async (port: string) => {
	const response = await sendSscmaAtCommand({ port, command: 'AT+BREAK' })
	if (response.code !== 0) throw new Error(`Failed to stop tasks: code=${response.code}`)
	return response
}

/**
 * 重启设备。
 * @param port - 已连接串口路径
 */
export const rebootSscmaDevice = async (port: string) => sendSscmaAtCommand({ port, command: 'AT+RST' })

export * from './command'
export * from './types'
