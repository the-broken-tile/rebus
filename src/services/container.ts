import config from "../config.json"

import RandomNumberGenerator from "./RandomNumberGenerator"
import GameGenerator from "./GameGenerator"
import SymbolsProvider from "./SymbolsProvider"
import PuzzleProvider from "./PuzzleProvider"
import Cache from "./Cache"
import MatrixBuilder from "./MatrixBuilder"

const randomNumberGenerator: RandomNumberGenerator = new RandomNumberGenerator(
  config.debug ? "1337" : new Date().toDateString(),
)
const symbolsProvider = new SymbolsProvider(randomNumberGenerator)
const linkedTreeBuilder = new MatrixBuilder()
const gameGenerator = new GameGenerator(
  randomNumberGenerator,
  symbolsProvider,
  linkedTreeBuilder,
)

const cache = new Cache(config.cachePrefix)
const puzzleProvider = new PuzzleProvider(gameGenerator, cache)

export { symbolsProvider, puzzleProvider, cache }
