import { JSX } from "react"
import Digit from "../models/Digit"
import Letter from "../models/Letter"
import { useHoveredContext } from "../context/HoveredContext"
import { usePuzzleContext } from "../context/PuzzleContext"

type Props = {
  letter: Letter
}
export default function LetterView({ letter }: Props): JSX.Element {
  const { puzzle } = usePuzzleContext()
  const {
    onLetterHover,
    onDigitHover,
    letter: hoveredLetter,
    digit: hoveredDigit,
  } = useHoveredContext()

  const handleMouseLeave = (): void => {
    onLetterHover(undefined)
    onDigitHover(undefined)
  }

  const getClassName = (letter: Letter): string => {
    const digit: Digit | undefined = puzzle.getLetterGuess(letter)
    if (digit !== undefined && hoveredDigit === digit) {
      return "highlighted digit"
    }

    return letter === hoveredLetter ? "highlighted digit" : "digit"
  }

  const renderLetter = (letter: Letter): string | Digit => {
    const digit: Digit | undefined = puzzle.getLetterGuess(letter)

    return digit ?? letter
  }

  const handleHover = (letter: Letter): void => {
    const digit: Digit | undefined = puzzle.getLetterGuess(letter)
    if (digit !== undefined) {
      onDigitHover(digit)
    }

    onLetterHover(letter)
  }

  return (
    <span
      onMouseOver={(): void => handleHover(letter)}
      className={getClassName(letter)}
      onMouseLeave={handleMouseLeave}
    >
      {renderLetter(letter)}
    </span>
  )
}
