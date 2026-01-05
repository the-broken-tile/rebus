import { JSX } from "react"

type Props = {
  onClick: () => void
}

export default function UndoButton({ onClick }: Props): JSX.Element {
  return (
    <span role="button" className="undo" onClick={onClick}>
      ↩️
    </span>
  )
}
