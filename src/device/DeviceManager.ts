import { makeAutoObservable, runInAction, action } from 'mobx'
import { throttle } from 'throttle-debounce'

const SERVICE = '50300001-0023-4bd4-bbd5-a6920e4c5653'

const CHAR_INFO = '50300007-0023-4bd4-bbd5-a6920e4c5653'
const CHAR_CONFIG = '50300005-0023-4bd4-bbd5-a6920e4c5653'
const CHAR_CONFIG_TX = '50300006-0023-4bd4-bbd5-a6920e4c5653'
const CHAR_MOTION_TX = '50300008-0023-4bd4-bbd5-a6920e4c5653'

export type MotionCmd = Array<[string, number]>

export default class DeviceManager {
  connected: boolean = false

  get deviceName() {
    return this.device?.name
  }

  reconnecting: boolean = false
  reconnectTimeoutId: any = null

  device: BluetoothDevice | null = null
  server: BluetoothRemoteGATTServer | null = null
  service: BluetoothRemoteGATTService | null = null

  infoChar: BluetoothRemoteGATTCharacteristic | null = null
  configChar: BluetoothRemoteGATTCharacteristic | null = null
  configCharTx: BluetoothRemoteGATTCharacteristic | null = null
  motionCharTx: BluetoothRemoteGATTCharacteristic | null = null

  deviceInfo: Record<string, number> | null = null
  deviceConfig: Record<string, number> | null = null

  sendMotionTr: (cmd: MotionCmd) => void

  constructor() {
    makeAutoObservable(this)

    this.sendMotionTr = throttle(1000 / 10, (cmd) => this.sendMotion(cmd))
  }

  async connectPrompt() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE] }],
      })

      await this.connect(device)
    } catch {
      console.warn('closed connect prompt')
    }
  }

  async _attemptReconnect() {
    if (!this.connected && this.device) {
      console.log('Reconnect attempt')
      try {
        runInAction(() => (this.reconnecting = true))
        await this.connect(this.device)
        this._clearReconnect()
      } catch {
        runInAction(() => {
          this._clearReconnect()
          this.reconnectTimeoutId = setTimeout(
            () => this._attemptReconnect(),
            2000
          )
        })
      }
    }
  }

  _clearReconnect() {
    this.reconnecting = false
    clearTimeout(this.reconnectTimeoutId)
    this.reconnectTimeoutId = null
  }

  async connect(device: BluetoothDevice) {
    if (!device) return
    this.device = device
    this.server = await device.gatt!.connect()
    runInAction(() => {
      this.connected = true
      console.log('device connected:', device.name)
    })
    this.service = await this.server.getPrimaryService(SERVICE)

    this.infoChar = await this.service.getCharacteristic(CHAR_INFO)
    this.configChar = await this.service.getCharacteristic(CHAR_CONFIG)
    this.configCharTx = await this.service.getCharacteristic(CHAR_CONFIG_TX)
    this.motionCharTx = await this.service.getCharacteristic(CHAR_MOTION_TX)

    device.addEventListener(
      'gattserverdisconnected',
      action(() => {
        console.log('device disconneted')
        this.connected = false

        this.infoChar = null
        this.configChar = null
        this.configCharTx = null
        this.motionCharTx = null

        this._attemptReconnect()
      })
    )

    this.configChar.addEventListener('characteristicvaluechanged', () =>
      this._onConfigUpdate()
    )
    await this.configChar.startNotifications()
    await this.configChar.readValue()

    this.infoChar.addEventListener('characteristicvaluechanged', () =>
      this._onInfoUpdate()
    )
    await this.infoChar.startNotifications()
    await this.infoChar.readValue()
  }

  async sendConfig(id: string, value: number) {
    await this._sendText(this.configCharTx, `${id}:${value.toFixed(4)}`)
  }

  async sendConfigList(update: Record<string, number>) {
    for (const [id, value] of Object.entries(update)) {
      await this.sendConfig(id, value)
    }
  }

  async sendMotion(cmd: MotionCmd) {
    const text = cmd.map(([k, v]) => k + v.toFixed(3)).join(' ')
    console.log(text)
    await this._sendText(this.motionCharTx, text)
  }

  _decodeText(
    char: BluetoothRemoteGATTCharacteristic | null = null
  ): Record<string, number> | null {
    if (!char) return null

    const data = char.value
    if (!data) return null

    const res = {}
    const decoder = new TextDecoder()
    const text = decoder.decode(data)
    text
      .split('|')
      .map((entry) => entry.split(':'))
      .forEach(([key, value]) => (res[key] = parseFloat(value)))
    return res
  }

  async _sendText(
    char: BluetoothRemoteGATTCharacteristic | null = null,
    text: string
  ) {
    if (!char) return

    const encoder = new TextEncoder()
    const buffer = encoder.encode(text)
    await char.writeValueWithoutResponse(buffer)
  }

  _onConfigUpdate() {
    const config = this._decodeText(this.configChar)
    console.log('device config updated:', config)
    this.deviceConfig = config
  }

  _onInfoUpdate() {
    const info = this._decodeText(this.infoChar)
    console.log('device info updated:', info)
    this.deviceInfo = info
  }
}
