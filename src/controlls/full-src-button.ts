import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import { createCtrl, replaceIcon } from "../components/play-button";
import Unicode from "../iconUnicode";
import { Material } from "../icons";

class FullSrcCtrl implements Controll {
  private _el: HTMLElement;
  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this._el = createCtrl({ icon: Unicode.fullscreen });
    if (!config.showFullscreen) this._el.style.display = "none";
    this.attachListener();
    this._el.addEventListener('click', () => {
      this.clickHandler(player)
    })
  }

  private attachListener() {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        replaceIcon(this._el, Unicode.fullscreen_exit);
      } else {
        replaceIcon(this._el, Unicode.fullscreen);
      }
    });
  }

  private clickHandler(player: SkaraPlayer) {
    player.toggleFullScreen()
  }

  public get element() {
    return this._el;
  }
}

export default FullSrcCtrl;
