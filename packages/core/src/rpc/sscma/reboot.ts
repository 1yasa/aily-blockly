import { z } from 'zod'

import { rebootSscmaDevice } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.mutation(({ input }) => rebootSscmaDevice(input.port))
