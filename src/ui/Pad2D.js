import { useCallback, useEffect, useRef, useState } from 'react'

function getPos(element, e) {
  const r = element.getBoundingClientRect()
  const w = r.width
  const h = r.height
  const x = e.clientX - r.left
  const y = e.clientY - r.top

  return [x / w, y / h]
}

function moveToPos(element, x, y) {
  element.style.left = x * 100 + '%'
  element.style.top = y * 100 + '%'
}

export default function Pad2D({ x, y, onMove, valid = true }) {
  y = 1 - y
  const [press, setPress] = useState(false)
  const div = useRef()
  const thumb = useRef()

  useEffect(() => {
    moveToPos(thumb.current, x, y)
  }, [x, y])

  const onPosUpdate = useCallback(
    (x, y) => {
      y = 1 - y
      onMove(x, y)
    },
    [onMove]
  )

  useEffect(() => {
    // console.log('effect', div.current)
    const onMove1 = (e) => {
      // console.log('h')
      if (!div.current) return
      const [px, py] = getPos(div.current, e)

      if (e.buttons === 1 && e.pressure > 0) {
        // console.log(x, y, h, w)
        if (press) onPosUpdate(px, py)
      } else {
        setPress(false)
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
    const onUp = () => setPress(false)
    window.addEventListener('pointerup', onUp)
    return () => window.removeEventListener('pointerup', onUp)
  }, [press])

  const onDown = (e) => {
    setPress(true)
    const [px, py] = getPos(div.current, e)
    if (px >= 0 && px <= 1 && py >= 0 && py <= 1) onPosUpdate(px, py)
  }

  return (
    <div
      className="h-full w-full bg-gray-600 rounded-lg select-none touch-none p-5"
      onPointerDown={onDown}
    >
      <div
        ref={div}
        className="h-full w-full relative select-none"
        // onPointerDown={() => setPress(true)}
        // onPointerLeave={() => setPress(false)}
        // onBlur={() => setPress(false)}
      >
        <div ref={thumb} className="h-10 w-10 absolute">
          <div
            className={`rounded-lg h-full w-full ${
              !valid ? 'bg-gray-400' : 'bg-pink-400'
            }`}
            style={{ marginLeft: '-50%', marginTop: '-50%' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
