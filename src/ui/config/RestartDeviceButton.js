import { useEffect, useState } from 'react'
import { RiRestartLine } from 'react-icons/ri'

export default function RestartDeviceButton({
  onClick,
  hz = 60,
  time = 1,
  disabled = false,
}) {
  const [pressed, setPressed] = useState(false)
  const [fired, setFired] = useState(false)
  const [perc, setPerc] = useState(0)

  const bgRight = ((1 - perc) * 100).toFixed(2) + '%'

  useEffect(() => {
    if (pressed && !disabled) {
      const handle = setInterval(() => {
        setPerc((p) => p + (1 / hz) * (1 / time))
      }, 1000 / hz)
      return () => clearInterval(handle)
    } else {
      setPerc(0)
      setFired(false)
    }
  }, [pressed, hz, time, disabled])

  useEffect(() => {
    if (perc >= 1.1 && !fired) {
      setFired(true)
      onClick()
    }
  }, [perc, fired, onClick])

  return (
    <button
      className="text-white bg-gray-600 hover:bg-opacity-90 active:bg-gray-500 disabled:bg-gray-700 text-xl p-1.5 rounded-md flex flex-row items-center justify-center relative overflow-hidden select-none"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onBlur={() => setPressed(false)}
      disabled={disabled}
    >
      <div
        className={`absolute top-0 bottom-0 left-0 transition-colors ${
          fired ? 'bg-green-500' : 'bg-orange-500'
        }`}
        style={{ right: bgRight }}
      />
      <span className="z-10">
        <RiRestartLine />
      </span>{' '}
      <span className="text-sm font-bold text-gray-200 tracking-wider ml-2 z-10">
        Reset Device
      </span>
    </button>
  )
}
