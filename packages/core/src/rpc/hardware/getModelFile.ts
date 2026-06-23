import { z } from 'zod'

import { getHardwareModelFile } from '../../hardware'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			config: z.unknown().optional(),
			modelId: z.string()
		})
	)
	.query(({ input }) =>
		getHardwareModelFile({
			config: input.config as never,
			modelId: input.modelId
		})
	)
