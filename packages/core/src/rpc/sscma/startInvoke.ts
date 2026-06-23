import { z } from 'zod'

import { startSscmaInvoke } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string(),
			times: z.number().int().optional(),
			differed: z.number().int().optional(),
			resultOnly: z.number().int().optional()
		})
	)
	.mutation(({ input }) =>
		startSscmaInvoke({
			port: input.port,
			times: input.times,
			differed: input.differed,
			resultOnly: input.resultOnly
		})
	)
