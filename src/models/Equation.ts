import Sign from "./Sign"
import Direction from "./Direction"
import Variable from "./Variable"

export default class Equation {
  constructor(
    public readonly equation: (Variable | Sign)[],
    public readonly direction: Direction,
  ) {}

  public isValid(): boolean {
    return true
  }
}
