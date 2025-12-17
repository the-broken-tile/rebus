import Puzzle from "../models/Puzzle"
import Letter from "../models/Letter"
import RandomNumberGenerator from "./RandomNumberGenerator"
import Digit from "../models/Digit"
import SymbolsProvider from "./SymbolsProvider"
import config from "../config.json"
import GuessingGrid from "../models/GuessingGrid"
import { Grid, Tuple } from "../models/Grid"
import Matrix from "../models/Matrix"
import MatrixBuilder from "./MatrixBuilder"
import transpose from "../util/transpose"
import isValidBase from "../util/isValidBase"
import BasedNumber from "../models/BasedNumber"

const NUMBER_OF_SYMBOLS = 3

export default class GameGenerator {
  private cache: Record<string, Puzzle> = {}

  constructor(
    private readonly randomNumberGenerator: RandomNumberGenerator,
    private readonly symbolsProvider: SymbolsProvider,
    private readonly matrixBuilder: MatrixBuilder,
  ) {}
  public generate(base: number): Puzzle {
    if (!isValidBase(base)) {
      throw new Error(`Invalid base number: ${base}`)
    }

    if (this.cache[this.randomNumberGenerator.seed] !== undefined) {
      return this.cache[this.randomNumberGenerator.seed]
    }

    const numbers: Grid<string, 2> = this.generateNumbers(base)
    const grid: Grid<string, 3> = this.createSummedGrid(numbers, base)
    const lettersToDigits: Record<Letter, Digit> = this.lettersToDigits(base)

    this.cache[this.randomNumberGenerator.seed] = new Puzzle(
      this.randomNumberGenerator.seed,
      lettersToDigits,
      grid,
      GuessingGrid.create(lettersToDigits),
      new Matrix(), // @todo maybe use MatrixBuilder
      base,
    )

    return this.cache[this.randomNumberGenerator.seed]
  }

  private generateNumbers(base: number): Grid<string, 2> {
    let attempt: Grid<string, 2> = this.createAttempt(base)
    let attemptsCount: number = 1

    while (!this.isValid(attempt, base)) {
      attempt = this.createAttempt(base)
      attemptsCount += 1
    }

    if (config.debug) {
      console.log({ attemptsCount, base })
      console.log(this.createSummedGrid(attempt, base))
    }

    return attempt
  }

  private createAttempt(base: number): Grid<string, 2> {
    const smallestNumber: number = Math.pow(base, NUMBER_OF_SYMBOLS - 1)
    const largestNumber: number = Math.pow(base, NUMBER_OF_SYMBOLS) - 1
    const largetPossibleHere: number = largestNumber - 3 * smallestNumber

    return [
      [
        this.randomInt(smallestNumber, largetPossibleHere, base),
        this.randomInt(smallestNumber, largetPossibleHere, base),
      ],
      [
        this.randomInt(smallestNumber, largetPossibleHere, base),
        this.randomInt(smallestNumber, largetPossibleHere, base),
      ],
    ]
  }
  private lettersToDigits(base: number): Record<Letter, Digit> {
    const result: Letter[] = this.randomNumberGenerator.shuffle<Letter>(
      this.symbolsProvider.getLetters(base),
    )
    const numbers: Digit[] = this.randomNumberGenerator.shuffle<Digit>(
      this.symbolsProvider.getDigits(base),
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

  private isValid(attempt: Grid<string, 2>, base: number): boolean {
    const transposed: Grid<string, 2> = transpose<string, 2>(attempt)

    return (
      this.validateAllDigitsArePresent(attempt, base) &&
      attempt.every((r: Tuple<string, 2>): boolean =>
        this.isRowInRange(r, base),
      ) &&
      transposed.every((r: Tuple<string, 2>): boolean =>
        this.isRowInRange(r, base),
      ) &&
      // Sum the whole for  the last number
      this.isInRange(this.sum([...attempt[0], ...attempt[1]], base))
    )
  }

  private isRowInRange(r: Tuple<string, 2>, base: number): boolean {
    return (
      r.every((n: string): boolean => this.isInRange(n)) &&
      this.isInRange(this.sum(r, base))
    )
  }
  private isInRange(n: string): boolean {
    return n.length === NUMBER_OF_SYMBOLS
  }

  private validateAllDigitsArePresent(
    attempt: Grid<string, 2>,
    base: number,
  ): boolean {
    const presentDigits = new Set<Digit>()
    const summedGrid: Grid<string, 3> = this.createSummedGrid(attempt, base)
    summedGrid.forEach((row: Tuple<string, 3>): void => {
      row.forEach((n: string): void => {
        n.split("").forEach((digit: Digit): void => {
          presentDigits.add(digit)
        })
      })
    })

    return presentDigits.size === base
  }

  private sum(row: string[], base: number): string {
    return row.reduce(
      (carry: string, n: string): string => this.add(carry, n, base),
      "0",
    )
  }

  private add(number1: string, number2: string, base: number): string {
    const baseNumber1 = new BasedNumber(number1.split("") as Digit[], base)
    const baseNumber2 = new BasedNumber(number2.split("") as Digit[], base)

    return baseNumber1.add(baseNumber2).toString()
  }

  /**
   *
   * @param from in decimal
   * @param to in decimal
   * @param base
   *
   * @return in target base
   */
  private randomInt(from: number, to: number, base: number): string {
    return this.randomNumberGenerator.randomInt(from, to).toString(base)
  }

  private createSummedGrid(
    grid: Grid<string, 2>,
    base: number,
  ): Grid<string, 3> {
    return [
      [grid[0][0], grid[0][1], this.sum(grid[0], base)],
      [grid[1][0], grid[1][1], this.add(grid[1][0], grid[1][1], base)],
      [
        this.add(grid[0][0], grid[1][0], base),
        this.add(grid[0][1], grid[1][1], base),
        this.add(this.sum(grid[0], base), this.sum(grid[1], base), base),
      ],
    ]
  }
}
