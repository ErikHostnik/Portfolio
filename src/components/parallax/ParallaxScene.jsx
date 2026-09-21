import { useEffect, useMemo, useRef } from 'react'
import useInView from '../../hooks/useInView'
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion'

const BASE_SPEED = 8 // px/sec, farthest layer
const SPEED_STEP = 10 // px/sec added per layer toward the foreground

function defaultSpeeds(count) {
  return Array.from({ length: count }, (_, i) => BASE_SPEED + i * SPEED_STEP)
}

const VIEWPORT_OPTIONS = { threshold: 0 }

export default function ParallaxScene({ layers, speeds, className = '' }) {
  const [containerRef, inView] = useInView(VIEWPORT_OPTIONS)
  const prefersReducedMotion = usePrefersReducedMotion()
  const trackRefs = useRef([])
  const offsets = useRef(layers.map(() => 0))
  const frameRef = useRef(null)
  const lastTimeRef = useRef(null)

  const resolvedSpeeds = useMemo(
    () => speeds ?? defaultSpeeds(layers.length),
    [speeds, layers]
  )

  useEffect(() => {
    if (!inView || prefersReducedMotion) {
      return undefined
    }

    const tick = (time) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const deltaSeconds = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      layers.forEach((_, i) => {
        const node = trackRefs.current[i]
        const width = node?.offsetWidth || 0
        if (!node || width === 0) return
        offsets.current[i] = (offsets.current[i] + resolvedSpeeds[i] * deltaSeconds) % (width / 2)
        node.style.transform = `translateX(-${offsets.current[i]}px)`
      })

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      lastTimeRef.current = null
    }
  }, [inView, prefersReducedMotion, layers, resolvedSpeeds])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {layers.map((src, i) => (
        <div
          key={src}
          ref={(node) => { trackRefs.current[i] = node }}
          className="absolute inset-y-0 left-0 h-full w-[200%] flex"
        >
          <img src={src} alt="" className="pixelated h-full w-1/2 object-cover" draggable={false} />
          <img src={src} alt="" className="pixelated h-full w-1/2 object-cover" draggable={false} />
        </div>
      ))}
    </div>
  )
}
