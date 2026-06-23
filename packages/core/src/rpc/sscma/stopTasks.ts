import { z } from 'zod'

import { stopSscmaTasks } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.mutation(({ input }) => stopSscmaTasks(input.port))
