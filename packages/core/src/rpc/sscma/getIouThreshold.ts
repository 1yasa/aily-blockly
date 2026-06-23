import { z } from 'zod'

import { getSscmaIouThreshold } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaIouThreshold(input.port))
