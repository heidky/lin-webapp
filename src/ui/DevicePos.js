import { observer } from 'mobx-react-lite'
import ReactSlider from 'react-slider'
import { deviceManger, motionManager } from '../store/store'

function DevicePos() {
  const absolute = motionManager.absolutePosition
  const onAbsoluteChange = (pos) => {
    motionManager.setAbsolutePosition(pos)
  }

  return (
    <div className="flex flex-row items-center gap-x-4">
      <div className="text-white">
        <ReactSlider
          className="h-8 w-64 bg-pink-500"
          thumbClassName="h-8 w-8 bg-pink-300"
          trackClassName="bg-green-500"
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          value={absolute * 100}
          onChange={(e) => onAbsoluteChange(e / 100)}
        />
      </div>
    </div>
  )
}

export default observer(DevicePos)
