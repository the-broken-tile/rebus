import { Fragment, JSX } from "react"
import Puzzle from "../Puzzle"
import { Row } from "../Grid"
import DigitComponent from "./DigitComponent"
import SignComponent from "./SignComponent"
import Sign from "../Sign"
import { usePuzzleContext } from "../PuzzleContext"
import UndoButton from "./UndoButton"

export default function GridComponent(): JSX.Element {
  const { puzzle } = usePuzzleContext()

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

  const emptyRow = (addUndo: boolean, signs: Sign[]): JSX.Element => {
    return (
      <>
        {signs.map(
          (sign: Sign, key: number): JSX.Element => (
            <Fragment key={key}>
              <SignComponent sign={sign}>
                {addUndo && key === signs.length - 1 ?
                  <UndoButton type="portrait" />
                : null}
              </SignComponent>
              {key !== signs.length - 1 && <div></div>}
            </Fragment>
          ),
        )}
      </>
    )
  }

  return (
    <div className="grid">
      {puzzle.letters.map(
        (row: Row<string>, rowNumber: number): JSX.Element => (
          <Fragment key={rowNumber}>
            {row.map(
              (letters: string, colNumber: number): JSX.Element => (
                <Fragment key={colNumber}>
                  <div className="number">
                    <DigitComponent key={colNumber} letters={letters} />
                  </div>
                  {colNumber !== row.length - 1 ?
                    <SignComponent sign={colNumber === 0 ? "+" : "="}>
                      {rowNumber === 0 && colNumber === row.length - 2 ?
                        <UndoButton type="landscape" />
                      : null}
                    </SignComponent>
                  : null}
                </Fragment>
              ),
            )}
            {rowNumber !== puzzle.letters.length - 1 ?
              emptyRow(
                rowNumber === puzzle.letters.length - 2,
                signsPerRow(rowNumber),
              )
            : null}
          </Fragment>
        ),
      )}
    </div>
  )
}
