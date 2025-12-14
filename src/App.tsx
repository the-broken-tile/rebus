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
import useKeyPress from "./hooks/useKeyPress"
import useTimer from "./hooks/useTimer"
import WinningDialog from "./component/WinningDialog"
import useDocumentVisibility from "./hooks/useDocumentVisibility"

if (config.debug) {
  randomNumberGenerator.seed = "1337"
}

export default function App(): JSX.Element {
  const [history, setHistory] = useState<Puzzle[]>([])
  const [solved, setSolved] = useState<boolean>(false)
  const [hoveredLetter, setHoveredLetter] = useState<Letter | undefined>(
    undefined,
  )
  const [hoveredDigit, setHoveredDigit] = useState<Digit | undefined>(undefined)
  const { time, start, stop } = useTimer(true)
  const { visible } = useDocumentVisibility()

  useEffect((): void => {
    setHistory([gameGenerator.generate()])
  }, [])

  useEffect((): void => {
    if (!solved) {
      return
    }

    stop()
  }, [solved])

  useEffect((): void => {
    if (visible && !history[history.length - 1].isSolved()) {
      start()

      return
    }

    stop()
  }, [visible])

  useEffect((): void => {
    if (history.length === 0) {
      return
    }
    if (history[history.length - 1].isSolved()) {
      setSolved(true)
    }
  }, [history.length])

  useKeyPress({
    ctrl: true,
    key: "z",
    onKeyPressed: (): void => undo(),
    deps: [history.length],
  })

  const handleGuessClick = (letter: Letter, digit: Digit): void => {
    const puzzle: Puzzle | undefined = history[history.length - 1]
    if (puzzle === undefined) {
      return
    }

    const currentGuess: "unknown" | "yes" | "no" = puzzle.getGuess(
      letter,
      digit,
    ).value
    setHistory([
      ...history,
      puzzle.setGuess(
        letter,
        digit,
        currentGuess === "unknown" ? "yes" : "unknown",
      ),
    ])
  }

  const handleRightClick = (letter: Letter, digit: Digit): void => {
    if (history.length === 0) {
      return
    }

    const puzzle: Puzzle = history[history.length - 1]
    const currentGuess: "unknown" | "yes" | "no" = puzzle.getGuess(
      letter,
      digit,
    ).value
    setHistory([
      ...history,
      puzzle.setGuess(
        letter,
        digit,
        currentGuess === "unknown" ? "no" : "unknown",
      ),
    ])
  }

  const handleLetterHover = (letter?: Letter): void => {
    setHoveredLetter(letter)
  }

  const handleDigitHover = (digit?: Digit): void => {
    setHoveredDigit(digit)
  }

  if (history.length < 1) {
    return <>loading</>
  }

  const undo = (): void => {
    if (history.length <= 1) {
      return
    }

    setHistory(history.slice(0, history.length - 1))
  }

  return (
    <PuzzleContext value={{ puzzle: history[history.length - 1], undo }}>
      <HoveredContext
        value={{
          digit: hoveredDigit,
          letter: hoveredLetter,
          onDigitHover: handleDigitHover,
          onLetterHover: handleLetterHover,
        }}
      >
        <WinningDialog time={time} />
        <GuessingGridComponent
          onLeftClick={handleGuessClick}
          onRightClick={handleRightClick}
        />
        <GridComponent />
      </HoveredContext>
    </PuzzleContext>
  )
}
