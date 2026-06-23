import { z } from 'zod'

import { getSscmaCurrentModel } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaCurrentModel(input.port))
