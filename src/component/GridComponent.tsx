import { Fragment, JSX } from "react"
import { Tuple } from "../Grid"
import DigitComponent from "./DigitComponent"
import SignComponent from "./SignComponent"
import Sign from "../models/Sign"
import { usePuzzleContext } from "../PuzzleContext"
import UndoButton from "./UndoButton"

export default function GridComponent(): JSX.Element {
  const { puzzle } = usePuzzleContext()

  const signsBetweenRows = (
    numberOfColumns: number,
    beforeLastRow: boolean,
  ): Sign[] => {
    return Array.from<Sign>({ length: numberOfColumns }).fill(
      beforeLastRow ? "=" : "+",
    )
  }

  const emptyRow = (
    beforeLastRow: boolean,
    numberOfColumns: number,
  ): JSX.Element => {
    const signs: Sign[] = signsBetweenRows(numberOfColumns, beforeLastRow)

    return (
      <>
        {signs.map(
          (sign: Sign, key: number): JSX.Element => (
            <Fragment key={key}>
              <SignComponent sign={sign}>
                {beforeLastRow && key === signs.length - 1 ?
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
        (row: Tuple<string, 3>, rowNumber: number): JSX.Element => (
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
              emptyRow(rowNumber === puzzle.letters.length - 2, row.length)
            : null}
          </Fragment>
        ),
      )}
    </div>
  )
}
