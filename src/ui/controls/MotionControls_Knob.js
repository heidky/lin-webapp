import Pad2D from './Pad2D'
import { motionManager } from '../../store/store'
import { observer } from 'mobx-react-lite'
import { StopButton } from './common'
import Knob from './Knob'

function MotionControl() {
  const vibeThrow = motionManager.vibeThrow
  const vibeSpeed = motionManager.vibeSpeed
  const vibeActive = vibeThrow > 0 && vibeSpeed > 0
  const vibeSelected = motionManager.vibeSelected

  const onThrowChange = (x, y) =>
    motionManager.setVibe(y, motionManager.vibeSpeed)

  const onSpeedChange = (v) => motionManager.setVibe(motionManager.vibeThrow, v)

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex flex-col justify-center mt-2">
        <div className="flex flex-row">
          <div className="h-72 w-10">
            <Pad2D
              valid={!vibeSelected}
              x={0.5}
              y={vibeThrow}
              onMove={onThrowChange}
            />
          </div>
          <div className="flex-grow flex flex-col items-center justify-center">
            <Knob value={vibeSpeed} onChange={onSpeedChange} />
          </div>
        </div>

        <div className="mb-4" />
        <StopButton
          disabled={!vibeActive}
          onClick={() => motionManager.stopVibe()}
        />
      </div>
    </div>
  )
}

export default observer(MotionControl)
