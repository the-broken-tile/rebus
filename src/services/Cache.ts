import Guess from "../models/Guess"
import Puzzle, { SerializedPuzzle } from "../models/Puzzle"

type KeyType = "guesses" | "time"

export default class Cache {
  constructor(private readonly prefix: string) {}

  public getHistory(seed: string): Guess[][] | null {
    const serialized: string | null = localStorage.getItem(
      this.key(seed, "guesses"),
    )
    if (serialized === null) {
      this.purgeHistory(seed)

      return null
    }

    this.purgeHistory(seed)

    return JSON.parse(serialized).map(
      (serialized: SerializedPuzzle): Guess[] => {
        return serialized.guesses.map(
          (row: Record<string, any>): Guess => Guess.fromJSON(row),
        )
      },
    )
  }

  public save(history: Puzzle[]): void {
    if (history.length === 0) {
      return
    }
    const [puzzle] = history
    const { seed } = puzzle
    // debugger
    localStorage.setItem(this.key(seed, "guesses"), JSON.stringify(history))
  }

  public getTime(seed: string): number {
    const cached: string | null = localStorage.getItem(this.key(seed, "time"))

    if (cached === null) {
      return 0
    }

    return Number(cached)
  }

  public setTime(seed: string, time: number): void {
    localStorage.setItem(this.key(seed, "time"), String(time))
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

  private key(seed: string, type: KeyType): string {
    return `${this.prefix}/${seed}/${type}`
  }
}
