import { z } from 'zod'

import { getSscmaDeviceId } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaDeviceId(input.port))
