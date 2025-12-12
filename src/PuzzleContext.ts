import { createContext, useContext } from "react"
import Puzzle from "./Puzzle"

const PuzzleContext = createContext<Puzzle | undefined>(undefined)

export default PuzzleContext

export function usePuzzleContext(): Puzzle {
  const context: Puzzle | undefined = useContext(PuzzleContext)
  if (context === undefined) {
    throw new Error("useTodoContext must be within TodoProvider")
  }

  return context
}
