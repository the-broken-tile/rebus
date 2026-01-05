import { JSX } from "react"

type Props = {
  onClick: () => void
}

export default function InfoButton({ onClick }: Props): JSX.Element {
  return (
    <span role="button" className="info" onClick={onClick}>
      ⁉️
    </span>
  )
}
