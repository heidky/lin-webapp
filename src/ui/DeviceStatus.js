import { observer } from 'mobx-react-lite'
import { deviceManger } from '../store/store'
import { FiBluetooth } from 'react-icons/fi'
import { RiRestartLine } from 'react-icons/ri'

const StatusDot = ({ status }) => (
  <div
    className={`${
      { on: 'bg-green-400', off: 'bg-gray-600', wait: 'bg-yellow-400' }[status]
    } h-5 w-5 rounded-md shrink-0  transition-colors`}
  />
)

const ConnectButton = ({ onClick }) => (
  <button
    className="text-white bg-gray-600 text-xl p-1.5 rounded-md flex flex-row items-center gap-x-2 px-3"
    onClick={onClick}
  >
    <span className="text-sm font-bold text-gray-200 tracking-wider">
      Connect
    </span>{' '}
    <FiBluetooth />
  </button>
)

const RestartButton = ({ onClick }) => (
  <button
    className="text-white bg-gray-600 text-xl p-1.5 rounded-md flex flex-row items-center"
    onClick={onClick}
  >
    <RiRestartLine />
  </button>
)

function DeviceStatus() {
  const connected = deviceManger.connected
  const name = deviceManger.deviceName
  const reconencting = deviceManger.reconnecting
  const status = reconencting ? 'wait' : connected ? 'on' : 'off'

  const onConnect = () => {
    deviceManger.connectPrompt()
  }

  const onRestart = () => {
    deviceManger.restartDevice()
  }

  return (
    <div className="flex flex-row items-center gap-x-3">
      <StatusDot status={status} />

      <span
        className={`text-xl font-bold ${name ? 'text-white' : 'text-gray-500'}`}
      >
        {name || 'No Device'}
      </span>

      <div className="flex-grow" />

      {!connected && <ConnectButton onClick={onConnect} />}
      {connected && <RestartButton onClick={onRestart} />}
    </div>
  )
}

export default observer(DeviceStatus)
