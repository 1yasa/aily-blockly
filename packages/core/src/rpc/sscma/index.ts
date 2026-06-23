import { r } from '../trpc'
import { default as getCurrentModel } from './getCurrentModel'
import { default as getCurrentSensor } from './getCurrentSensor'
import { default as getDefaultTransport } from './getDefaultTransport'
import { default as getDeviceId } from './getDeviceId'
import { default as getDeviceName } from './getDeviceName'
import { default as getIouThreshold } from './getIouThreshold'
import { default as getScoreThreshold } from './getScoreThreshold'
import { default as getVersion } from './getVersion'
import { default as reboot } from './reboot'
import { default as sendCommand } from './sendCommand'
import { default as setDefaultTransport } from './setDefaultTransport'
import { default as setIouThreshold } from './setIouThreshold'
import { default as setScoreThreshold } from './setScoreThreshold'
import { default as startInvoke } from './startInvoke'
import { default as stopTasks } from './stopTasks'

export default r({
	sendCommand,
	getDeviceId,
	getDeviceName,
	getVersion,
	getDefaultTransport,
	setDefaultTransport,
	getCurrentModel,
	getCurrentSensor,
	getScoreThreshold,
	setScoreThreshold,
	getIouThreshold,
	setIouThreshold,
	startInvoke,
	stopTasks,
	reboot
})
