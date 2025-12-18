import { JSX } from "react"
import { usePuzzleContext } from "../context/PuzzleContext"

type Props = {
  type: "landscape" | "portrait"
}

export default function UndoButton({ type }: Props): JSX.Element {
  const { undo } = usePuzzleContext()

  return (
    <span role="button" className={`undo undo-${type}`} onClick={undo}>
      ↩️
    </span>
  )
}
