import { Grid } from "../models/Grid"

export default function transpose<T, N extends number>(
  matrix: Grid<T, N>,
): Grid<T, N> {
  const n = (matrix as T[][]).length as N

  return Array.from({ length: n }, (_: unknown, r: number): any[] =>
    Array.from(
      { length: n },
      (_: unknown, c: number): any => (matrix as T[][])[c][r],
    ),
  ) as Grid<T, N>
}
