import { z } from 'zod'

import { setSscmaIouThreshold } from '../../sscma'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			port: z.string(),
			iou: z.number().min(0).max(100)
		})
	)
	.mutation(({ input }) => setSscmaIouThreshold(input.port, input.iou))
