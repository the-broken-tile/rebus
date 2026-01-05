import Puzzle from "../../models/Puzzle"

export default interface GameGeneratorInterface {
  generate(base: number): Puzzle
}
