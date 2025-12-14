import config from "./config.json"

import RandomNumberGenerator from "./services/RandomNumberGenerator"
import GameGenerator from "./services/GameGenerator"
import SymbolsProvider from "./services/LettersProvider"
import PuzzleProvider from "./services/PuzzleProvider"
import Cache from "./services/Cache"

const randomNumberGenerator: RandomNumberGenerator = new RandomNumberGenerator(
  config.debug ? "1337" : new Date().toDateString(),
)
const symbolsProvider = new SymbolsProvider(randomNumberGenerator)
const gameGenerator = new GameGenerator(randomNumberGenerator, symbolsProvider)

const cache = new Cache("rebus")
const puzzleProvider = new PuzzleProvider(gameGenerator, cache)

export { symbolsProvider, puzzleProvider, cache }
