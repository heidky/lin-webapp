import { makeAutoObservable } from 'mobx'
import DeviceManager, { MotionCmd } from './DeviceManager'

class MotionManager {
  deviceManager: DeviceManager

  absolutePosition: number = 0

  constructor(deviceManager: DeviceManager) {
    this.deviceManager = deviceManager
    makeAutoObservable(this)
  }

  setAbsolutePosition(pos: number) {
    if (pos > 1) pos = 1
    else if (pos < 0) pos = 0

    this.absolutePosition = pos
    const motionData: MotionCmd = [
      ['p', pos],
      ['s', 3],
    ]

    this.deviceManager.sendMotionTr(motionData)
  }
}

export default MotionManager
