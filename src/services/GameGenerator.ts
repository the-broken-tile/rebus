import Puzzle from "../models/Puzzle"
import Letter from "../models/Letter"
import RandomNumberGenerator from "./RandomNumberGenerator"
import Digit from "../models/Digit"
import LettersProvider from "./LettersProvider"
import config from "../config.json"
import GuessingGrid from "../models/GuessingGrid"
import { Grid, Tuple } from "../Grid"
import Matrix from "../models/Matrix"
import MatrixBuilder from "./MatrixBuilder"
import transpose from "../util/transpose"

const LARGEST_NUMBER = 999
const SMALLEST_NUMBER = 100

export default class GameGenerator {
  private cache: Record<string, Puzzle> = {}

  constructor(
    private readonly randomNumberGenerator: RandomNumberGenerator,
    private readonly symbolsProvider: LettersProvider,
    private readonly matrixBuilder: MatrixBuilder,
  ) {}
  public generate(): Puzzle {
    if (this.cache[this.randomNumberGenerator.seed] !== undefined) {
      return this.cache[this.randomNumberGenerator.seed]
    }

    const numbers: Grid<number, 2> = this.generateNumber()

    const grid: Grid<number, 3> = [
      [numbers[0][0], numbers[0][1], this.sum(numbers[0])],
      [numbers[1][0], numbers[1][1], numbers[1][0] + numbers[1][1]],
      [
        numbers[0][0] + numbers[1][0],
        numbers[0][1] + numbers[1][1],
        this.sum(numbers[0]) + this.sum(numbers[1]),
      ],
    ]

    const lettersToNumbers: Record<Letter, Digit> = this.lettersToNumbersMap()
    const matrix: Matrix = this.matrixBuilder.build(grid, lettersToNumbers)

    this.cache[this.randomNumberGenerator.seed] = new Puzzle(
      this.randomNumberGenerator.seed,
      lettersToNumbers,
      grid,
      GuessingGrid.create(lettersToNumbers),
      matrix,
    )

    return this.cache[this.randomNumberGenerator.seed]
  }

  private generateNumber(): Grid<number, 2> {
    let attempt: Grid<number, 2> = this.createAttempt()
    let attemptsCount: number = 1

    while (!this.isValid(attempt)) {
      attempt = this.createAttempt()
      attemptsCount += 1
    }

    if (config.debug) {
      let largestNumber: number = 0
      let sum: number = 0
      attempt.forEach((row: Tuple<number, 2>): void => {
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

  private createAttempt(): Grid<number, 2> {
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

  private isValid(attempt: Grid<number, 2>): boolean {
    const transposed: Grid<number, 2> = transpose<number, 2>(attempt)

    return (
      this.validateAllDigitsArePresent(attempt) &&
      attempt.every((r: Tuple<number, 2>): boolean => this.isRowInRange(r)) &&
      transposed.every((r: Tuple<number, 2>): boolean =>
        this.isRowInRange(r),
      ) &&
      // Sum the whole for  the last number
      this.isInRange(this.sum([...attempt[0], ...attempt[1]]))
    )
  }

  private isRowInRange(r: Tuple<number, 2>): boolean {
    return (
      r.every((n: number): boolean => this.isInRange(n)) &&
      this.isInRange(this.sum(r))
    )
  }
  private isInRange(n: number): boolean {
    return n >= SMALLEST_NUMBER && n <= LARGEST_NUMBER
  }

  private validateAllDigitsArePresent(attempt: Grid<number, 2>): boolean {
    const presetNumbers = new Set<number>()

    attempt.forEach((row: Tuple<number, 2>): void => {
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

  private sum(row: number[]): number {
    return row.reduce((carry: number, n: number): number => carry + n, 0)
  }
}
