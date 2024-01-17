import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import { createCtrl, replaceIcon } from "../components/play-button";
import Unicode from "../iconUnicode";
import { Material } from "../icons";

class PlayButton implements Controll {
  private _el: HTMLElement;

  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this._el = createCtrl({ icon: Unicode.play });
    if (!config.showPlayPause) this._el.style.display = "none";
    this._el.addEventListener('click', () => {
      this.handleClick(player)
    })
  }

  private handleClick(player: SkaraPlayer) {
    if (player.ended) {
      player.currentTime = 0;
      player.play();
      return;
    }
    player.paused ? player.play() : player.pause()
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

export default PlayButton;
