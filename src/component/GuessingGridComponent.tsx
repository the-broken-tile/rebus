import { Fragment, JSX, useContext } from "react"
import Letter from "../models/Letter"
import Digit from "../models/Digit"
import GuessingGridCellComponent from "./GuessingGridCellComponent"
import HoveredContext from "../HoveredContext"
import { usePuzzleContext } from "../PuzzleContext"

type Props = {
  onLeftClick: (letter: Letter, digit: Digit) => void
  onRightClick: (letter: Letter, digit: Digit) => void
}

export default function GuessingGridComponent({
  onLeftClick,
  onRightClick,
}: Props): JSX.Element {
  const { puzzle } = usePuzzleContext()
  const {
    letter: hoveredLetter,
    digit: hoveredDigit,
    onDigitHover,
    onLetterHover,
  } = useContext(HoveredContext)

  const handleGuessClick = (letter: Letter, digit: Digit): void => {
    onLeftClick(letter, digit)
  }

  const handleRightClick = (letter: Letter, digit: Digit): void => {
    onRightClick(letter, digit)
  }

  const handleHover = (letter: Letter, digit: Digit): void => {
    onLetterHover(letter)
    onDigitHover(digit)
  }

  const resetHovers = (): void => {
    onLetterHover(undefined)
    onDigitHover(undefined)
  }

  return (
    <div className="guessing" onMouseLeave={resetHovers}>
      {puzzle.letters.map(
        (letter: Letter): JSX.Element => (
          <Fragment key={letter}>
            <div
              className={
                letter === hoveredLetter ?
                  "guessing-legend highlighted"
                : "guessing-legend"
              }
            >
              {letter}
            </div>
            {puzzle.digits.map(
              (digit: Digit, key: number): JSX.Element => (
                <GuessingGridCellComponent
                  className={
                    letter === hoveredLetter || digit === hoveredDigit ?
                      "highlighted"
                    : undefined
                  }
                  key={key}
                  digit={digit}
                  onHover={(): void => handleHover(letter, digit)}
                  guess={puzzle.getGuess(letter, digit)}
                  onLeftClick={(): void => handleGuessClick(letter, digit)}
                  onRightClick={(): void => handleRightClick(letter, digit)}
                />
              ),
            )}
          </Fragment>
        ),
      )}
    </div>
  )
}
