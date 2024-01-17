import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import Unicode from "../iconUnicode";
import styles from "../style.module.css";

class CenterButton implements Controll {
  private visible: boolean;
  private _el: HTMLElement;
  private _iconel: HTMLElement;

  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this.visible = false;
    this._el = document.createElement('div');
    this._el.className = styles.centerButton;
    if (!config.showCenterPlayPause) this._el.style.display = "none";
    this._iconel = document.createElement('p');
    this._iconel.className = styles.centerButtonImage;
    this._iconel.textContent = Unicode.play;
    this._el.append(this._iconel);
    this._el.addEventListener('click', () => {
      player.play();
    })
  }
  show() {
    this.visible = true;
    this._el.classList.remove(styles.centerBtnHide)
    this._el.classList.add(styles.centerBtnShow)
  };

  hide() {
    this.visible = false;
    this._el.classList.remove(styles.centerBtnShow)
    this._el.classList.add(styles.centerBtnHide)
  };

  public get element() {
    return this._el;
  }

}

export default CenterButton;
