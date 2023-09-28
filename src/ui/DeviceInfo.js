import { observer } from 'mobx-react-lite'
import { deviceManger } from '../store/store'

function DeviceInfo() {
  const connected = deviceManger.connected

  return (
    <div className="flex flex-row items-center gap-x-4">
      {connected && (
        <div className="text-white">
          {JSON.stringify(deviceManger.deviceInfo)}
        </div>
      )}
    </div>
  )
}

export default observer(DeviceInfo)
