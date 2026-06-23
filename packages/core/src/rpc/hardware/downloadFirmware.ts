import { z } from 'zod'

import { downloadHardwareFirmwareBinary } from '../../hardware'
import { p } from '../trpc'

export default p
	.input(
		z.object({
			appDataPath: z.string(),
			firmware: z.object({
				fwv: z.string(),
				filename: z.string(),
				file_url: z.string(),
				resource_url: z.string(),
				url: z.string()
			}),
			address: z.number().int().optional()
		})
	)
	.mutation(({ input }) =>
		downloadHardwareFirmwareBinary({
			appDataPath: input.appDataPath,
			firmware: input.firmware,
			address: input.address
		})
	)
