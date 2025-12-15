export type Tuple<T, N extends number, R extends T[] = []> =
  R["length"] extends N ? R : Tuple<T, N, [...R, T]>

export type Grid<T, N extends number> = Tuple<Tuple<T, N>, N>
