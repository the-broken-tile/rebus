import Equation from "./Equation"
import Sign from "./Sign"

export default class Matrix {
  private readonly equations: Equation[] = []
  constructor() {}

  public add(equation: Equation): void {
    this.equations.push(equation)
  }
}
