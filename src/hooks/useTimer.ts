import { RefObject, useCallback, useEffect, useRef, useState } from "react"

type Timer = {
  time: number
  start: () => void
  stop: () => void
  reset: () => void
  running: boolean
}

export default function useTimer(autoStart: boolean): Timer {
  const [time, setTime] = useState(0)

  const runningRef: RefObject<boolean> = useRef(false)
  const lastTimeRef: RefObject<number | null> = useRef<number | null>(null)
  const rafIdRef: RefObject<number | null> = useRef<number | null>(null)

  const loop = useCallback((now: number): void => {
    if (!runningRef.current) {
      return
    }

    if (lastTimeRef.current !== null) {
      const delta: number = now - lastTimeRef.current
      setTime(t => t + delta)
    }

    lastTimeRef.current = now
    rafIdRef.current = requestAnimationFrame(loop)
  }, [])

  const start = useCallback((): void => {
    if (runningRef.current) {
      return
    }

    runningRef.current = true
    lastTimeRef.current = null
    rafIdRef.current = requestAnimationFrame(loop)
  }, [loop])

  const stop = useCallback((): void => {
    runningRef.current = false

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    lastTimeRef.current = null
  }, [])

  const reset = useCallback((): void => {
    stop()
    setTime(0)
  }, [stop])

  // Cleanup on unmount
  useEffect((): (() => void) => {
    return (): void => {
      if (rafIdRef.current === null) {
        return
      }

      cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  useEffect((): (() => void) => {
    if (autoStart) {
      start()
    }

    return stop
  }, [autoStart, start, stop])

  return {
    time,
    start,
    stop,
    reset,
    running: runningRef.current,
  }
}
