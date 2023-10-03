import { useState } from 'react'
import ControlsSelectionTab from './ControlsSelectionTabs'
import MotionControls_Pad from './MotionControls_Pad'
import MotionControls_Knob from './MotionControls_Knob'

function MotionControl() {
  const [mode, setMode] = useState('knob')

  return (
    <div className="flex flex-col w-full">
      <ControlsSelectionTab selected={mode} onSelect={setMode} />
      <div className="mb-4" />

      {mode === '2d' && <MotionControls_Pad />}
      {mode === 'knob' && <MotionControls_Knob />}
    </div>
  )
}

export default MotionControl
