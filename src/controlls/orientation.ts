import { Controll } from ".";
import SkaraPlayer from "..";
import { createCtrl, replaceIcon } from "../components/play-button";
import { Material } from "../icons";

class OrientationLock implements Controll {
  private _el: HTMLElement;
  private rotated: boolean;

  constructor(player: SkaraPlayer) {
    this._el = createCtrl({ icon: Material.ScrLockRotationIcon });
    this.rotated = false;
    this._el.addEventListener('click', () => {
      this.handleClick(player)
    })
  }

  private handleClick(player: SkaraPlayer) {
    if (this.rotated) {
      player.root.style.transform = 'rotate(-90deg)'
      this.rotated = false;
      this.changeIcon(Material.ScrLockRotationIcon)
      return;
    }

    if (!player.isFullscreen) {
      player.toggleFullScreen().then(() => {
        player.root.style.transform = 'rotate(90deg)'
      })
    } else {
      player.root.style.transform = 'rotate(90deg)'
    }
    this.changeIcon(Material.ScrLockLandscapeIcon)
    this.rotated = true;
  }

  public addTo(el: HTMLElement) {
    el.appendChild(this._el);
  }

  public changeIcon(icon: string) {
    replaceIcon(this._el, icon);
  }

  public get element() {
    return this._el;
  }
}

export default OrientationLock;
