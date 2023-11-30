import { Controll } from ".";
import SkaraPlayer from "..";
import { downScaler, secondsToTime, upScaler } from "../helper";
import styles from "../style.module.css";
import Osd from "./osd";

class ProgressBar implements Controll {
  private _el: HTMLElement;
  private wrapper: HTMLDivElement;
  private progressEl: HTMLDivElement;
  private scrubberEl: HTMLDivElement;
  private hoverEl: HTMLDivElement;
  private timeTooltipEl: HTMLDivElement

  private osd: Osd;
  private video: HTMLVideoElement;

  constructor(player: SkaraPlayer, osd: Osd, video: HTMLVideoElement) {
    this.osd = osd;
    this.video = video;
    // The whole progress bar
    this._el = document.createElement('div');
    this._el.className = styles.prgsContainer;
    this.wrapper = document.createElement('div');
    this.wrapper.className = styles.prgsWrapper;

    // Shows the progess value
    this.progressEl = document.createElement('div');
    this.progressEl.className = styles.prgsBar
    this.wrapper.appendChild(this.progressEl)
    //player.setProgressBarEl(prgsBar);
    //
    // Scrubber 
    this.scrubberEl = document.createElement('div');
    this.scrubberEl.className = styles.scrubber;
    //scrubber.draggable = true
    //player.scrubber = scrubber;


    this.hoverEl = document.createElement('div');
    this.hoverEl.className = styles.prgsHover;
    this.wrapper.appendChild(this.hoverEl);

    // Showing seek time tooltip
    this.timeTooltipEl = document.createElement('div');
    this.timeTooltipEl.className = styles.seekTimeTooltip;
    this._el.appendChild(this.timeTooltipEl);

    this._el.appendChild(this.scrubberEl);
    this._el.appendChild(this.wrapper);

    this.addEventListener(player);
  }

  private getSeekablePos(pos: number) {
    return downScaler(this.wrapper.clientWidth)(pos);
  }

  private touchHandler(player: SkaraPlayer) {
    this._el.addEventListener('touchmove', (e) => {
      const touchPos = e.touches[0].clientX;
      const seekVal = upScaler(player.duration)(this.getSeekablePos(touchPos))
      this.scrubberEl.style.left = `${this.getSeekablePos(touchPos)}%`;
      this.progressEl.style.width = `${this.getSeekablePos(touchPos)}%`
      player.currentTime = seekVal
    })
  }

  private mouseMoveHandler(e: MouseEvent) {
    return (player: SkaraPlayer) => {
      const touchPos = e.clientX - this.wrapper.getBoundingClientRect().left
      const seekVal = upScaler(player.duration)(this.getSeekablePos(touchPos))
      this.scrubberEl.style.left = `${this.getSeekablePos(touchPos)}%`;
      this.progressEl.style.width = `${this.getSeekablePos(touchPos)}%`
      player.currentTime = seekVal
    }
  }

  private hoverHandler(e: MouseEvent) {
    return (player: SkaraPlayer) => {
      // getPrgsBarWith(val) - Reduces the progess bar with between 0-100 
      // by downscalling it from the original width 
      // The mouse cursor position on the progress bar
      const cursorPos = e.clientX - this.wrapper.getBoundingClientRect().left;
      // The mouse cursor position in percentage (0-100)
      const posInPercent = this.getSeekablePos(cursorPos < 0 ? 0 : cursorPos)
      // 45.67 /100
      //total duration player.player.duration
      // The seek time value based on mouse cursor position on the progess bar 
      const seekTime = secondsToTime(player.duration * (posInPercent / 100))
      this.timeTooltipEl.textContent = seekTime;
      this.timeTooltipEl.style.left = `${cursorPos}px`
      this.timeTooltipEl.style.opacity = '1'
      this.hoverEl.style.width = `${posInPercent}%`

    }
  }

  private addEventListener(player: SkaraPlayer) {
    const handler = (e: MouseEvent) => this.mouseMoveHandler(e)(player);

    this._el.addEventListener('touchmove', () => this.touchHandler(player));
    this.wrapper.addEventListener('mousedown', () => {
      this.video.addEventListener('mousemove', handler, true)
      this.osd.element.addEventListener('mousemove', handler, true)
    }, true)

    this.video.addEventListener('mouseup', () => {
      this.video.removeEventListener('mousemove', handler, true)
      this.osd.element.removeEventListener('mousemove', handler, true)
    })

    this.osd.element.addEventListener('mouseup', () => {
      this.osd.element.removeEventListener('mousemove', handler, true)
      this.video.removeEventListener('mousemove', handler, true)
    })
    this.wrapper.addEventListener('mouseup', () => {
      this.video.removeEventListener('mousemove', handler, true)
      this.osd.element.addEventListener('mousemove', handler, true)
    }, true);
    // Seeking thingy
    this.progressEl.addEventListener('click', (e) => {
      const cusrsorPos = e.clientX - this.wrapper.getBoundingClientRect().left
      const seekVal = upScaler(player.duration)(this.getSeekablePos(cusrsorPos))
      this.scrubberEl.style.left = `${this.getSeekablePos(cusrsorPos)}%`;
      player.currentTime = seekVal
    });

    this._el.addEventListener('click', (e) => {
      const cusrsorPos = e.clientX - this.wrapper.getBoundingClientRect().left
      const seekVal = upScaler(player.duration)(this.getSeekablePos(cusrsorPos))
      this.scrubberEl.style.left = `${this.getSeekablePos(cusrsorPos)}%`;
      player.currentTime = seekVal
    });

    this.wrapper.addEventListener('mousemove', (e) => this.hoverHandler(e)(player));
    this.wrapper.addEventListener('mouseleave', () => {
      this.timeTooltipEl.textContent = ''
      this.timeTooltipEl.style.opacity = '0'
      this.hoverEl.style.width = `0%`

    });
  }

  public update(player: SkaraPlayer, time: number) {
    this.progressEl.style.width = `${downScaler(player.duration)(time)}%`;
    this.scrubberEl.style.left = `${downScaler(player.duration)(time)}%`;
  }

  public get element() {
    return this._el;
  }
}

export default ProgressBar;
