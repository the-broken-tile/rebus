import Puzzle from "./Puzzle"
import Letter from "./Letter"
import RandomNumberGenerator from "./RandomNumberGenerator"
import Digit from "./Digit"
import LettersProvider from "./LettersProvider"
import config from "./config.json"
import GuessingGrid from "./GuessingGrid"
import { symbolsProvider } from "./container"

const LARGEST_NUMBER = 999
const SMALLEST_NUMBER = 100
type Row = [number, number]
type Grid = [Row, Row]

export default class GameGenerator {
  private cache: Record<string, Puzzle> = {}

  constructor(
    private randomNumberGenerator: RandomNumberGenerator,
    private symbolsProvider: LettersProvider,
  ) {}
  public generate(): Puzzle {
    if (this.cache[this.randomNumberGenerator.seed] !== undefined) {
      return this.cache[this.randomNumberGenerator.seed]
    }

    const numbers: Grid = this.generateNumber()

    this.cache[this.randomNumberGenerator.seed] = new Puzzle(
      this.lettersToNumbersMap(),
      [
        [numbers[0][0], numbers[0][1], this.sum(numbers[0])],
        [numbers[1][0], numbers[1][1], numbers[1][0] + numbers[1][1]],
        [
          numbers[0][0] + numbers[1][0],
          numbers[0][1] + numbers[1][1],
          this.sum(numbers[0]) + this.sum(numbers[1]),
        ],
      ],
      GuessingGrid.create(
        this.symbolsProvider.letters,
        this.symbolsProvider.digits,
      ),
    )

    return this.cache[this.randomNumberGenerator.seed]
  }

  private generateNumber(): Grid {
    let attempt: Grid = this.createAttempt()
    let attemptsCount: number = 1

    while (!this.isValid(attempt)) {
      attempt = this.createAttempt()
      attemptsCount += 1
    }

    if (config.debug) {
      let largestNumber: number = 0
      let sum: number = 0
      attempt.forEach((row: Row): void => {
        row.forEach((n: number): void => {
          largestNumber = Math.max(largestNumber, n)
          sum += n
        })
      })
      console.log({ attemptsCount, largestNumber, sum })
      console.log(attempt)
    }

    return attempt
  }

  private createAttempt(): Grid {
    const largetPossibleHere: number = LARGEST_NUMBER - 3 * SMALLEST_NUMBER

    return [
      [
        this.randomNumberGenerator.randomInt(
          SMALLEST_NUMBER,
          largetPossibleHere,
        ),
        this.randomNumberGenerator.randomInt(
          SMALLEST_NUMBER,
          largetPossibleHere,
        ),
      ],
      [
        this.randomNumberGenerator.randomInt(
          SMALLEST_NUMBER,
          largetPossibleHere,
        ),
        this.randomNumberGenerator.randomInt(
          SMALLEST_NUMBER,
          largetPossibleHere,
        ),
      ],
    ]
  }
  private lettersToNumbersMap(): Record<Letter, Digit> {
    const result: Letter[] = this.randomNumberGenerator.shuffle<Letter>(
      this.symbolsProvider.letters,
    )
    const numbers: Digit[] = this.randomNumberGenerator.shuffle<Digit>(
      this.symbolsProvider.digits,
    )

    return result.reduce<Record<Letter, Digit>>(
      (
        carry: Record<Letter, Digit>,
        letter: Letter,
        index: number,
      ): Record<Letter, Digit> => {
        return { ...carry, [letter]: numbers[index] }
      },
      {} as Record<Letter, Digit>,
    )
  }

  private isValid(attempt: Grid): boolean {
    const transposed: Grid = this.transpose(attempt)

    return (
      this.validateAllDigitsArePresent(attempt) &&
      attempt.every((r: Row): boolean => this.isRowInRange(r)) &&
      transposed.every((r: Row): boolean => this.isRowInRange(r)) &&
      // Sum the whole for  the last number
      this.isInRange(this.sum([...attempt[0], ...attempt[1]]))
    )
  }

  private isRowInRange(r: Row): boolean {
    return (
      r.every((n: number): boolean => this.isInRange(n)) &&
      this.isInRange(this.sum(r))
    )
  }
  private isInRange(n: number): boolean {
    return n >= SMALLEST_NUMBER && n <= LARGEST_NUMBER
  }

  private validateAllDigitsArePresent(attempt: Grid): boolean {
    const presetNumbers = new Set<number>()

    attempt.forEach((row: Row): void => {
      row.forEach((n: number): void => {
        String(n)
          .split("")
          .forEach((digit: string): void => {
            presetNumbers.add(Number(digit))
          })
      })
    })

    return presetNumbers.size === this.symbolsProvider.digits.length
  }

  private transpose(matrix: Grid): Grid {
    const rows: number = matrix.length
    const cols: number = matrix[0].length

    const result: Grid = Array.from(
      { length: cols },
      (): Row => Array(rows) as Row,
    ) as Grid

    for (let r: number = 0; r < rows; r++) {
      for (let c: number = 0; c < cols; c++) {
        result[c][r] = matrix[r][c]
      }
    }

    return result
  }

  private sum(row: number[]): number {
    return row.reduce((carry: number, n: number): number => carry + n, 0)
  }
}
