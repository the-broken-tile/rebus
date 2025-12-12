import { JSX, SyntheticEvent } from "react"
import Digit from "../Digit"
import { Guess } from "../Guess"
import { useLongPress } from "@uidotdev/usehooks"

type Props = {
  digit: Digit
  guess: Guess
  onLeftClick: () => void
  onRightClick: () => void
  onHover: () => void
  className?: string
}

export default function GuessingGridCellComponent({
  onLeftClick,
  onRightClick,
  digit,
  guess,
  onHover,
  className,
}: Props): JSX.Element {
  const handleRightClick = (event: SyntheticEvent): void => {
    event.preventDefault()
    onRightClick()
  }

  const attrs = useLongPress(
    () => onRightClick,
    {
      threshold: 300,
    }
  );

  return (
    <span
      role="button"
      onClick={onLeftClick}
      onContextMenu={handleRightClick}
      onMouseOver={onHover}
      key={digit}
      className={`guess guess-${guess.value} ${className ?? ""}`}
      {...attrs}
    >
      {digit}
    </span>
  )
}
