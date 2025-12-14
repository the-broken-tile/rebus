import Letter from "./Letter"
import Digit from "./Digit"
import GuessValue from "./GuessValue"

export default class Guess {
  constructor(
    public letter: Letter,
    public digit: Digit,
    public value: GuessValue,
  ) {}

  public clone(): Guess {
    return new Guess(this.letter, this.digit, this.value)
  }

  public toJSON(): Record<string, any> {
    return {
      letter: this.letter,
      digit: this.digit,
      value: this.value,
    }
  }

  public static fromJSON(payload: Record<string, any>): Guess {
    return new Guess(
      payload.letter as Letter,
      payload.digit as Digit,
      payload.value as GuessValue,
    )
  }
}
