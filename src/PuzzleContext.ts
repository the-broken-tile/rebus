import { Context, createContext, useContext } from "react"
import Puzzle from "./models/Puzzle"

type ContextShape = {
  puzzle: Puzzle
  undo: () => void
}
const PuzzleContext: Context<ContextShape | undefined> = createContext<
  ContextShape | undefined
>(undefined)

export default PuzzleContext

export function usePuzzleContext(): ContextShape {
  const context: ContextShape | undefined = useContext(PuzzleContext)
  if (context === undefined) {
    throw new Error("useTodoContext must be within TodoProvider")
  }

  return context
}
