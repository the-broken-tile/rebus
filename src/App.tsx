import { JSX, useEffect, useState } from "react"
import { gameGenerator, randomNumberGenerator } from "./container"
import "./app.css"
import Puzzle from "./Puzzle"
import Letter from "./Letter"
import Digit from "./Digit"
import GridComponent from "./component/GridComponent"
import GuessingGridComponent from "./component/GuessingGridComponent"
import config from "./config.json"
import HoveredContext from "./HoveredContext"
import PuzzleContext from "./PuzzleContext"
import Dialog from "./component/Dialog"

if (config.debug) {
  randomNumberGenerator.seed = "1337"
}

export default function App(): JSX.Element {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [solved, setSolved] = useState<boolean>(false)
  const [hoveredLetter, setHoveredLetter] = useState<Letter | undefined>(
    undefined,
  )
  const [hoveredDigit, setHoveredDigit] = useState<Digit | undefined>(undefined)

  useEffect((): void => {
    setPuzzle(gameGenerator.generate())
  }, [])

  useEffect((): void => {
    if (puzzle?.isSolved()) {
      setSolved(true)
    }
  }, [puzzle])

  const handleGuessClick = (letter: Letter, digit: Digit): void => {
    if (puzzle === null) {
      return
    }

    if (puzzle.getGuess(letter, digit).value !== "unknown") {
      setPuzzle(puzzle.setGuess(letter, digit, "unknown"))

      return
    }

    setPuzzle(puzzle.setGuess(letter, digit, "yes"))
  }

  const handleLetterHover = (letter?: Letter): void => {
    setHoveredLetter(letter)
  }

  const handleDigitHover = (digit?: Digit): void => {
    setHoveredDigit(digit)
  }

  const handleRightClick = (letter: Letter, digit: Digit): void => {
    if (puzzle === null) {
      return
    }

    if (puzzle.getGuess(letter, digit).value !== "unknown") {
      setPuzzle(puzzle.setGuess(letter, digit, "unknown"))

      return
    }

    setPuzzle(puzzle.setGuess(letter, digit, "no"))
  }

  if (puzzle === null) {
    return <>loading</>
  }

  return (
    <PuzzleContext value={puzzle}>
      <HoveredContext
        value={{
          digit: hoveredDigit,
          letter: hoveredLetter,
          onDigitHover: handleDigitHover,
          onLetterHover: handleLetterHover,
        }}
      >
        {solved && <Dialog>You won</Dialog>}
        <GuessingGridComponent
          onLeftClick={handleGuessClick}
          onRightClick={handleRightClick}
        />
        <GridComponent />
      </HoveredContext>
    </PuzzleContext>
  )
}
