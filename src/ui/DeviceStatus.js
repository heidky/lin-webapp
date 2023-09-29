import { observer } from 'mobx-react-lite'
import { deviceManger } from '../store/store'
import { FiBluetooth } from 'react-icons/fi'
import { RiRestartLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'

const StatusDot = ({ status }) => (
  <div
    className={`${
      { on: 'bg-green-400', off: 'bg-gray-600', wait: 'bg-yellow-400' }[status]
    } h-5 w-5 rounded-md shrink-0  transition-colors`}
  />
)

const ConnectButton = ({ onClick }) => (
  <button
    className="text-white bg-blue-600 hover:bg-opacity-90 text-xl p-1.5 rounded-md flex flex-row items-center gap-x-2 px-3"
    onClick={onClick}
  >
    <span className="text-sm font-bold text-gray-200 tracking-wider">
      Connect
    </span>{' '}
    <FiBluetooth />
  </button>
)

const RestartButton = ({ onClick, hz = 60, time = 1 }) => {
  const [pressed, setPressed] = useState(false)
  const [fired, setFired] = useState(false)
  const [perc, setPerc] = useState(0)

  const bgRight = ((1 - perc) * 100).toFixed(2) + '%'

  useEffect(() => {
    if (pressed) {
      const handle = setInterval(() => {
        setPerc((p) => p + (1 / hz) * (1 / time))
      }, 1000 / hz)
      return () => clearInterval(handle)
    } else {
      setPerc(0)
      setFired(false)
    }
  }, [pressed, hz, time])

  useEffect(() => {
    if (perc >= 1.1 && !fired) {
      setFired(true)
      onClick()
    }
  }, [perc, fired, onClick])

  return (
    <button
      className="text-white bg-gray-600 text-xl p-1.5 rounded-md flex flex-row items-center relative overflow-hidden select-none"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onBlur={() => setPressed(false)}
    >
      <div
        className={`absolute top-0 bottom-0 left-0 transition-colors ${
          fired ? 'bg-green-500' : 'bg-orange-500'
        }`}
        style={{ right: bgRight }}
      />
      <span className="text-sm font-bold text-gray-200 tracking-wider mr-2 z-10">
        Reset
      </span>{' '}
      <span className="z-10">
        <RiRestartLine />
      </span>
    </button>
  )
}

function DeviceStatus() {
  const connected = deviceManger.connected
  const name = deviceManger.deviceName
  const reconencting = deviceManger.reconnecting
  const status = reconencting ? 'wait' : connected ? 'on' : 'off'

  const stateLabel = [
    'Booting...',
    'Calibrating[↑]...',
    'Calibrating[↓]...',
    (deviceManger.deviceInfo?.rodLenght?.toFixed(1) || '0.0') + 'cm',
    <span className="text-red-500">Error</span>,
    'Disconnected',
  ][deviceManger.deviceInfo?.state || 5]

  const onConnect = () => {
    deviceManger.connectPrompt()
  }

  const onRestart = () => {
    deviceManger.restartDevice()
    console.log('Restart request')
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <StatusDot status={status} />

      <span
        className={`text-xl font-bold ${name ? 'text-white' : 'text-gray-500'}`}
      >
        {name || 'No Device'}
      </span>

      {name && (
        <span className="text-lg text-gray-400 font-bold">• {stateLabel}</span>
      )}

      <div className="flex-grow" />

      {!connected && <ConnectButton onClick={onConnect} />}
      {connected && <RestartButton onClick={onRestart} />}
    </div>
  )
}

export default observer(DeviceStatus)
