import Pad2D from './Pad2D_Double'
import { motionManager } from '../../store/store'
import { observer } from 'mobx-react-lite'
import { StopButton } from './common'
import Knob from './Knob'
import { useEffect, useState } from 'react'

function MotionControl() {
  const vibeThrow = motionManager.vibeThrow
  const vibeSpeed = motionManager.vibeSpeed
  const vibeActive = vibeThrow > 0 && vibeSpeed > 0
  const vibeSelected = motionManager.vibeSelected

  const onRangeChange = (btm, top) =>
    motionManager.setVibeWithZero(1 - top, 1 - btm, motionManager.vibeSpeed)

  const onSpeedChange = (s) => motionManager.setVibeWithZero(null, null, s)

  const [yBtm, setYBtm] = useState(1 - motionManager.vibeThrow)
  const [yTop, setYTop] = useState(1 - motionManager.vibeZero)

  if (yBtm > yTop) {
    const y = (yTop + yBtm) / 2
    setYBtm(y)
    setYTop(y)
  }

  useEffect(() => onRangeChange(yBtm, yTop), [yTop, yBtm])

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex flex-col justify-center mt-2">
        <div className="flex flex-row">
          <div className="h-72 w-10">
            <Pad2D
              yBtm={yBtm}
              yTop={yTop}
              onMoveBtm={(y) => setYBtm(y)}
              onMoveTop={(y) => setYTop(y)}
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
