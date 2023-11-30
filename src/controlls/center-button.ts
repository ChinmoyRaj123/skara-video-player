import { Controll } from ".";
import SkaraPlayer from "..";
import { Material } from "../icons";
import styles from "../style.module.css";

class CenterButton implements Controll {
  private visible: boolean;
  private _el: HTMLElement;

  constructor(player: SkaraPlayer) {
    this.visible = false;
    this._el = document.createElement('div');
    this._el.className = styles.centerButton;
    this._el.style.mask = `url(${Material.PlayIcon})`;
    this._el.style.webkitMask = `url(${Material.PlayIcon})`;
    this._el.style.webkitMaskSize = 'contain';
    this._el.style.webkitMaskRepeat = 'no-repeat';

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
