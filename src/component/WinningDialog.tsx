import { JSX, useState } from "react"
import Dialog from "./Dialog"
import { usePuzzleContext } from "../PuzzleContext"
import formatDuration from "../util/formatTime"
import Digit from "../models/Digit"
import Letter from "../models/Letter"

type Props = {
  time: number
}

export default function WinningDialog({ time }: Props): JSX.Element {
  const { puzzle } = usePuzzleContext()
  const [isOpen, setIsOpen] = useState(true)

  if (!puzzle.isSolved() || !isOpen) {
    return <></>
  }

  const formatWithEmojis = (): string => {
    const letters: Record<Digit, Letter> = puzzle.digitsToLetters
    const formattedTime: string = formatDuration(time)

    return formattedTime
      .split("")
      .map((digitOrSemi: string): string => {
        return letters[digitOrSemi as unknown as Digit] ?? digitOrSemi
      })
      .join("")
  }

  return (
    <Dialog id="winning-dialog" onClose={(): void => setIsOpen(false)}>
      <div>You win</div>
      <div>{formatDuration(time)}</div>
      <div>{formatWithEmojis()}</div>
    </Dialog>
  )
}
