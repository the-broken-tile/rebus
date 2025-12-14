import { cache, symbolsProvider, puzzleProvider } from "../container"

import SymbolsProvider from "../services/LettersProvider"
import PuzzleProvider from "../services/PuzzleProvider"
import Cache from "../services/Cache"

type ContainerType = {
  symbolsProvider: SymbolsProvider
  puzzleProvider: PuzzleProvider
  cache: Cache
}

export default function useContainer(): ContainerType {
  return {
    symbolsProvider,
    puzzleProvider,
    cache,
  }
}
