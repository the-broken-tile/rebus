import Letter from "./Letter"
import Digit from "./Digit"

export default class Variable {
  constructor(
    public readonly digits: Digit[],
    public readonly letters: Letter[],
  ) {}

  public valueOf(): number {
    return this.digits.reduce(
      (carry: number, digit: number): number => carry + digit,
      0,
    )
  }
}
