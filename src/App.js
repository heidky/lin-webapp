import DeviceInfo from './ui/DeviceInfo'
import DevicePos from './ui/DevicePos'
import DeviceStatus from './ui/DeviceStatus'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-stretch justify-stretch bg-gray-900">
      <DeviceStatus />
      <DeviceInfo />
      <DevicePos />
    </div>
  )
}

export default App
