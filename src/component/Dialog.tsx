import { JSX, ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function Dialog({ children }: Props): JSX.Element {
  return <div id="dialog">{children}</div>
}
