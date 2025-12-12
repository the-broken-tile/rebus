import Rand from "rand-seed"

export default class RandomNumberGenerator {
  private rand: Rand
  constructor(private _seed: string) {
    this.rand = new Rand()
  }

  set seed(seed: string) {
    this._seed = seed
    this.rand = new Rand(seed)
  }

  get seed(): string {
    return this._seed
  }

  public next(): number {
    return this.rand.next()
  }

  public randomInt(min: number, max: number): number {
    return Math.floor(this.rand.next() * (max - min + 1)) + min
  }

  public shuffle<T>(arr: T[]): T[] {
    const result: T[] = [...arr]

    for (let i: number = result.length - 1; i > 0; i--) {
      // pick j in [0, i]
      const j: number = Math.floor(this.rand.next() * (i + 1))

      ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
  }
}
