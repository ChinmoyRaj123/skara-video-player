import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import { createCtrl, replaceIcon } from "../components/play-button";
import { VOL_CHANGE_STEP } from "../constant";
import { Material } from "../icons";
import styles from "../style.module.css";

class VolumeController implements Controll {
  private _el: HTMLElement;
  private muteCtrl: HTMLDivElement;
  private volSlider: HTMLInputElement;

  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this._el = document.createElement('div');
    this._el.className = styles.volCtrlWrapper;
    if (!config.showVolumeBar) this._el.style.display = "none";
    this.muteCtrl = createCtrl({ icon: player.muted ? Material.VolumeOffIcon : Material.VolumeOnIcon });
    this.volSlider = document.createElement('input')

    this.muteCtrl.addEventListener('click', () => {
      player.muted = !player.muted
    })

    this.volSlider.className = styles.volSlider;
    this.volSlider.classList.add(styles.sliderProgress)
    this.volSlider.type = 'range'
    this.volSlider.min = '0';
    this.volSlider.max = "1"
    this.volSlider.step = VOL_CHANGE_STEP.toString();
    this.volSlider.style.setProperty('--value', this.volSlider.value);
    this.volSlider.style.setProperty('--min', this.volSlider.min == '' ? '0' : this.volSlider.min);
    this.volSlider.style.setProperty('--max', this.volSlider.max == '' ? '1' : this.volSlider.max);

    this.volSlider.addEventListener('input', (e) => {
      this.volSlider.style.setProperty('--value', this.volSlider.value);
      // @ts-ignore
      player.volume = e.target.value;
    })

    const btnWrapper = document.createElement('div');
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = styles.sliderWrapper;
    btnWrapper.appendChild(this.muteCtrl);
    sliderWrapper.appendChild(this.volSlider)
    this._el.append(btnWrapper, sliderWrapper);
  }

  public update(player: SkaraPlayer) {
    if (player.volume === 0 || player.muted) {
      replaceIcon(this.muteCtrl, Material.VolumeOffIcon)
      this.volSlider.value = '0';
      this.volSlider.style.setProperty('--value', '0');
    } else if (player.volume > 0 && player.volume < .5) {
      replaceIcon(this.muteCtrl, Material.VolumeDownIcon)
      this.volSlider.value = player.volume.toString();
      this.volSlider.style.setProperty('--value', player.volume.toString());
    } else {
      replaceIcon(this.muteCtrl, Material.VolumeOnIcon)
      this.volSlider.value = player.volume.toString();
      this.volSlider.style.setProperty('--value', player.volume.toString());
    }
  }

  public get element() {
    return this._el;
  }
}

export default VolumeController;
