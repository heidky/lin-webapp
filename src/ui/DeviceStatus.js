import { observer } from 'mobx-react-lite'
import { deviceManger } from '../store/store'

function DeviceStatus() {
  const connected = deviceManger.connected
  const name = deviceManger.deviceName

  const onConnect = () => {
    deviceManger.connectPrompt()
  }

  return (
    <div className="flex flex-row items-center gap-x-4">
      <span className="text-white">
        {connected ? 'Device connected' : 'No device'}
      </span>

      {name && <span className="text-gray-200 ml-2">{name}</span>}

      {!connected && (
        <button className="text-white bg-gray-600" onClick={onConnect}>
          Connect
        </button>
      )}
    </div>
  )
}

export default observer(DeviceStatus)
