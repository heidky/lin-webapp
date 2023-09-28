import DeviceInfo from './ui/DeviceInfo'
import DevicePos from './ui/DevicePos'
import DeviceStatus from './ui/DeviceStatus'
import Pad2D from './ui/Pad2D'
import { motionManager } from './store/store'
import { observer } from 'mobx-react-lite'

function App() {
  const x = motionManager.vibePos[0]
  const y = motionManager.vibePos[1]
  const valid = x > 0 && y > 0
  return (
    <div className="min-h-screen flex flex-col items-stretch justify-stretch bg-gray-900 p-8">
      <DeviceStatus />
      <DeviceInfo />
      <DevicePos />

      <div className="w-64 h-64">
        <Pad2D
          valid={valid}
          x={x}
          y={y}
          onMove={(x, y) => motionManager.setVibePos(x, y)}
        />
      </div>

      <div className="w-64 flex flex-row justify-center">
        <button
          className="text-white text-lg p-2 bg-fuchsia-600 rounded-lg w-full"
          onClick={() => motionManager.stopVibe()}
        >
          Stop
        </button>
      </div>
    </div>
  )
}

export default observer(App)
