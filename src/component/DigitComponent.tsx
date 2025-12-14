import { JSX, useContext } from "react"
import split from "../util/split"
import Letter from "../Letter"
import Digit from "../Digit"
import HoveredContext from "../HoveredContext"
import { usePuzzleContext } from "../PuzzleContext"

type Props = {
  letters: string
}

export default function DigitComponent({ letters }: Props): JSX.Element {
  const { puzzle } = usePuzzleContext()

  const {
    onLetterHover,
    onDigitHover,
    letter: hoveredLetter,
    digit: hoveredDigit,
  } = useContext(HoveredContext)

  const handleHover = (letter: Letter): void => {
    const digit: Digit | undefined = puzzle.getLetterGuess(letter as Letter)
    if (digit !== undefined) {
      onDigitHover(digit)
    }

    onLetterHover(letter)
  }

  const renderLetter = (letter: Letter): string | Digit => {
    const digit: Digit | undefined = puzzle.getLetterGuess(letter as Letter)

    return digit ?? letter
  }

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

  return (
    <>
      {split(letters).map(
        (letter: string, key: number): JSX.Element => (
          <span
            key={key}
            onMouseOver={(): void => handleHover(letter)}
            className={getClassName(letter)}
            onMouseLeave={handleMouseLeave}
          >
            {renderLetter(letter)}
          </span>
        ),
      )}
    </>
  )
}
