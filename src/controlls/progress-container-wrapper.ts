import { Controll } from ".";
import styles from "../style.module.css";
import ProgressBar from "./progress-bar";
import WatchTimer from "./watch-timer";

class PrgsContainerWrapper implements Controll {
  private _el: HTMLElement;
  constructor(prgs: ProgressBar, timer: WatchTimer) {
    this._el = document.createElement('div')
    this._el.className = styles.prgsContainerWrapper
    this._el.append(prgs.element, timer.element)
  }

  public get element() {
    return this._el;
  }
}

export default PrgsContainerWrapper;
