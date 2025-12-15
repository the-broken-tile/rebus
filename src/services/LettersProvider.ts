import config from "../config.json"

import Letter from "../models/Letter"
import Digit from "../models/Digit"

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

export default class LettersProvider {
  private cache: Record<string, Letter[]> = {}
  private config: Config
  constructor(private readonly randomNumberGenerator: RandomNumberGenerator) {
    this.config = config as Config
  }

  get letters(): Letter[] {
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
      ...shuffled.slice(0, this.digits.length - seasonal.length),
    ]

    return this.cache[seed]
  }

  get digits(): Digit[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
