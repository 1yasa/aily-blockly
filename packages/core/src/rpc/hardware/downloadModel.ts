import { z } from 'zod'

import { downloadHardwareModelBinary } from '../../hardware'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			appDataPath: z.string(),
			snapshot: z.object({
				model_id: z.string(),
				version: z.string(),
				arguments: z.record(z.string(), z.unknown()),
				checksum: z.string().optional(),
				model_format: z.string(),
				ai_framwork: z.string()
			}),
			xiaoType: z.union([z.literal(0), z.literal(1), z.literal(2)])
		})
	)
	.mutation(({ input }) =>
		downloadHardwareModelBinary({
			appDataPath: input.appDataPath,
			snapshot: input.snapshot as never,
			xiaoType: input.xiaoType
		})
	)
