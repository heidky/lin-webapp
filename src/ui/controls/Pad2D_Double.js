import { useEffect, useRef, useState } from 'react'

/**
 *
 */
function getElementPositionRelative(element, event) {
  const r = element.parentElement.getBoundingClientRect()
  const w = r.width
  const h = r.height
  const x = event.clientX - r.left
  const y = event.clientY - r.top

  return [1 - x / w, 1 - y / h]
}

/**
 *
 */
function moveElement(element, x, y) {
  element.style.left = x * 100 + '%'
  element.style.top = y * 100 + '%'
}

/**
 *
 */
function useThumb(y, onMove) {
  y = 1 - y
  const ref = useRef()
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const onDown = () => setPressed(true)
    ref.current.addEventListener('pointerdown', onDown)

    return () => ref?.current?.removeEventListener('pointerdown', onDown)
  }, [ref.current])

  // move when y changes
  useEffect(() => {
    moveElement(ref.current, 0, y)
  }, [y])

  // handle pointer moved on window
  useEffect(() => {
    const onMove_window = (e) => {
      if (e.buttons === 1 && e.pressure > 0) {
        if (pressed) {
          let [, py] = getElementPositionRelative(ref.current, e)
          if (py > 1) py = 1
          if (py < 0) py = 0
          onMove(py)
        }
      } else {
        setPressed(false)
      }
    }

    window.addEventListener('pointermove', onMove_window)
    window.addEventListener('pointerdown', onMove_window)
    return () => {
      window.removeEventListener('pointermove', onMove_window)
      window.removeEventListener('pointerdown', onMove_window)
    }
  }, [pressed, onMove])

  // handle pointer up on window
  useEffect(() => {
    const onUp = () => setPressed(false)
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [pressed])

  return [ref, pressed]
}

/**
 *
 */
const ThumbTop = ({ refElement, pressed }) => (
  <div ref={refElement} className="h-10 w-10 absolute">
    <div
      className={`rounded-t-lg h-full w-full border-solid border-white border-b-2 ${
        !pressed ? 'bg-gray-400' : 'bg-pink-400'
      }`}
      style={{ marginLeft: '-50%', marginTop: '-100%' }}
    ></div>
  </div>
)

/**
 *
 */
const ThumbBtm = ({ refElement, pressed }) => (
  <div ref={refElement} className="h-10 w-10 absolute">
    <div
      className={`rounded-b-lg h-full w-full border-solid border-white border-t-2 ${
        !pressed ? 'bg-blue-400' : 'bg-pink-400'
      }`}
      style={{ marginLeft: '-50%', marginTop: '0%%' }}
    ></div>
  </div>
)

/**
 *
 */
export default function Pad2D({ yBtm, yTop, onMoveBtm, onMoveTop }) {
  const [refBtm, pressedBtm] = useThumb(yBtm, onMoveBtm)
  const [refTop, pressedTop] = useThumb(yTop, onMoveTop)

  return (
    <div className="h-full w-10 bg-gray-600 rounded-lg select-none touch-none px-5 py-10">
      <div
        className="h-full w-full relative select-none"
        // onPointerDown={() => setPress(true)}
        // onPointerLeave={() => setPress(false)}
        // onBlur={() => setPress(false)}
      >
        <ThumbTop refElement={refTop} pressed={pressedTop} />
        <ThumbBtm refElement={refBtm} pressed={pressedBtm} />
      </div>
    </div>
  )
}
