import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { resolveHardwareEsptoolTempDir } from '../../esptool/logic/shared'
import { getHardwareModelAddress } from './model'

import type { HardwareDownloadedBinaryFile, HardwareDownloadFirmwareInput, HardwareDownloadModelInput } from '../types'

const sanitizeHardwareFilename = (value: string, fallback: string) => {
	const basename = path.basename(String(value || '').trim())
	const cleaned = basename.replace(/[^\w.-]+/g, '_')
	return cleaned || fallback
}

const downloadBinaryFile = async (input: {
	appDataPath: string
	url: string
	filename: string
	address: number
	checksum?: string
}): Promise<HardwareDownloadedBinaryFile> => {
	const response = await fetch(input.url)
	if (!response.ok) {
		throw new Error(`Failed to download binary: ${response.status} ${response.statusText}`)
	}

	const tempDir = resolveHardwareEsptoolTempDir(input.appDataPath)
	await mkdir(tempDir, { recursive: true })
	const filePath = path.join(tempDir, input.filename)
	const buffer = Buffer.from(await response.arrayBuffer())
	await writeFile(filePath, buffer)
	const fileStat = await stat(filePath)

	return {
		filePath,
		filename: input.filename,
		size: fileStat.size,
		address: input.address,
		...(input.checksum ? { checksum: input.checksum } : {})
	}
}

/**
 * 下载固件二进制到宿主临时目录。
 * @param input - 固件下载输入
 */
export const downloadHardwareFirmwareBinary = async (
	input: HardwareDownloadFirmwareInput
): Promise<HardwareDownloadedBinaryFile> => {
	const firmwareUrl = String(input.firmware.file_url || input.firmware.url || '').trim()
	if (!firmwareUrl) {
		throw new Error('Firmware download URL is missing.')
	}

	return downloadBinaryFile({
		appDataPath: input.appDataPath,
		url: firmwareUrl,
		filename: sanitizeHardwareFilename(input.firmware.filename, 'firmware.bin'),
		address: input.address ?? 0
	})
}

/**
 * 下载模型二进制到宿主临时目录。
 * @param input - 模型下载输入
 */
export const downloadHardwareModelBinary = async (
	input: HardwareDownloadModelInput
): Promise<HardwareDownloadedBinaryFile> => {
	const modelUrl = String(input.snapshot.arguments?.url || '').trim()
	if (!modelUrl) {
		throw new Error('Model download URL is missing.')
	}

	return downloadBinaryFile({
		appDataPath: input.appDataPath,
		url: modelUrl,
		filename: sanitizeHardwareFilename(`model_${input.snapshot.model_id}.bin`, 'model.bin'),
		address: getHardwareModelAddress(input.xiaoType),
		...(input.snapshot.checksum ? { checksum: input.snapshot.checksum } : {})
	})
}
