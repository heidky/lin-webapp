import { makeAutoObservable } from 'mobx'
import DeviceManager, { MotionCmd } from './DeviceManager'

class MotionManager {
  deviceManager: DeviceManager

  absolutePosition: number = 0
  _vibePos: [number, number] = [0, 0]

  get vibePos() {
    return this._vibePos
  }

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

  setVibePos(x: number, y: number) {
    if (x > 1) x = 1
    if (x < 0) x = 0
    if (y > 1) y = 1
    if (y < 0) y = 0

    if (this._vibePos[0] !== x || this._vibePos[1] !== y) {
      this._vibePos = [x, y]

      const motionData: MotionCmd = [
        ['t', x],
        ['s', y],
      ]

      this.deviceManager.sendMotionTr(motionData)
    }
  }

  stopVibe() {
    this.setVibePos(0, 0)
  }
}

export default MotionManager
