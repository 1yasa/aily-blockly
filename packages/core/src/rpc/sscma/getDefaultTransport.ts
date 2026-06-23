import { z } from 'zod'

import { getSscmaDefaultTransport } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaDefaultTransport(input.port))
