import GameGenerator from "./GameGenerator"
import Puzzle from "../models/Puzzle"
import Guess from "../models/Guess"
import Cache from "./Cache"

const BASE: number = 10

export default class PuzzleProvider {
  constructor(
    private readonly gameGenerator: GameGenerator,
    private readonly cache: Cache,
  ) {}

  get(): Puzzle[] {
    const puzzle: Puzzle = this.gameGenerator.generate(BASE)
    const guesses: Guess[][] | null = this.cache.getHistory(puzzle.seed)
    if (guesses === null) {
      return [puzzle]
    }

    return guesses.map((guesses: Guess[]): Puzzle => {
      return puzzle.setGuesses(guesses)
    })
  }
}
