import { observer } from 'mobx-react-lite'
import { deviceManger } from '../store/store'
import { FiBluetooth } from 'react-icons/fi'
import { IoIosSettings } from 'react-icons/io'

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

const SettingsButton = ({ onClick }) => (
  <button
    className="text-white bg-gray-600 hover:bg-opacity-90 text-xl p-1.5 rounded-md flex flex-row items-center gap-x-2 px-3"
    onClick={onClick}
  >
    {/* <span className="text-sm font-bold text-gray-200 tracking-wider">
      S
    </span>{' '} */}
    <IoIosSettings />
  </button>
)

function DeviceStatus({ onSettings }) {
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

  return (
    <div className="flex flex-row items-center gap-x-2 relative">
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

      {connected && <SettingsButton onClick={onSettings} />}
      {!connected && <ConnectButton onClick={onConnect} />}
    </div>
  )
}

export default observer(DeviceStatus)
