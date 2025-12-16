import { JSX, useState } from "react"
import InfoDialog from "./InfoDialog"

export default function InfoButton(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  const handleClick = (): void => {
    setOpen((oldValue: boolean): boolean => !oldValue)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <>
      {open && <InfoDialog onClose={handleClose} />}
      <span role="button" className="info" onClick={handleClick}>
        ⁉️
      </span>
    </>
  )
}
