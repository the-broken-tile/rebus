import Letter from "./Letter"
import Digit from "./Digit"

export type SerializedGuess = {
  letter: string
  digit: number | string
  value: boolean
}

export default class Guess {
  constructor(
    public letter: Letter,
    public digit: Digit,
    public value: boolean,
  ) {}

  public clone(): Guess {
    return new Guess(this.letter, this.digit, this.value)
  }

  public toJSON(): SerializedGuess {
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
      payload.value,
    )
  }
}
