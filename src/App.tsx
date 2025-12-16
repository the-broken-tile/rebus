import { JSX, useEffect, useState } from "react"
import { puzzleProvider, cache } from "./container"
import "./app.css"
import Puzzle from "./models/Puzzle"
import Letter from "./models/Letter"
import Digit from "./models/Digit"
import config from "./config.json"

import HoveredContext from "./HoveredContext"
import PuzzleContext from "./PuzzleContext"

import GridComponent from "./component/GridComponent"
import GuessingGridComponent from "./component/GuessingGridComponent"
import WinningDialog from "./component/WinningDialog"

import useKeyPress from "./hooks/useKeyPress"
import useTimer from "./hooks/useTimer"
import useDocumentVisibility from "./hooks/useDocumentVisibility"
import formatDuration from "./util/formatTime"

const { debug } = config

export default function App(): JSX.Element {
  const [history, setHistory] = useState<Puzzle[]>([])
  const [solved, setSolved] = useState<boolean>(false)
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [hoveredLetter, setHoveredLetter] = useState<Letter | undefined>(
    undefined,
  )
  const [hoveredDigit, setHoveredDigit] = useState<Digit | undefined>(undefined)
  const { time, start, stop } = useTimer()
  const { visible } = useDocumentVisibility()
  const [hash] = useState((): string => window.location.hash)

  // Initial game loading
  useEffect((): void => {
    setHistory(puzzleProvider.get(hash.replace(/^#/, "")))
  }, [hash])

  // Stop the timer when the game is solved.
  useEffect((): void => {
    if (!solved) {
      return
    }

    stop()
  }, [solved])

  // Start and stop the timer on losing focus of the window.
  useEffect((): void => {
    if (visible && !solved && puzzle !== null) {
      start(cache.getTime(puzzle.seed))

      return
    }

    stop()
  }, [visible, solved])

  // Check whether puzzle is solved.
  useEffect((): void => {
    if (puzzle === null) {
      return
    }

    if (puzzle.isSolved()) {
      setSolved(true)
    }
  }, [puzzle])

  // Get the current puzzle from the history stack.
  useEffect((): void => {
    const currentState: Puzzle | undefined = history[history.length - 1]
    if (currentState) {
      setPuzzle(currentState)
    }
    cache.save(history)
  }, [history.length])

  // Start the timer as soon as the puzzle is loaded.
  useEffect((): void => {
    if (puzzle !== null) {
      start(cache.getTime(puzzle.seed))
    }
  }, [puzzle])

  // Stop the timer when the puzzle is solved.
  useEffect((): void => {
    if (solved) {
      stop()
    }
  }, [solved])

  useEffect((): (() => void) => {
    if (puzzle !== null) {
      cache.setTime(puzzle, time)
    }

    return (): void => {
      if (puzzle === null) {
        return
      }

      cache.setTime(puzzle, time)
    }
  }, [puzzle, time])

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

    const currentGuess: boolean | undefined = puzzle.getGuess(letter, digit)

    setHistory([
      ...history,
      puzzle.setGuess(
        letter,
        digit,
        currentGuess === undefined ? true : undefined,
      ),
    ])
  }

  const handleRightClick = (letter: Letter, digit: Digit): void => {
    if (puzzle === null) {
      return
    }

    const currentGuess: boolean | undefined = puzzle.getGuess(letter, digit)

    setHistory([
      ...history,
      puzzle.setGuess(
        letter,
        digit,
        currentGuess === undefined ? false : undefined,
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
        <div id="app" className={`base-${puzzle.base}`}>
          {debug && (
            <div style={{ position: "absolute" }}>{formatDuration(time)}</div>
          )}
          <WinningDialog time={time} />
          <GuessingGridComponent
            onLeftClick={handleGuessClick}
            onRightClick={handleRightClick}
          />
          <GridComponent />
        </div>
      </HoveredContext>
    </PuzzleContext>
  )
}
