import { Controll } from ".";
import styles from "../style.module.css";

type OsdParams = {
  left: Controll[]
  right: Controll[]
}
class Osd implements Controll {
  private _visibility: boolean = false;
  private _el: HTMLElement;
  private _innerEl: HTMLElement;
  constructor({ left, right }: OsdParams) {
    this._el = document.createElement('div');
    this._el.className = styles.osdBar;
    this._innerEl = document.createElement('div');
    this._innerEl.className = styles.innerOsd;
    const ctrlContainer = document.createElement('div');
    ctrlContainer.className = styles.ctrlContainer;
    const ctrlLeft = document.createElement('div');
    ctrlLeft.className = styles.ctrlLeft;
    const ctrlRight = document.createElement('div');
    ctrlRight.className = styles.ctrlRight;
    left.forEach(ctrl => ctrlLeft.appendChild(ctrl.element));
    right.forEach(ctrl => ctrlRight.appendChild(ctrl.element));
    ctrlContainer.appendChild(ctrlLeft);
    ctrlContainer.appendChild(ctrlRight);
    this._innerEl.appendChild(ctrlContainer);
    this._el.appendChild(this._innerEl);
  }

  public get element() {
    return this._el;
  }

  public get visible() {
    return this._visibility;
  }

  public show() {
    this._visibility = true;
    this._el.classList.add(styles.osdActive);
  }

  public hide() {
    this._visibility = false;
    this._el.classList.remove(styles.osdActive);
  }

  public append(ctrl: Controll) {
    this._innerEl.appendChild(ctrl.element);
  }

  public prepend(ctrl: Controll) {
    this._innerEl.prepend(ctrl.element);
  }
}

export default Osd;
