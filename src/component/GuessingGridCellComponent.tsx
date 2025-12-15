import { JSX, SyntheticEvent } from "react"
import Digit from "../models/Digit"
import { useLongPress } from "@uidotdev/usehooks"

type Props = {
  digit: Digit
  guess: boolean | undefined
  onLeftClick: () => void
  onRightClick: () => void
  onHover: () => void
  className?: string
}

const cssMap: Record<string, string | undefined> = {
  true: "guess-yes",
  false: "guess-no",
  undefined: undefined,
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

  const attrs = useLongPress(() => onRightClick, {
    threshold: 300,
  })

  const getClassName = (): string => {
    return ["guess", className, cssMap[String(guess)]]
      .filter((x: string | undefined): boolean => x !== undefined)
      .join(" ")
  }

  return (
    <span
      role="button"
      onClick={onLeftClick}
      onContextMenu={handleRightClick}
      onMouseOver={onHover}
      key={digit}
      className={getClassName()}
      {...attrs}
    >
      {digit}
    </span>
  )
}
