import { JSX } from "react"
import Sign from "../Sign"

type Props = {
  sign: Sign
}

export default function SignComponent({ sign }: Props): JSX.Element {
  return <span className="sign">{sign}</span>
}
