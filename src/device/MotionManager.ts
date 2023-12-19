import { makeAutoObservable } from 'mobx'
import DeviceManager, { MotionCmd } from './DeviceManager'
import { clampUnit } from '../utils'

class MotionManager {
  deviceManager: DeviceManager

  absolutePosition: number = 1
  vibeZero: number = 0.0
  vibeThrow: number = 0.5
  vibeSpeed: number = 0.0
  vibeSelected: boolean = false

  constructor(deviceManager: DeviceManager) {
    this.deviceManager = deviceManager
    makeAutoObservable(this)
  }

  setAbsolutePosition(pos: number) {
    pos = clampUnit(pos)

    this.absolutePosition = pos
    const motionData: MotionCmd = [
      ['p', pos],
      ['s', 3],
    ]

    this.vibeSelected = false
    this.deviceManager.sendMotionTr(motionData)
  }

  setVibe(t: number, s: number) {
    this.setVibeWithZero(0, t, s)
  }

  setVibeWithZero(z: number, t: number, s: number) {
    if (z === null) z = this.vibeZero
    if (t === null) t = this.vibeThrow
    if (s === null) s = this.vibeSpeed

    z = clampUnit(z)
    t = clampUnit(t)
    s = clampUnit(s)

    if (z > t) {
      const v = (z + t) / 2
      z = v
      t = z
    }

    if (this.vibeThrow !== t || this.vibeSpeed !== s || this.vibeZero !== z) {
      this.vibeZero = z
      this.vibeThrow = t
      this.vibeSpeed = s

      const motionData: MotionCmd = [
        ['z', z],
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
