import { RefObject, useCallback, useEffect, useRef, useState } from "react"

const DEFER_MS = 300

export type Timer = {
  time: number
  start: (time: number) => void
  stop: () => void
  reset: () => void
  running: boolean
}

export default function useTimer(): Timer {
  const [time, setTime] = useState(0)

  const runningRef: RefObject<boolean> = useRef(false)
  const rafIdRef: RefObject<number | null> = useRef<number | null>(null)

  const lastFrameRef: RefObject<number | null> = useRef<number | null>(null)
  const accumulatedRef: RefObject<number> = useRef<number>(0)
  const deferredRef: RefObject<number> = useRef<number>(0)

  const loop = useCallback((now: number): void => {
    if (!runningRef.current) {
      return
    }

    if (lastFrameRef.current !== null) {
      const delta: number = now - lastFrameRef.current

      accumulatedRef.current += delta
      deferredRef.current += delta

      if (deferredRef.current >= DEFER_MS) {
        setTime(accumulatedRef.current)
        deferredRef.current = 0
      }
    }

    lastFrameRef.current = now
    rafIdRef.current = requestAnimationFrame(loop)
  }, [])

  const start = useCallback(
    (startTimeMs: number): void => {
      if (runningRef.current) {
        return
      }

      accumulatedRef.current = startTimeMs
      deferredRef.current = 0
      setTime(startTimeMs)

      runningRef.current = true
      lastFrameRef.current = null
      rafIdRef.current = requestAnimationFrame(loop)
    },
    [loop],
  )

  const stop = useCallback((): void => {
    if (!runningRef.current) {
      return
    }

    runningRef.current = false

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    lastFrameRef.current = null

    // flush final value
    setTime(accumulatedRef.current)
  }, [])

  const reset = useCallback((): void => {
    stop()
    accumulatedRef.current = 0
    deferredRef.current = 0
    setTime(0)
  }, [stop])

  // Cleanup on unmount
  useEffect((): (() => void) => {
    return (): void => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return {
    time,
    start,
    stop,
    reset,
    running: runningRef.current,
  }
}
