import config from "../config.json"

import Letter from "../models/Letter"
import Digit from "../models/Digit"

import RandomNumberGenerator from "./RandomNumberGenerator"

export default class LettersProvider {
  private cache: Record<string, Letter[]> = {}
  constructor(private readonly randomNumberGenerator: RandomNumberGenerator) {}

  get letters(): Letter[] {
    const seed: string = this.randomNumberGenerator.seed
    if (this.cache[seed]) {
      return this.cache[seed]
    }

    const shuffled: Letter[] = this.randomNumberGenerator.shuffle<Letter>(
      config.letters,
    )

    this.cache[seed] = shuffled.slice(0, this.digits.length)

    return this.cache[seed]
  }

  get digits(): Digit[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }
}
