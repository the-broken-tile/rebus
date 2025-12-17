import { JSX, ReactNode } from "react"

type Props = {
  children: ReactNode
  id: string
  onClose: () => void
}

export default function Dialog({ id, children, onClose }: Props): JSX.Element {
  return (
    <>
      <div id={id} className="dialog">
        <span className="close-dialog" onClick={onClose} />
        {children}
      </div>
      <div className="dialog-backdrop"></div>
    </>
  )
}
