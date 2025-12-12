import RandomNumberGenerator from "./RandomNumberGenerator"
import GameGenerator from "./GameGenerator"
import SymbolsProvider from "./LettersProvider"

const randomNumberGenerator: RandomNumberGenerator = new RandomNumberGenerator(
  new Date().toDateString(),
)
const symbolsProvider = new SymbolsProvider(randomNumberGenerator)
const gameGenerator = new GameGenerator(randomNumberGenerator, symbolsProvider)

export { gameGenerator, randomNumberGenerator, symbolsProvider }
