import { JSX, RefObject } from "react"

type Props = {
  ref: RefObject<HTMLDivElement>
}
export default function FullscreenButton({ ref }: Props): JSX.Element {
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()

      return
    }

    ref.current.requestFullscreen()
  }

  return (
    <button onClick={toggleFullscreen} id="fullscreen-button" className="button">
      Fullscreen
    </button>
  )
}
