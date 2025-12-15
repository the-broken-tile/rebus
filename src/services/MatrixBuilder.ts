import { Grid } from "../Grid"
import Matrix from "../models/Matrix"
import Sign from "../models/Sign"
import Equation from "../models/Equation"
import transpose from "../util/transpose"
import Direction from "../models/Direction"
import Letter from "../models/Letter"
import Digit from "../models/Digit"
import Variable from "../models/Variable"

export default class MatrixBuilder {
  public build(
    grid: Grid<number, 3>,
    lettersToNumber: Record<Letter, Digit>,
  ): Matrix {
    const matrix: Matrix = new Matrix()
    this.addGrid(grid, matrix, "horizontal", lettersToNumber)
    const transposed: Grid<number, 3> = transpose<number, 3>(grid)
    this.addGrid(transposed, matrix, "vertical", lettersToNumber)

    return matrix
  }

  private addGrid(
    grid: Grid<number, 3>,
    matrix: Matrix,
    direction: Direction,
    lettersToNumber: Record<Letter, Digit>,
  ): void {
    for (const row of grid) {
      const equation: (Variable | Sign)[] = []
      row.forEach((n: number, index: number): void => {
        equation.push(this.getVariable(n, lettersToNumber))
        if (index === row.length - 1) {
          return
        }

        equation.push(index === row.length - 2 ? "=" : "+")
      })

      matrix.add(new Equation(equation, direction))
    }
  }

  private getVariable(
    n: number,
    lettersToNumber: Record<Letter, Digit>,
  ): Variable {
    const digits: Digit[] = String(n).split("").map(Number) as Digit[]

    return new Variable(
      digits,
      digits.map((d: Digit): Letter => this.getLetter(d, lettersToNumber)),
    )
  }

  private getLetter(
    digit: Digit,
    lettersToNumber: Record<Letter, Digit>,
  ): Letter {
    for (const [key, value] of Object.entries(lettersToNumber)) {
      if (value === digit) {
        return key
      }
    }

    throw new Error()
  }
}
