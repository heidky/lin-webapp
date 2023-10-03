import Pad2D from './Pad2D'
import { motionManager } from '../../store/store'
import { observer } from 'mobx-react-lite'
import { Indicator, StopButton } from './common'

function MotionControl() {
  const vibeThrow = motionManager.vibeThrow
  const vibeSpeed = motionManager.vibeSpeed
  const vibeActive = vibeThrow > 0 && vibeSpeed > 0
  const vibeSelected = motionManager.vibeSelected

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full">
        <div className="flex flex-col flex-grow">
          <Indicator isOn={vibeSelected} />
          <div className="w-full aspect-square">
            <Pad2D
              valid={vibeActive && vibeSelected}
              x={vibeSpeed}
              y={vibeThrow}
              onMove={(x, y) => motionManager.setVibe(y, x)}
            />
          </div>
        </div>

        <div className="flex flex-col self-stretch ml-2">
          <Indicator isOn={!vibeSelected} />
          <div className="w-10 flex-grow">
            <Pad2D
              valid={!vibeSelected}
              x={0.5}
              y={1 - motionManager.absolutePosition}
              onMove={(x, y) => {
                motionManager.setAbsolutePosition(1 - y)
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row justify-center mt-2">
        <StopButton
          disabled={!vibeActive}
          onClick={() => motionManager.stopVibe()}
        />
      </div>
    </div>
  )
}

export default observer(MotionControl)
