import Hls, { Level } from "hls.js";
import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import { createCtrl } from "../components/play-button";
import { Material } from "../icons";
import styles from "../style.module.css";

type CreateSettingWindowProps = {
  player: SkaraPlayer
  levels?: Level[]
  hls?: Hls
}

type SettingItemProps = {
  text: string
  icon: string
  onClick: () => void
  value?: string
}
class SettingItem implements Controll {
  private _el: HTMLElement;
  private valueEl: HTMLDivElement;

  constructor(props: SettingItemProps) {
    this._el = document.createElement('div');
    this._el.className = styles.settingItem;

    const icon = document.createElement('div');
    icon.className = styles.icon;
    const iconel = document.createElement('img');
    iconel.style.width = "100%";
    iconel.style.height = "100%";
    iconel.src = props.icon;
    icon.appendChild(iconel);

    // icon.className = styles.icon;
    // icon.style.mask = `url(${props.icon})`;
    // icon.style.webkitMask = `url(${props.icon})`;
    // icon.style.webkitMaskSize = 'contain'
    // icon.style.webkitMaskRepeat = 'no-repeat'

    const levelDiv = document.createElement('div');
    levelDiv.textContent = props.text

    this.valueEl = document.createElement('div');
    this.valueEl.textContent = props.value || ""
    this.valueEl.style.fontSize = '12px';

    const dv = document.createElement('div');
    dv.style.cssText = `
      display:flex;
      align-items: center;
      gap: 8px
    `
    dv.append(icon, levelDiv)

    const moreIcon = document.createElement('div');
    moreIcon.className = styles.icon;

    const iconel2 = document.createElement('img');
    iconel2.style.width = "100%";
    iconel2.style.height = "100%";
    iconel2.src = Material.ChevronRightIcon;
    moreIcon.appendChild(iconel2);

    // moreIcon.style.mask = `url(${Material.ChevronRightIcon})`;
    // moreIcon.style.webkitMask = `url(${Material.ChevronRightIcon})`;
    // moreIcon.style.webkitMaskSize = 'contain'
    // moreIcon.style.webkitMaskRepeat = 'no-repeat'
    // moreIcon.style.width = '14px';
    // moreIcon.style.height = '14px';

    const dv2 = document.createElement('div');
    dv2.style.cssText = `
      display:flex;
      align-items: center;
      gap: 8px
    `
    dv2.append(this.valueEl, moreIcon)

    this._el.append(dv, dv2)

    this._el.addEventListener('click', () => props.onClick())

  }

  public get element() {
    return this._el
  }

  public setValue(val: string) {
    this.valueEl.textContent = val;
  }

}

class QualityItem implements Controll {
  private _el: HTMLDivElement;
  private indicatorWrapper: HTMLDivElement;

  constructor(props: { level: Level, id: number, onClick: () => void, setCurr?: boolean, default?: boolean }) {
    this._el = document.createElement('div')
    this._el.className = styles.listItem
    this.indicatorWrapper = document.createElement('div');
    this.indicatorWrapper.className = styles.activeIconWrapper
    this.indicatorWrapper.classList.add("iconWrapper")
    this.indicatorWrapper.setAttribute('data-id', `quality_${props.id}`);
    const labelNode = document.createElement('div')
    labelNode.textContent = props.level.height + "p" || ""
    this._el.appendChild(this.indicatorWrapper)
    this._el.appendChild(labelNode)

    props.default && this.setAsCurrent()

    this._el.addEventListener('click', () => {
      props.setCurr && this.setAsCurrent()
      props.onClick()
    })
  }

  public setAsCurrent() {
    const activeIconWrapper = document.querySelectorAll(".iconWrapper")
    activeIconWrapper.forEach(el => {
      if (el.hasChildNodes()) {
        el.firstChild?.remove()
      }
    })
    const activeIcon = document.createElement('div');
    activeIcon.className = styles.indicatorIcon
    this.indicatorWrapper.appendChild(activeIcon)
    // TODO: as it takes time to switch the level, we must impliment a toast message to notify
  }

