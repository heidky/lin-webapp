import { useCallback, useEffect, useRef, useState } from 'react'

const Notch = ({ rotation }) => (
  <div
    className="abs h-full w-full absolute top-0 bottom-0 left-0 right-0 pointer-events-none"
    style={{ transform: `rotate(${rotation.toFixed(1)}deg)` }}
  >
    <div
      className={`h-3 w-3 rounded-full absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-600`}
    />
  </div>
)

export default function Knob({
  value,
  onChange,
  pxPerUnit = 300,
  rotationMin = -135,
  rotationMax = 135,
}) {
  const div = useRef()
  const [startPos, setStartPos] = useState(null)
  const press = startPos !== null

  const rotation = value * (rotationMax - rotationMin) + rotationMin
  const active = value > 0

  const onPosUpdate = useCallback(
    (x, y) => {
      if (!startPos) return
      const [x0, y0] = startPos
      const [dx, dy] = [x - x0, y - y0]
      setStartPos([x, y])

      onChange(value + -dy / pxPerUnit)
    },
    [startPos, onChange, value, pxPerUnit]
  )

  useEffect(() => {
    const onMove1 = (e) => {
      if (!div.current) return
      const [px, py] = [e.clientX, e.clientY]

      if (e.buttons === 1 && e.pressure > 0) {
        if (press) onPosUpdate(px, py)
      } else {
        setStartPos(null)
      }
    }

    window.addEventListener('pointermove', onMove1)
    window.addEventListener('pointerdown', onMove1)
    return () => {
      window.removeEventListener('pointermove', onMove1)
      window.removeEventListener('pointerdown', onMove1)
    }
  }, [press, onPosUpdate])

  // stop pressing on pointer up
  useEffect(() => {
    const onUp = () => setStartPos(null)
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [press])

  const onDown = (e) => {
    const [x0, y0] = [e.clientX, e.clientY]
    setStartPos([x0, y0])
    onPosUpdate(x0, y0)
  }

  return (
    <div className="select-none touch-none h-32 w-32 relative">
      <div
        ref={div}
        onPointerDown={onDown}
        className="bg-gray-600 active:bg-opacity-75 active:bg-gray-500 rounded-full w-full h-full relative select-none transition-colors"
        style={{ transform: `rotate(${rotation.toFixed(1)}deg)` }}
        // onPointerDown={() => setPress(true)}
        // onPointerLeave={() => setPress(false)}
        // onBlur={() => setPress(false)}
      >
        <div
          className={`h-3 w-3 rounded-full absolute top-4 left-1/2 -translate-x-1/2 ${
            active ? 'bg-fuchsia-400 ' : 'bg-gray-400'
          }`}
        />
      </div>

      <Notch rotation={rotationMax} />
      <Notch rotation={rotationMin} />
      <Notch rotation={(rotationMax + rotationMin) / 2} />

      <div className="absolute pointer-events-none top-full left-1/2 -translate-x-1/2 mt-4">
        <span className="text-gray-500 text-2xl font-bold">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
