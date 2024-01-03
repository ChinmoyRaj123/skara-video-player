import { Controll } from ".";
import { PlayerConfig } from "..";
import { createCtrl } from "../components/play-button";
import { Material } from "../icons";
import styles from "../style.module.css";
import FullSrcCtrl from "./full-src-button";

class Toolbar implements Controll {
  private _visibility: boolean = false;
  private _el: HTMLElement;
  private _backMain: HTMLElement;
  private _titleMain: HTMLElement;
  private _fullScrMain: HTMLElement;
  private _backBtn: HTMLElement;
  private _title: HTMLParagraphElement
  constructor(fullscrCtrl: FullSrcCtrl, config: PlayerConfig) {
    this._el = document.createElement('div');
    this._el.className = styles.toolBar;
    this._backBtn = createCtrl({ icon: Material.ArrowBackIcon });
    this._backBtn.style.visibility = "hidden";
    this._backBtn.addEventListener('click', () => {
      history.back();
    });
    this._title = document.createElement('p');
    this._title.className = styles.title;
    this._title.textContent = config.title;
    this._backMain = document.createElement('div');
    this._titleMain = document.createElement('div');
    this._fullScrMain = document.createElement('div');
    if (!config.showVideoTitle) this._titleMain.style.display = "none";
    this._backMain.className = styles.backArrowMainDiv;
    this._backMain.append(this._backBtn);
    this._titleMain.className = styles.titleMainDiv;
    this._titleMain.append(this._title);
    this._fullScrMain.className = styles.fullScrMainDiv;
    this._fullScrMain.append(fullscrCtrl.element);
    this._el.append(this._backMain, this._titleMain, this._fullScrMain);
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
