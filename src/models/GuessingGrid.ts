import Guess from "./Guess"
import Letter from "./Letter"
import Digit from "./Digit"

export default class GuessingGrid {
  private readonly _guesses: Guess[]
  constructor(
    guesses: Guess[],
    private readonly lettersToNumbers: Record<Letter, Digit>,
  ) {
    // Dereference.
    this._guesses = guesses.map((g: Guess): Guess => g.clone())
  }

  public static create(lettersToNumbers: Record<Letter, Digit>): GuessingGrid {
    return new GuessingGrid([], lettersToNumbers)
  }

  get guesses(): Guess[] {
    return this._guesses
  }

  public getGuess(letter: Letter, digit: Digit): Guess | undefined {
    return this._guesses.find(
      (g: Guess): boolean => g.letter === letter && g.digit === digit,
    )
  }

  public setGuess(
    letter: Letter,
    digit: Digit,
    guess: boolean | undefined,
  ): GuessingGrid {
    return this._setGuess(letter, digit, guess).updateObviousGuesses()
  }

  /**
   * No automatic updates here!
   */
  private _setGuess(
    letter: Letter,
    digit: Digit,
    guess: boolean | undefined,
  ): GuessingGrid {
    const guesses: Guess[] = this._guesses.filter(
      (g: Guess): boolean => g.digit !== digit || g.letter !== letter,
    )

    if (guess !== undefined) {
      guesses.push(new Guess(letter, digit, guess))
    }

    return new GuessingGrid(guesses, this.lettersToNumbers)
  }

  private updateObviousGuesses(): GuessingGrid {
    const yesGuesses: Guess[] = this._guesses.filter(
      (g: Guess): boolean => g.value,
    )
    let result: GuessingGrid = this
    for (const yesGuess of yesGuesses) {
      // There is no true guess on the same letter nor digit.
      const shouldUpdate: boolean = !this._guesses.some((g: Guess): boolean => {
        return (
          g !== yesGuess &&
          g.value &&
          (g.digit === yesGuess.digit || g.letter === yesGuess.letter)
        )
      })

      if (!shouldUpdate) {
        continue
      }

      Object.keys(this.lettersToNumbers).forEach((letter: Letter): void => {
        Object.values(this.lettersToNumbers).forEach((digit: Digit): void => {
          if (
            (letter !== yesGuess.letter && digit === yesGuess.digit) ||
            (digit !== yesGuess.digit && letter === yesGuess.letter)
          ) {
            result = result._setGuess(letter, digit, false)
          }
        })
      })
    }

    return result
  }

  public getLetterGuess(letter: Letter): Digit | undefined {
    const relevantGuesses: Guess[] = this.guesses.filter(
      (g: Guess): boolean => g.letter === letter && g.value,
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
      (g: Guess): boolean => g.digit === digit && g.value,
    )

    if (relevantGuesses.length !== 1) {
      return
    }

    const [guess] = relevantGuesses

    return guess.letter
  }

  public toJSON(): Record<string, any> {
    return {
      guesses: this._guesses,
    }
  }
}
