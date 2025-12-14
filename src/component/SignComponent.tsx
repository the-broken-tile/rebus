import { JSX, ReactNode } from "react"
import Sign from "../models/Sign"

type Props = {
  sign: Sign
  children: ReactNode
}

export default function SignComponent({ sign, children }: Props): JSX.Element {
  return (
    <span className="sign">
      {sign}
      {children}
    </span>
  )
}
