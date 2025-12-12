import Letter from "./Letter"
import Digit from "./Digit"
import GuessValue from "./GuessValue"

export class Guess {
  constructor(
    public letter: Letter,
    public digit: Digit,
    public value: GuessValue,
  ) {}
}
