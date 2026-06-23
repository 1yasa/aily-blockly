import { z } from 'zod'

import { getSscmaScoreThreshold } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaScoreThreshold(input.port))
