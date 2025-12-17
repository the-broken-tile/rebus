import { StrictMode } from "react"
import ReactDOM, { Root } from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import config from "./config.json"

const root: Root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
)
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

config.debug && reportWebVitals(console.log)
