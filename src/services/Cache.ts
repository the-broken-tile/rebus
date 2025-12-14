import Guess from "../models/Guess"
import Puzzle from "../models/Puzzle"

export default class Cache {
  constructor(private readonly prefix: string) {}

  public getHistory(seed: string): Guess[][] | null {
    const guesses: string | null = localStorage.getItem(this.key(seed))
    if (guesses === null) {
      this.purgeHistory(seed)

      return null
    }

    this.purgeHistory(seed)

    return JSON.parse(guesses).map((record: Record<string, any>[]): Guess[] => {
      return record.map(
        (row: Record<string, any>): Guess => Guess.fromJSON(row),
      )
    })
  }

  public save(history: Puzzle[]): void {
    if (history.length === 0) {
      return
    }
    const [puzzle] = history
    const { seed } = puzzle
    // debugger
    localStorage.setItem(
      this.key(seed),
      JSON.stringify(history.map((puzzle: Puzzle): Guess[] => puzzle.guesses)),
    )
  }

  /**
   * Deletes old records
   */
  private purgeHistory(seed: string): void {
    for (let i: number = 0, l: number = localStorage.length; i < l; i++) {
      const k: string | null = localStorage.key(i)
      if (k === null || k === this.key(seed)) {
        continue
      }

      localStorage.removeItem(k)
    }
  }

  private key(seed: string): string {
    return `${this.prefix}/${seed}/guesses`
  }
}
