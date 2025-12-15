import Letter from "./Letter"
import Grid, { Row } from "../Grid"
import Digit from "./Digit"
import GuessingGrid from "./GuessingGrid"
import Guess, { SerializedGuess } from "./Guess"
import GuessValue from "./GuessValue"

export type SerializedPuzzle = {
  guesses: SerializedGuess[]
}

export default class Puzzle {
  constructor(
    public readonly seed: string,
    public readonly lettersToNumbers: Record<Letter, Digit>,
    private grid: Grid<number>,
    public readonly guessingGrid: GuessingGrid,
  ) {}

  get digitsToLetters(): Record<Digit, Letter> {
    const result: Record<Digit, Letter> = {} as Record<Digit, Letter>
    for (const [letter, number] of Object.entries(this.lettersToNumbers)) {
      result[number as Digit] = letter as Letter
    }

    return result as Record<Digit, Letter>
  }

  get letters(): Grid<string> {
    return this.grid.map((row: Row<number>): Row<string> => {
      return row.map((n: number): string => {
        return String(n)
          .split("")
          .map(
            (number: string): string =>
              this.digitsToLetters[Number(number) as Digit],
          )
          .join("")
      }) as Row<string>
    }) as Grid<string>
  }

  get guesses(): Guess[] {
    return this.guessingGrid.guesses
  }

  public setGuesses(guesses: Guess[]): Puzzle {
    return new Puzzle(
      this.seed,
      this.lettersToNumbers,
      this.grid,
      new GuessingGrid(guesses),
    )
  }

  public getGuess(letter: Letter, digit: Digit): Guess {
    return this.guessingGrid.getGuess(letter, digit)
  }

  public setGuess(letter: Letter, digit: Digit, guess: GuessValue): Puzzle {
    return new Puzzle(
      this.seed,
      this.lettersToNumbers,
      this.grid,
      this.guessingGrid.setGuess(letter, digit, guess),
    )
  }

  public getLetterGuess(letter: Letter): Digit | undefined {
    return this.guessingGrid.getLetterGuess(letter)
  }

  public isSolved(): boolean {
    const yesGuesses: Guess[] = this.guesses.filter(
      (guess: Guess): boolean => guess.value === "yes",
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
      guesses: this.guesses,
    }
  }
}
