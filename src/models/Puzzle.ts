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
    public readonly lettersToDigits: Record<Letter, Digit>,
    private grid: Grid<string, 3>,
    public readonly guessingGrid: GuessingGrid,
    private readonly matrix: Matrix,
    public readonly base: number,
  ) {}

  get digitsToLetters(): Record<Digit, Letter> {
    const result: Record<Digit, Letter> = {} as Record<Digit, Letter>
    for (const [letter, number] of Object.entries(this.lettersToDigits)) {
      result[number] = letter as Letter
    }

    return result
  }

  get digits(): Digit[] {
    return Object.values(this.lettersToDigits).sort(
      (a: Digit, b: Digit): number =>
        parseInt(a, this.base) - parseInt(b, this.base),
    )
  }

  get letters(): Letter[] {
    return Object.keys(this.lettersToDigits)
  }

  get letterGrid(): Grid<string, 3> {
    return this.grid.map((row: Tuple<string, 3>): Tuple<string, 3> => {
      return row.map((n: string): string => {
        return n
          .split("")
          .map((digit: Digit): string => this.digitsToLetters[digit])
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
      this.lettersToDigits,
      this.grid,
      new GuessingGrid(guesses, this.lettersToDigits),
      this.matrix,
      this.base,
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
      this.lettersToDigits,
      this.grid,
      this.guessingGrid.setGuess(letter, digit, guess),
      this.matrix,
      this.base,
    )
  }

  public getLetterGuess(letter: Letter): Digit | undefined {
    return this.guessingGrid.getLetterGuess(letter)
  }

  public isSolved(): boolean {
    const yesGuesses: Guess[] = this.guesses.filter(
      (g: Guess): boolean => g.value,
    )

    if (yesGuesses.length !== this.base) {
      return false
    }

    return yesGuesses.every(
      (guess: Guess): boolean =>
        this.lettersToDigits[guess.letter] === guess.digit,
    )
  }

  public toJSON(): SerializedPuzzle {
    return {
      guesses: this.guesses.map((g: Guess): SerializedGuess => g.toJSON()),
    }
  }
}
