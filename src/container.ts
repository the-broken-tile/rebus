import config from "./config.json"

import RandomNumberGenerator from "./services/RandomNumberGenerator"
import GameGenerator from "./services/GameGenerator"
import SymbolsProvider from "./services/SymbolsProvider"
import PuzzleProvider from "./services/PuzzleProvider"
import Cache from "./services/Cache"
import MatrixBuilder from "./services/MatrixBuilder"

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
