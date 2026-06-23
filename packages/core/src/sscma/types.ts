/**
 * SSCMA AT 响应结构。
 */
export interface SscmaAtResponse {
	/** 响应类型：0=operation, 1=event, 2=logging。 */
	type: number
	/** 命令名称。 */
	name: string
	/** 协议返回码。 */
	code: number
	/** 负载数据。 */
	data: unknown
}

/**
 * SSCMA 模型信息。
 */
export interface SscmaModelInfo {
	/** 模型 ID。 */
	id: number
	/** 算法类型。 */
	type: number
	/** 存储地址。 */
	address: number
	/** 模型大小。 */
	size: number
}

/**
 * SSCMA 传感器信息。
 */
export interface SscmaSensorInfo {
	/** 传感器 ID。 */
	id: number
	/** 传感器类型。 */
	type: number
	/** 当前状态。 */
	state: number
	/** 可选配置 ID。 */
	opt_id?: number
	/** 可选配置说明。 */
	opt_detail?: string
}

/**
 * SSCMA 固件版本信息。
 */
export interface SscmaVersionInfo {
	/** AT API 版本。 */
	at_api: string
	/** 软件版本。 */
	software: string
	/** 硬件版本。 */
	hardware: string
}
