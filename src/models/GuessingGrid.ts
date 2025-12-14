import Guess from "./Guess"
import Letter from "./Letter"
import Digit from "./Digit"
import GuessValue from "./GuessValue"

export default class GuessingGrid {
  private readonly _guesses: Guess[]
  constructor(guesses: Guess[]) {
    // Dereference.
    this._guesses = guesses.map((g: Guess): Guess => g.clone())
  }

  public static create(letters: Letter[], digits: Digit[]): GuessingGrid {
    return new GuessingGrid(GuessingGrid.initGuesses(letters, digits))
  }

  get guesses(): Guess[] {
    return this._guesses
  }

  private static initGuesses(letters: Letter[], digits: Digit[]): Guess[] {
    const guesses: Guess[] = []
    for (let number of digits) {
      for (let letter of letters) {
        guesses.push(new Guess(letter, number, "unknown"))
      }
    }

    return guesses
  }

  public getGuess(letter: Letter, digit: Digit): Guess {
    return this._guesses.find(
      (g: Guess): boolean => g.letter === letter && g.digit === digit,
    )!
  }

  public setGuess(
    letter: Letter,
    digit: Digit,
    guess: GuessValue,
  ): GuessingGrid {
    return new GuessingGrid([
      ...this._guesses.filter(
        (g: Guess): boolean => g.digit !== digit || g.letter !== letter,
      ),
      new Guess(letter, digit, guess),
    ]).updateObviousGuesses()
  }

  private updateObviousGuesses(): GuessingGrid {
    const guesses: Guess[] = [...this._guesses]
    const yesGuesses: Guess[] = guesses.filter(
      (g: Guess): boolean => g.value === "yes",
    )
    for (const yesGuess of yesGuesses) {
      const negatedGuesses: Guess[] = guesses.filter((g: Guess): boolean => {
        return (
          (g.letter === yesGuess.letter && g.digit !== yesGuess.digit) ||
          (g.letter !== yesGuess.letter && g.digit === yesGuess.digit)
        )
      })
      if (negatedGuesses.every((g: Guess): boolean => g.value !== "yes")) {
        negatedGuesses.forEach((g: Guess): string => (g.value = "no"))
      }
    }

    return new GuessingGrid(guesses)
  }

  public getLetterGuess(letter: Letter): Digit | undefined {
    const relevantGuesses: Guess[] = this.guesses.filter(
      (g: Guess): boolean => g.letter === letter && g.value === "yes",
    )

    if (relevantGuesses.length !== 1) {
      return
    }

    const [guess] = relevantGuesses

    const digit: Digit = guess.digit
    const isUnique: boolean = this.getDigitGuess(digit) === letter

    if (isUnique) {
      return digit
    }
  }

  private getDigitGuess(digit: Digit): Letter | undefined {
    const relevantGuesses: Guess[] = this.guesses.filter(
      (g: Guess): boolean => g.digit === digit && g.value === "yes",
    )

    if (relevantGuesses.length !== 1) {
      return
    }

    const [guess] = relevantGuesses

    return guess.letter
  }
}
