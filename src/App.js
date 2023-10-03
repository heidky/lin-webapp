import DeviceStatus from './ui/DeviceStatus'
import { observer } from 'mobx-react-lite'
import MotionControls from './ui/controls/MotionControls'
import { useState } from 'react'
import ConfigPanel from './ui/config/ConfigPanel'

function App() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-stretch justify-stretch bg-zinc-900 ">
      <div className="flex flex-col items-stretch p-4 lg:w-96 relative flex-grow lg:flex-grow-0">
        <DeviceStatus onSettings={() => setShowSettings(true)} />
        <div className="h-4" />
        <MotionControls />

        {showSettings && (
          <div
            className="absolute top-0 bottom-0 left-0 right-0 z-100 flex flex-row items-start bg-opacity-30 bg-black "
            onClick={() => setShowSettings(false)}
          >
            <div
              className="bg-gray-800 flex-grow rounded-xl m-2 mt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <ConfigPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(App)
