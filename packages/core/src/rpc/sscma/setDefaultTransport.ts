import { z } from 'zod'

import { setSscmaDefaultTransport } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string(),
			transport: z.number().int()
		})
	)
	.mutation(({ input }) => setSscmaDefaultTransport(input.port, input.transport))
