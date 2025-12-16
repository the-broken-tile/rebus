import Letter from "./Letter"
import { Grid, Tuple } from "../Grid"
import Digit from "./Digit"
import GuessingGrid from "./GuessingGrid"
import Guess, { SerializedGuess } from "./Guess"
import Matrix from "./Matrix"

export type SerializedPuzzle = {
  guesses: SerializedGuess[]
}

export default class Puzzle {
  constructor(
    public readonly seed: string,
    public readonly lettersToNumbers: Record<Letter, Digit>,
    private grid: Grid<number, 3>,
    public readonly guessingGrid: GuessingGrid,
    private readonly matrix: Matrix,
    public readonly base: number = 10,
  ) {}

  get digitsToLetters(): Record<Digit, Letter> {
    const result: Record<Digit, Letter> = {} as Record<Digit, Letter>
    for (const [letter, number] of Object.entries(this.lettersToNumbers)) {
      result[number as Digit] = letter as Letter
    }

    return result as Record<Digit, Letter>
  }

  get digits(): Digit[] {
    return Object.values(this.lettersToNumbers)
  }

  get letters(): Letter[] {
    return Object.keys(this.lettersToNumbers) as Letter[]
  }

  get letterGrid(): Grid<string, 3> {
    return this.grid.map((row: Tuple<number, 3>): Tuple<string, 3> => {
      return row.map((n: number): string => {
        return String(n)
          .split("")
          .map(
            (number: string): string =>
              this.digitsToLetters[Number(number) as Digit],
          )
          .join("")
      }) as Tuple<string, 3>
    }) as Grid<string, 3>
  }

  get guesses(): Guess[] {
    return this.guessingGrid.guesses
  }

  public setGuesses(guesses: Guess[]): Puzzle {
    return new Puzzle(
      this.seed,
      this.lettersToNumbers,
      this.grid,
      new GuessingGrid(guesses, this.lettersToNumbers),
      this.matrix,
    )
  }

  public getGuess(letter: Letter, digit: Digit): boolean | undefined {
    return this.guessingGrid.getGuess(letter, digit)?.value
  }

  public setGuess(
    letter: Letter,
    digit: Digit,
    guess: boolean | undefined,
  ): Puzzle {
    return new Puzzle(
      this.seed,
      this.lettersToNumbers,
      this.grid,
      this.guessingGrid.setGuess(letter, digit, guess),
      this.matrix,
    )
  }

  public getLetterGuess(letter: Letter): Digit | undefined {
    return this.guessingGrid.getLetterGuess(letter)
  }

  public isSolved(): boolean {
    const yesGuesses: Guess[] = this.guesses.filter(
      (g: Guess): boolean => g.value,
    )

    if (yesGuesses.length !== Object.keys(this.lettersToNumbers).length) {
      return false
    }

    return yesGuesses.every(
      (guess: Guess): boolean =>
        this.lettersToNumbers[guess.letter] === guess.digit,
    )
  }

  public toJSON(): SerializedPuzzle {
    return {
      guesses: this.guesses.map((g: Guess): SerializedGuess => g.toJSON()),
    }
  }
}
