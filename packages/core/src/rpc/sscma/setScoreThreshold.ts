import { z } from 'zod'

import { setSscmaScoreThreshold } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string(),
			score: z.number().min(0).max(100)
		})
	)
	.mutation(({ input }) => setSscmaScoreThreshold(input.port, input.score))
