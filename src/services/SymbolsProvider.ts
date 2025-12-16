import config from "../config.json"

import Letter from "../models/Letter"
import Digit, { digits } from "../models/Digit"

import RandomNumberGenerator from "./RandomNumberGenerator"

type Season = {
  from: string
  to: string
  letters: string[]
  pick: number
}

type Config = {
  letters: string[]
  seasonal: Season[]
}

export default class SymbolsProvider {
  private cache: Record<string, Letter[]> = {}
  private config: Config
  constructor(private readonly randomNumberGenerator: RandomNumberGenerator) {
    this.config = config as Config
  }

  public getLetters(base: number): Letter[] {
    const seed: string = this.randomNumberGenerator.seed
    if (this.cache[seed]) {
      return this.cache[seed]
    }

    const seasonal: Letter[] = this.pickSeasonal()
    const shuffled: Letter[] = this.randomNumberGenerator.shuffle<Letter>(
      this.config.letters,
    )

    this.cache[seed] = [
      ...seasonal,
      ...shuffled.slice(0, base), // cut them twice in case seasonal are more than the base
    ].slice(0, base)

    return this.cache[seed]
  }

  public getDigits(base: number): Digit[] {
    return digits.slice(0, base)
  }

  private pickSeasonal(): Letter[] {
    const today: Date = new Date()
    for (const season of this.config.seasonal) {
      const from: Date = new Date(season.from)
      const to: Date = new Date(season.to)
      if (to < today || from > today) {
        continue
      }
      const { pick, letters } = season

      return this.randomNumberGenerator
        .shuffle<Letter>(letters)
        .slice(0, pick) as Letter[]
    }

    return []
  }
}
