import { useState } from "react"

type Type = {
  visible: boolean
}

export default function useDocumentVisibility(): Type {
  const [visible, setVisible] = useState(true)

  document.addEventListener("visibilitychange", () => {
    setVisible(!document.hidden)
  })

  return {
    visible,
  }
}
