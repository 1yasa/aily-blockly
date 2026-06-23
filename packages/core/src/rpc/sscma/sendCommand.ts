import { z } from 'zod'

import { sendSscmaAtCommand } from '../../sscma'
import { p } from '../trpc'

/**
 * 发送原始 SSCMA AT 命令并等待响应。
 */
export default p
	.input(
		z.object({
			port: z.string(),
			command: z.string(),
			timeoutMs: z.number().int().positive().optional()
		})
	)
	.mutation(({ input }) =>
		sendSscmaAtCommand({
			port: input.port,
			command: input.command,
			timeoutMs: input.timeoutMs
		})
	)
