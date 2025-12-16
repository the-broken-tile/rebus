import GameGenerator from "./GameGenerator"
import Puzzle from "../models/Puzzle"
import Guess from "../models/Guess"
import Cache from "./Cache"

const DEFAULT_BASE: number = 10

export default class PuzzleProvider {
  constructor(
    private readonly gameGenerator: GameGenerator,
    private readonly cache: Cache,
  ) {}

  get(baseString: string): Puzzle[] {
    const base: number =
      baseString === "" ? DEFAULT_BASE : parseInt(baseString, 10)
    const finalBase: number =
      this.supportedBases.includes(base) ? base : DEFAULT_BASE

    const puzzle: Puzzle = this.gameGenerator.generate(finalBase)
    const guesses: Guess[][] | null = this.cache.getHistory(
      puzzle.seed,
      puzzle.base,
    )
    if (guesses === null) {
      return [puzzle]
    }

    return guesses.map((guesses: Guess[]): Puzzle => {
      return puzzle.setGuesses(guesses)
    })
  }

  private get supportedBases(): number[] {
    return [10, 12]
  }
}
