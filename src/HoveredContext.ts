import { createContext } from "react"
import Letter from "./models/Letter"
import Digit from "./models/Digit"

type Type = {
  letter?: Letter
  digit?: Digit
  onDigitHover: (digit?: Digit) => void
  onLetterHover: (letter?: Letter) => void
}

const HoveredContext = createContext<Type>({
  letter: undefined,
  digit: undefined,
  onDigitHover: () => {},
  onLetterHover: () => {},
})

export default HoveredContext
