import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { deviceManger } from '../../store/store'
import RestartDeviceButton from './RestartDeviceButton'

function asNumericalMap(obj) {
  const entries = Object.entries(obj).map(([id, value]) => [
    id,
    Number(value) || 0,
  ])

  return Object.fromEntries(entries)
}

function isMapDiff(src, dest) {
  return (
    Object.keys(src)
      .map((id) => src[id] !== dest[id])
      .filter((x) => x).length > 0
  )
}

const ConfigInput = ({ config, id, onValue, disabled: dis }) => {
  let value = config?.[id] ?? ''

  const disabled = value === undefined || value === null || dis

  const onChange = (e) => {
    const v = e.target.value.replace(/[^0-9-.]+/, '')
    onValue(id, v)
  }

  return (
    <input
      type="text"
      className="w-full rounded-md bg-gray-600 text-gray-300 px-4 py-1 focus:text-white focus:bg-gray-600 font-mono disabled:text-gray-400"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

const Label = ({ children }) => (
  <label className="text-gray-300 font-bold text-md">{children}</label>
)

const Button = ({ onClick, children, disabled, className = '' }) => (
  <button
    disabled={disabled}
    className={`text-white bg-gray-600 hover:bg-opacity-90 disabled:opacity-50 disabled:bg-gray-700 p-1.5 rounded-md flex flex-row items-center gap-x-2 px-3 font-bold text-md tracking-wide transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

function ConfigPanel() {
  const connected = deviceManger.connected
  // const name = deviceManger.deviceName
  const deviceConfig = deviceManger.deviceConfig

  const [localConfig, setLocalConfig] = useState({ ...deviceConfig })
  const showForm = (connected && deviceConfig) || true
  const [pending, setPending] = useState(false)
  const dirty = isMapDiff(localConfig, deviceConfig)

  const onRestart = () => {
    deviceManger.restartDevice()
    console.log('Restart request')
  }

  // reset local config when `deviceConfig` updates
  useEffect(() => {
    console.log('update device config', { ...deviceConfig })
    setLocalConfig({ ...deviceConfig })
  }, [deviceConfig])

  const onReset = () => {
    setLocalConfig({ ...deviceConfig })
  }

  const onSend = () => {
    setPending(true)

    const toSend = asNumericalMap(localConfig)
    deviceManger
      .sendConfigList(toSend)
      .then(() => setPending(false))
      .catch((e) => {
        setPending(false)
        console.error(e)
      })
  }

  const onValueUpdate = (id, value) => {
    setLocalConfig((c) => ({ ...c, [id]: value }))
  }

  const inputProps = {
    config: localConfig,
    onValue: onValueUpdate,
    disabled: !connected || pending,
  }

  return (
    <div className="flex flex-col p-3">
      <h1 className="text-2xl font-bold text-gray-400">Configuration</h1>
      {showForm && (
        <>
          <h2 className="text-xl font-bold text-gray-300 mt-4">PID</h2>
          <table className="gap-x-3">
            <thead>
              <tr>
                <td></td>
                <td className="text-center">
                  <Label>P</Label>
                </td>
                <td className="text-center">
                  <Label>I</Label>
                </td>
                <td className="text-center">
                  <Label>D</Label>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3">
                  <Label>P</Label>
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Pp'} />
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Pi'} />
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Pd'} />
                </td>
              </tr>
              <tr>
                <td className="px-3">
                  <Label>S</Label>
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Vp'} />
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Vi'} />
                </td>
                <td>
                  <ConfigInput {...inputProps} id={'Vd'} />
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-bold text-gray-300 mt-6 mb-2">Motor</h2>
          <div className="flex flex-row gap-x-1">
            <div className="flex flex-col">
              <Label>Tolerance</Label>
              <ConfigInput {...inputProps} id={'To'} />
            </div>
            <div className="flex flex-col">
              <Label>Force</Label>
              <ConfigInput {...inputProps} id={'F'} />
            </div>
            <div className="flex flex-col">
              <Label>Smoothing</Label>
              <ConfigInput {...inputProps} id={'Ta'} />
            </div>
          </div>

          <div className="flex flex-row gap-x-2 my-4 justify-end">
            <Button onClick={onReset} disabled={!dirty || pending}>
              Reset
            </Button>
            <Button
              onClick={onSend}
              disabled={!dirty || pending}
              className="bg-blue-500"
            >
              Send
            </Button>
          </div>

          <div className="h-1 bg-gray-700 rounded-full mb-4" />

          <RestartDeviceButton
            onClick={onRestart}
            time={1}
            disabled={!connected}
          />
        </>
      )}
    </div>
  )
}

export default observer(ConfigPanel)