  public get element() {
    return this._el;
  }
}
class SpeedItem implements Controll {
  private _el: HTMLDivElement;
  private indicatorWrapper: HTMLDivElement;

  constructor(props: { speed: number, onClick: () => void, setCurr?: boolean, default?: boolean }) {
    this._el = document.createElement('div')
    this._el.className = styles.listItem;
    this.indicatorWrapper = document.createElement('div');
    this.indicatorWrapper.className = styles.activeIconWrapper
    this.indicatorWrapper.classList.add("currSpeed")
    this.indicatorWrapper.setAttribute('data-id', `speed_${props.speed}`);
    const labelNode = document.createElement('div')
    labelNode.textContent = props.speed.toString() || ""
    this._el.appendChild(this.indicatorWrapper)
    this._el.appendChild(labelNode)

    props.default && this.setAsCurrent()


    this._el.addEventListener('click', () => {
      props.setCurr && this.setAsCurrent();
      props.onClick()
    })
  }

  public setAsCurrent() {
    const activeIconWrapper = document.querySelectorAll(".currSpeed")
    console.log(activeIconWrapper)
    activeIconWrapper.forEach(el => {
      console.log(el.hasChildNodes())
      if (el.hasChildNodes()) {
        el.firstChild?.remove()
      }
    })

    const activeIcon = document.createElement('div');
    activeIcon.className = styles.indicatorIcon
    this.indicatorWrapper.appendChild(activeIcon)
  }

  public get element() {
    return this._el;
  }
}



class SettingControl implements Controll {
  public popupVisible = false;
  private _el: HTMLElement;
  private _innerEl: HTMLDivElement;
  private _popupEl: HTMLElement;
  private _settingItems: HTMLElement;
  private _levels: QualityItem[] = [];
  private _levelPopup: HTMLElement | undefined;
  private _speeds: SpeedItem[] = [];
  private _speedPopup: HTMLElement | undefined;

  private lastChilds: HTMLElement[] = [];

  private ctrls: Record<string, SettingItem> = {};
  private hlsLevels: Level[] = [];

  constructor(player: SkaraPlayer, config: PlayerConfig) {
    this._popupEl = document.createElement('div');
    this._popupEl.className = styles.settingWrapper;
    this._settingItems = document.createElement('div');
    this._settingItems.style.width = '100%';
    this._innerEl = document.createElement('div');

    this._el = createCtrl({ icon: Material.SettingIcon });
    if (!config.showSettings) this._el.style.display = "none";

    this._el.addEventListener('click', () => {
      this.popupVisible ? this.hide() : this.show();
    });

    this.createSpeedSelector(player)
  }

  public show() {
    if (this.popupVisible) return;
    this.popupVisible = true;
    this._popupEl.style.display = "block";
    this._popupEl.style.zIndex = "16";
  }

  public hide() {
    if (!this.popupVisible) return;
    this.popupVisible = false;
    this._popupEl.style.display = "none";
    this._popupEl.style.zIndex = "-16";
  }

  public set quality(id: number) {
    const val = this.hlsLevels[id].height + "p" + (this.hlsLevels[id].attrs["FRAME-RATE"] || "");
    this.ctrls.qltyCtrl.setValue(val);
  }

  public set playbackRate(rate: number) {
    const val = rate === 1 ? 'Normal' : rate.toString();
    this.ctrls.speedCtrl.setValue(val);
  }

