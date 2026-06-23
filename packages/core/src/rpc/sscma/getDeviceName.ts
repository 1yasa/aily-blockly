import { z } from 'zod'

import { getSscmaDeviceName } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaDeviceName(input.port))
