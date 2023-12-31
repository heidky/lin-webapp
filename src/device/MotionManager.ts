import { makeAutoObservable } from 'mobx'
import DeviceManager, { MotionCmd } from './DeviceManager'

class MotionManager {
  deviceManager: DeviceManager

  absolutePosition: number = 1
  vibeThrow: number = 0.5
  vibeSpeed: number = 0
  vibeSelected: boolean = false

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

    this.vibeSelected = false
    this.deviceManager.sendMotionTr(motionData)
  }

  setVibe(t: number, s: number) {
    if (t > 1) t = 1
    if (t < 0) t = 0
    if (s > 1) s = 1
    if (s < 0) s = 0

    if (this.vibeThrow !== t || this.vibeSpeed !== s) {
      this.vibeThrow = t
      this.vibeSpeed = s

      const motionData: MotionCmd = [
        ['t', t],
        ['s', s],
      ]

      this.vibeSelected = true
      this.deviceManager.sendMotionTr(motionData)
    }
  }

  stopVibe() {
    this.setVibe(this.vibeThrow, 0)
  }
}

export default MotionManager
