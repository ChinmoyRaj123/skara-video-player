import { Controll } from ".";
import { createCtrl } from "../components/play-button";
import { Material } from "../icons";
import styles from "../style.module.css";
import FullSrcCtrl from "./full-src-button";

class Toolbar implements Controll {
  private _visibility: boolean = false;
  private _el: HTMLElement;
  private _backBtn: HTMLElement;
  private _title: HTMLParagraphElement
  constructor(fullscrCtrl: FullSrcCtrl, title: string) {
    this._el = document.createElement('div');
    this._el.className = styles.toolBar;
    this._backBtn = createCtrl({ icon: Material.ArrowBackIcon });
    this._backBtn.addEventListener('click', () => {
      history.back();
    });
    this._title = document.createElement('p');
    this._title.className = styles.title;
    this._title.textContent = title;
    this._el.append(this._backBtn, this._title, fullscrCtrl.element);
  }

  public show() {
    this._visibility = true;
    this._el.classList.add(styles.osdActive);
  }

  public hide() {
    this._visibility = false;
    this._el.classList.remove(styles.osdActive);
  }

  public get element() {
    return this._el;
  }

  public get visible() {
    return this._visibility;
  }
}

export default Toolbar;
