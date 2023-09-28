import DeviceManager from '../device/DeviceManager'
import MotionManager from '../device/MotionManager'

export const deviceManger = new DeviceManager()
export const motionManager = new MotionManager(deviceManger)
