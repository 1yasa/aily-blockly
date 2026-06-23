import { z } from 'zod'

import { getSscmaCurrentSensor } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string()
		})
	)
	.query(({ input }) => getSscmaCurrentSensor(input.port))
