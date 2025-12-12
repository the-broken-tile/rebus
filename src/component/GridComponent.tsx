import { Fragment, JSX } from "react"
import Puzzle from "../Puzzle"
import { Row } from "../Grid"
import DigitComponent from "./DigitComponent"
import SignComponent from "./SignComponent"
import Sign from "../Sign"
import { usePuzzleContext } from "../PuzzleContext"

export default function GridComponent(): JSX.Element {
  const puzzle: Puzzle = usePuzzleContext()

  const signsPerRow = (row: number): Sign[] => {
    // @todo
    if (row === 0) {
      return ["+", "+", "+"]
    }

    if (row === 1) {
      return ["=", "=", "="]
    }

    return []
  }

  const emptyRow = (signs: Sign[]): JSX.Element => {
    return (
      <>
        {signs.map(
          (sign: Sign, key: number): JSX.Element => (
            <Fragment key={key}>
              <SignComponent sign={sign} />

              {key !== signs.length - 1 && <div className="bbbb"></div>}
            </Fragment>
          ),
        )}
      </>
    )
  }

  return (
    <div className="grid">
      {puzzle.letters.map(
        (row: Row<string>, key: number): JSX.Element => (
          <Fragment key={key}>
            {row.map(
              (letters: string, key: number): JSX.Element => (
                <Fragment key={key}>
                  <div className="number">
                    <DigitComponent key={key} letters={letters} />
                  </div>
                  {key !== row.length - 1 ?
                    <SignComponent sign={key === 0 ? "+" : "="} />
                  : null}
                </Fragment>
              ),
            )}
            {key !== puzzle.letters.length - 1 ?
              emptyRow(signsPerRow(key))
            : null}
          </Fragment>
        ),
      )}
    </div>
  )
}
