import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import { Material } from "../icons";
import styles from "../style.module.css";

class CenterButton implements Controll {
  private visible: boolean;
  private _el: HTMLElement;
  private _iconel: HTMLImageElement;

  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this.visible = false;
    this._el = document.createElement('div');
    this._el.className = styles.centerButton;
    if (!config.showPlayPause) this._el.style.display = "none";
    this._iconel = document.createElement('img');
    this._iconel.src = Material.PlayIcon;
    this._iconel.className = styles.centerButtonImage;
    this._el.appendChild(this._iconel)
    // this._el.style.mask = `url(${Material.PlayIcon})`;
    // this._el.style.webkitMask = `url(${Material.PlayIcon})`;
    // this._el.style.webkitMaskSize = 'contain';
    // this._el.style.webkitMaskRepeat = 'no-repeat';

    this._el.addEventListener('mouseover', () => {
      this._el.style.backgroundColor = config.theme?.colors?.iconButtonHoverColor as string;
    })

    this._el.addEventListener('mouseleave', () => {
      this._el.style.backgroundColor = config.theme?.colors?.iconButtonColor as string;
    })

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
