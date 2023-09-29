import DeviceStatus from './ui/DeviceStatus'
import { observer } from 'mobx-react-lite'
import MotionControls from './ui/MotionControls'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-stretch justify-stretch bg-zinc-900 ">
      <div className="flex flex-col items-stretch p-4 lg:w-96">
        <DeviceStatus />
        <div className="h-4" />
        <MotionControls />
      </div>
    </div>
  )
}

export default observer(App)
