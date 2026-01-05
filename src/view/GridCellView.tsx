import { JSX, ReactNode } from "react"
import Sign, { signs } from "../models/Sign"
import NumberView from "./NumberView"
import SignComponent from "../component/SignComponent"

type Props = {
  value: string | Sign | ""
  children?: ReactNode
}

export default function GridCellView({ value, children }: Props): JSX.Element {
  if (value === "") {
    return <div />
  }

  if (signs.includes(value)) {
    return <SignComponent sign={value}>{children}</SignComponent>
  }

  return <NumberView letters={value} />
}
