import { useEffect } from "react"

type Arguments = {
  key: string
  onKeyPressed: () => void
  ctrl?: boolean
  deps?: any[]
}

export default function useKeyPress({
  key,
  onKeyPressed,
  ctrl,
  deps,
}: Arguments): void {
  const control: boolean = ctrl ?? false
  useEffect((): (() => void) => {
    function keyDownHandler(e: KeyboardEvent): void {
      const controlPressed: boolean = e.ctrlKey || e.metaKey

      if (e.key === key && controlPressed === control) {
        e.preventDefault()
        onKeyPressed()
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, deps ?? [])
}
