import Guess, { SerializedGuess } from "../models/Guess"
import Puzzle, { SerializedPuzzle } from "../models/Puzzle"

type KeyType = "guesses" | "time"

export default class Cache {
  constructor(private readonly prefix: string) {}

  public getHistory(seed: string, base: number = 10): Guess[][] | null {
    const serialized: string | null = localStorage.getItem(
      this.key(seed, "guesses", base),
    )
    if (serialized === null) {
      this.purgeHistory(seed)

      return null
    }

    this.purgeHistory(seed)

    return JSON.parse(serialized).map(
      (serialized: SerializedPuzzle): Guess[] => {
        return serialized.guesses.map(
          (row: SerializedGuess): Guess => Guess.fromJSON(row),
        )
      },
    )
  }

  public save(history: Puzzle[]): void {
    if (history.length === 0) {
      return
    }
    const [puzzle] = history
    const { seed, base } = puzzle
    localStorage.setItem(
      this.key(seed, "guesses", base),
      JSON.stringify(history),
    )
  }

  public getTime(seed: string, base: number = 10): number {
    const cached: string | null = localStorage.getItem(
      this.key(seed, "time", base),
    )

    if (cached === null) {
      return 0
    }

    return Number(cached)
  }

  public setTime(puzzle: Puzzle, time: number): void {
    localStorage.setItem(
      this.key(puzzle.seed, "time", puzzle.base),
      String(time),
    )
  }
  /**
   * Deletes old records
   */
  private purgeHistory(seed: string): void {
    for (let i: number = 0, l: number = localStorage.length; i < l; i++) {
      const k: string | null = localStorage.key(i)
      if (k === null || k.startsWith(`${this.prefix}/${seed}`)) {
        // skip anything that's the current seed or not prefixed with this app's prefix.
        continue
      }

      localStorage.removeItem(k)
    }
  }

  private key(seed: string, type: KeyType, base: number = 10): string {
    return `${this.prefix}/${seed}/${base}/${type}`
  }
}
