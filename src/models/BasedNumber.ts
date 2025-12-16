import isValidBase from "../util/isValidBase"
import Digit from "./Digit"

/**
 * @todo replace strings with this in the grid/Puzzle
 */
export default class BasedNumber {
  constructor(
    private readonly digits: Digit[],
    private readonly base: number,
  ) {
    if (!isValidBase(this.base)) {
      throw new Error(`Invalid base number: ${base}`)
    }
  }

  /**
   * Returns in base 10.
   */
  public normalize(): number {
    return parseInt(`${this}`, this.base)
  }

  public toBase(base: number): BasedNumber {
    if (!isValidBase(base)) {
      throw new Error(`Invalid base ${base}`)
    }

    return new BasedNumber(
      this.normalize().toString(base).split("") as Digit[],
      base,
    )
  }

  public toString(): string {
    return this.digits.join("")
  }

  public add(n: BasedNumber | number): BasedNumber {
    if (typeof n === "number") {
      return this.add(new BasedNumber(String(n).split("") as Digit[], 10))
    }

    return new BasedNumber(
      (this.normalize() + n.normalize())
        .toString(this.base)
        .split("") as Digit[],
      this.base,
    )
  }

  public subtract(n: BasedNumber | number): BasedNumber {
    if (typeof n === "number") {
      return this.subtract(new BasedNumber(String(n).split("") as Digit[], 10))
    }

    return new BasedNumber(
      (this.normalize() - n.normalize())
        .toString(this.base)
        .split("") as Digit[],
      this.base,
    )
  }

  public equals(number: BasedNumber): boolean {
    return this.normalize() === number.normalize()
  }
}
