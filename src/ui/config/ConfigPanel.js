import { observer } from 'mobx-react-lite'
import { useState, useEffect } from 'react'
import { deviceManger } from '../../store/store'

const ConfigInput = ({ config, id, onValue, disabled: dis }) => {
  const value = config?.[id] ?? ''
  const disabled = value === undefined || value === null || dis

  const onChange = (e) => {
    onValue(id, e.target.value)
  }

  return (
    <input
      type="number"
      className="w-full"
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

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

function ConfigPanel() {
  const connected = deviceManger.connected
  // const name = deviceManger.deviceName
  const deviceConfig = deviceManger.deviceConfig

  const [localConfig, setLocalConfig] = useState({ ...deviceConfig })
  const showForm = (connected && deviceConfig) || true
  const [pending, setPending] = useState(false)
  const dirty = isMapDiff(localConfig, deviceConfig)

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
      <h1>Configuration</h1>
      {showForm && (
        <>
          <h2>PID</h2>
          <table>
            <thead>
              <tr>
                <td></td>
                <td>P</td>
                <td>I</td>
                <td>D</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3">P</td>
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
                <td className="px-3">S</td>
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

          <h2>Motor</h2>
          <div className="flex flex-row gap-x-1">
            <div className="flex flex-col">
              <label>Tolerance</label>
              <ConfigInput {...inputProps} id={'To'} />
            </div>
            <div className="flex flex-col">
              <label>Force</label>
              <ConfigInput {...inputProps} id={'F'} />
            </div>
            <div className="flex flex-col">
              <label>Smoothing</label>
              <ConfigInput {...inputProps} id={'Ta'} />
            </div>
          </div>

          <div className="flex flex-row gap-x-2">
            <button onClick={onReset} disabled={!dirty || pending}>
              Reset
            </button>
            <button onClick={onSend} disabled={!dirty || pending}>
              Send
            </button>
          </div>
          {pending && 'sending'}
        </>
      )}
    </div>
  )
}

export default observer(ConfigPanel)
