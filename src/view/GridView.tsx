import { Fragment, JSX } from "react"
import { Tuple } from "../models/Grid"
import Sign from "../models/Sign"
import { usePuzzleContext } from "../context/PuzzleContext"
import GridCellView from "./GridCellView"

export default function GridView(): JSX.Element {
  const { puzzle } = usePuzzleContext()

  return (
    <div className="grid">
      {puzzle.letterGrid.map(
        (row: Tuple<string, 5>, rowNumber: number): JSX.Element => (
          <Fragment key={rowNumber}>
            {row.map(
              (value: string | Sign | "", colNumber: number): JSX.Element => {
                return <GridCellView key={colNumber} value={value} />
              },
            )}
          </Fragment>
        ),
      )}
    </div>
  )
}
