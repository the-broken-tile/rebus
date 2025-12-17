import { JSX, Ref } from "react"
import Dialog from "./Dialog"
import koFi from "../assets/ko-fi.png"
import FullscreenButton from "./FullscreenButton"
import AppRefContext, { useAppRefContext } from "../context/AppRefContext"

type Props = {
  onClose: () => void
}
export default function InfoDialog({ onClose }: Props): JSX.Element {
  const ref: AppRefContext = useAppRefContext()

  return (
    <Dialog id="info-dialog" onClose={onClose}>
      <div>
        If you like what I'm doing you can buy me a ko-fi at{" "}
        <a
          href="https://ko-fi.com/RusiPapazov"
          target="_blank"
          rel="external"
          title="If you like what I'm doing you can buy me a ko-fi"
        >
          <img src={koFi} alt="buy me a Ko-fi" id="ko-fi" />
        </a>
      </div>
      <div>
        If you notice any 🐛, please{" "}
        <a
          href="https://github.com/the-broken-tile/rebus/issues"
          target="_blank"
          rel="external"
        >
          report it
        </a>
        .
      </div>
      <header id="how-to-play-header">How to play:</header>
      <ul id="how-to-play">
        <li>Each symbol corresponds to exactly one number.</li>
        <li>All digits are present.</li>
        <li>Numbers cannot start with a 0.</li>
        <li>Right click or long tap to select an invalid option ❌</li>
        <li>Left click or tap to confirm a correct match ✅</li>
        <li>
          Once you have all the numbers correct, you will see a victory screen.
        </li>
      </ul>
      <FullscreenButton ref={ref} />
    </Dialog>
  )
}