  public createWindow({ player, levels, hls }: CreateSettingWindowProps) {
    const speedCtrl = new SettingItem({
      text: "Playback speed",
      icon: Material.SlowMotionIcon,
      onClick: () => {
        this.lastChilds = this.getChild(this._popupEl);
        this._innerEl.replaceChildren(this._speedPopup as Node);
      },
      value: "Normal"
    });

    const qltyctrl = new SettingItem({
      text: "Quality",
      icon: Material.TuneIcon,
      onClick: () => {
        this.lastChilds = this.getChild(this._popupEl);
        this._innerEl.replaceChildren(this._levelPopup as Node);
      },
    });


    this._settingItems.append(qltyctrl.element, speedCtrl.element);
    this._innerEl.appendChild(this._settingItems);
    this.ctrls.qltyCtrl = qltyctrl;
    this.ctrls.speedCtrl = speedCtrl;

    if (levels && hls) {
      this.hlsLevels = levels;
      this.createLevelSelector(levels, hls)
    }
    this._innerEl.style.position = "relative";
    this._popupEl.appendChild(this._innerEl);

    return this._popupEl;
  }

  private backItem(title: string) {
    const btn = document.createElement('div')
    btn.textContent = title;
    btn.className = styles.listItem
    btn.style.borderBottom = "1px solid #8C9AAE"

    const icon = document.createElement('div')
    icon.className = styles.icon

    const iconel3 = document.createElement('img');
    iconel3.style.width = "100%";
    iconel3.style.height = "100%";
    iconel3.src = Material.ArrowBackIcon;
    icon.appendChild(iconel3);


    // icon.style.mask = `url(${Material.ArrowBackIcon})`;
    // icon.style.webkitMask = `url(${Material.ArrowBackIcon})`;
    // icon.style.webkitMaskSize = 'contain'
    // icon.style.webkitMaskRepeat = 'no-repeat'

    btn.prepend(icon)
    btn.addEventListener('click', () => {
      this.lastChilds = this.getChild(this._popupEl);
      this._innerEl.replaceChildren(this._settingItems)
    })

    return btn;
  }

  public createLevelSelector(levels: Level[], hls: Hls) {
    this._levelPopup = document.createElement('div')
    this._levelPopup.className = styles.settingPopup

    this._levels = levels.map((level, idx) => new QualityItem({
      level,
      id: idx,
      onClick: () => {
        hls.nextLevel = idx;
        this.hide()
        this.lastChilds = this.getChild(this._popupEl);
        this._innerEl.replaceChildren(this._settingItems);
        this.quality = idx
      },
      setCurr: true,
      ...(idx === 0 && { default: true })
    }));

    this._levelPopup.append(...this._levels.map(l => l.element));
    this._levelPopup.prepend(this.backItem('Quality'))
  }

  private createSpeedSelector(player: SkaraPlayer) {
    const speeds = [.25, .5, .75, 1, 1.25, 1.5, 2];

    this._speedPopup = document.createElement('div');
    this._speedPopup.className = styles.settingPopup;

    this._speeds = speeds.map(speed => new SpeedItem({
      speed,
      onClick: () => {
        player.playbackRate = speed;
        this.hide();
        this.lastChilds = this.getChild(this._popupEl);
        this._innerEl.replaceChildren(this._settingItems);
      },
      setCurr: true,
      ...(speed === 1 && { default: true })
    }));

    this._speedPopup.append(...this._speeds.map(s => s.element));
    this._speedPopup.prepend(this.backItem('Playback Speed'))
  }

  public get element() {
    return this._el;
  }
  public get innerElement() {
    return this._el.firstChild as HTMLElement;
  }
  private getChild(el: HTMLElement) {
    if (!el.hasChildNodes()) return [el];
    const allChilds: Array<HTMLElement> = [];
    const childs = el.childNodes;
    childs.forEach(ch => {
      allChilds.push(ch as HTMLElement);
      if (ch.hasChildNodes()) {
        allChilds.push(...this.getChild(ch as HTMLElement))
      }
    })
    return allChilds;
  };

  public contains(el: HTMLElement) {
    return this.lastChilds.some(node => el.isSameNode(node))
  }
}

export default SettingControl;
