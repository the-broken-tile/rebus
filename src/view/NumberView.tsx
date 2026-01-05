import { JSX } from "react"
import split from "../util/split"
import LetterView from "./LetterView"

type Props = {
  letters: string
}

export default function NumberView({ letters }: Props): JSX.Element {
  return (
    <div className="number">
      {split(letters).map(
        (letter: string, key: number): JSX.Element => (
          <LetterView letter={letter} key={key} />
        ),
      )}
    </div>
  )
}
