import { JSX, useEffect, useState } from "react"
import "./app.css"
import Puzzle from "./models/Puzzle"
import Letter from "./models/Letter"
import Digit from "./models/Digit"

import HoveredContext from "./HoveredContext"
import PuzzleContext from "./PuzzleContext"

import GridComponent from "./component/GridComponent"
import GuessingGridComponent from "./component/GuessingGridComponent"
import WinningDialog from "./component/WinningDialog"

import useKeyPress from "./hooks/useKeyPress"
import useTimer from "./hooks/useTimer"
import useDocumentVisibility from "./hooks/useDocumentVisibility"
import useContainer from "./hooks/useContainer"

export default function App(): JSX.Element {
  const { puzzleProvider, cache } = useContainer()
  const [history, setHistory] = useState<Puzzle[]>([])
  const [solved, setSolved] = useState<boolean>(false)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [hoveredLetter, setHoveredLetter] = useState<Letter | undefined>(
    undefined,
  )
  const [hoveredDigit, setHoveredDigit] = useState<Digit | undefined>(undefined)
  const { time, start, stop } = useTimer(true)
  const { visible } = useDocumentVisibility()

  useEffect((): void => {
    setHistory(puzzleProvider.get())
  }, [])

  useEffect((): void => {
    if (!solved) {
      return
    }

    stop()
  }, [solved])

  useEffect((): void => {
    if (visible && puzzle !== null) {
      start()

      return
    }

    stop()
  }, [visible])

  useEffect((): void => {
    if (puzzle === null) {
      return
    }

    if (puzzle.isSolved()) {
      setSolved(true)
    }
  }, [puzzle])

  useEffect((): void => {
    const currentState: Puzzle | undefined = history[history.length - 1]
    if (currentState) {
      setPuzzle(currentState)
    }
  }, [history.length])

  useEffect((): void => {
    cache.save(history)
  }, [history.length])

  useKeyPress({
    ctrl: true,
    key: "z",
    onKeyPressed: (): void => undo(),
    deps: [history.length],
  })

  const handleGuessClick = (letter: Letter, digit: Digit): void => {
    if (puzzle === null) {
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
    if (puzzle === null) {
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

  const undo = (): void => {
    if (history.length <= 1) {
      return
    }

    setHistory(history.slice(0, history.length - 1))
  }

  if (puzzle === null) {
    return <>loading</>
  }

  return (
    <PuzzleContext value={{ puzzle, undo }}>
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
