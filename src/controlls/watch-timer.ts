import { Controll } from ".";
import { secondsToTime } from "../helper";
import styles from '../style.module.css'

class WatchTimer implements Controll {
  private _el: HTMLElement;
  private durationEl: HTMLSpanElement;
  private currTimeEl: HTMLSpanElement;

  constructor() {
    this._el = document.createElement('div');
    this._el.className = styles.watchTimer;
    this.durationEl = document.createElement('span');
    this.durationEl.textContent = '00:00';
    this.currTimeEl = document.createElement('span');
    this.currTimeEl.textContent = '00:00';

    this._el.append(this.currTimeEl, ' / ', this.durationEl)
  }

  public setDuration(time: number) {
    this.durationEl.textContent = secondsToTime(time);
  }

  public setCurrentTime(time: number) {
    this.currTimeEl.textContent = secondsToTime(time);
  }

  public get element() {
    return this._el;
  }
}

export default WatchTimer;
