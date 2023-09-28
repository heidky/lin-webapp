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

      if (e.buttons === 1) {
        // console.log(x, y, h, w)
        if (press) onPosUpdate(px, py)
      } else {
        setPress(false)
      }
    }

    window.addEventListener('pointermove', onMove1)
    return () => window.removeEventListener('pointermove', onMove1)
  }, [press, onPosUpdate])

  const onDown = (e) => {
    setPress(true)
    const [px, py] = getPos(div.current, e)
    onPosUpdate(px, py)
  }

  return (
    <div className="h-full w-full bg-gray-600 rounded-xl select-none p-4">
      <div
        ref={div}
        className="h-full w-full relative select-none"
        // onPointerDown={() => setPress(true)}
        onPointerDown={onDown}
        // onPointerLeave={() => setPress(false)}
        // onBlur={() => setPress(false)}
      >
        <div ref={thumb} className="h-8 w-8 absolute">
          <div
            className={`rounded-full h-full w-full ${
              !valid ? 'bg-gray-400' : 'bg-fuchsia-400'
            }`}
            style={{ marginLeft: '-50%', marginTop: '-50%' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
