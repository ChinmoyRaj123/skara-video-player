import styles from "./style.module.css"
import Hls, { Level } from "hls.js"
import { theme, Theme } from "./theme"

import { AttachKeyboardShortcuts } from "./keyboard-shortcut"
import { SEEK_TIME_STEP, VOL_CF, VOL_CHANGE_STEP } from "./constant"
import PlayButton from "./controlls/play-button"
import { Material } from "./icons"
import FullSrcCtrl from "./controlls/full-src-button"
import VolumeController from "./controlls/volume-controll"
import Osd from "./controlls/osd"
import WatchTimer from "./controlls/watch-timer"
import ProgressBar from "./controlls/progress-bar"
import SettingControl from "./controlls/setting"
import Spinner from "./controlls/spinner"
import CenterButton from "./controlls/center-button"
import PrgsContainerWrapper from "./controlls/progress-container-wrapper"
import Toolbar from "./controlls/tool-bar"
import OrientationLock from "./controlls/orientation"

export type PlayerConfig = {
  src: string
  height?: string
  width?: string
  theme?: Theme
  title: string
  autoplay: boolean
  muted: boolean
  loop: boolean
  showCenterPlayPause: boolean
  showPlayPause: boolean
  showProgressBar: boolean
  showTimestamp: boolean
  showVolumeBar: boolean
  showVideoTitle: boolean
  showSettings: boolean
  showFullscreen: boolean
}

type EventName = 'loaded' |
  'metadataloaded' |
  'playing' |
  'pause' |
  'ended' |
  'volumechange' |
  'ratechange' |
  'timeupdate' |
  'waiting' |
  'stalled' |
  'abort' |
  'suspend';

const defaultConfig: PlayerConfig = {
  title: "",
  src: "",
  autoplay: false,
  muted: false,
  loop: false,
  showCenterPlayPause: true,
  showPlayPause: true,
  showProgressBar: true,
  showTimestamp: true,
  showVolumeBar: true,
  showVideoTitle: true,
  showSettings: true,
  showFullscreen: true,
  theme: {
    colors: {
      primary: "",
      secondary: "",
      centerIconButtonColor: "",
      centerIconButtonHoverColor: "",
      iconButtonColor: "",
      iconButtonHoverColor: "",
      brandColor: "",
      progressBGColor: "",
      progressLoadedColor: "",
      settingsBGColor: "",
      settingsTextColor: "",
      settingsHoverColor: "",
      tooltipTextColor: "",
      tooltipBGColor: "",
    },
    spacing: {
      padding: "",
      margin: "",
      bottomBarSpacing: "",
      playerControlMargin: "",
      playerCornerRadius: "",
      centerIconButtonCornerRadius: "",
      centerIconButtonPadding: "",
      centerIconButtonSize: "",
      iconButtonCornerRadius: "",
      iconButtonPadding: "",
      progressBarHeight: "",
      progressBarHoverScale: ""
    },
  }
}
/**
 * @class SkaraPlayer
 */
class SkaraPlayer {
  /**
  * The `videoEl` parent element. This is the root element of the player
  */
  private _root: HTMLDivElement

  /**
  * The Html5 video element
  */
  private _videoEl: HTMLVideoElement;

  private hls: Hls | null

  /**
  * Set when hls levels are loaded for the time 
  * This is used to not to create level change every time `LEVEL_LOADED` event
  * fired
  */
  private levelLoaded = false


  private _theme: Theme;

  /**
  * The pogress bar inside the osd. 
  * This is the bar which actually changes its background with time change
  */
  public _prgsBar: HTMLDivElement | null

  /** 
  * The whole OSD bar element. The parent of progess bar and other control elements
  */
  public _osdBar: Osd;

  // Controlls and Components
  public _playBtn: PlayButton;
  public _volCtrl: VolumeController;
  public _watchTimer: WatchTimer;
  public _progressBar: ProgressBar;
  public _setting: SettingControl;
  public _centerBtn: CenterButton;
  public _spinner: Spinner;
  public _toolBar: Toolbar;

  private detachKeyHandler;

  public _isFullscreen: boolean


  // Events
  private events: { [k in EventName]?: () => void }

  /**
   * @constructor
   * @param el - The html element where the player will be mounted
   * @param config - player options
   * @returns SkaraPlayer
   */
  constructor(el: HTMLDivElement | string, public config: PlayerConfig = defaultConfig) {

    // Setting default variables
    this._prgsBar = null;
    this.events = {}
    this._isFullscreen = false;
    this.hls = null;


    // The the root element 
    // FIXME: This can be a `Node` or `string`
    if (el instanceof HTMLDivElement) {
      this._root = el;
    } else {
      const root = document.querySelector<HTMLDivElement>(`#${el}`);
      if (!root) throw new Error(`can not mount player on ${root}`);
      this._root = root
    }
    this._root.classList.add(styles.root)

    // Theme from config
    // TODO: Need a better implimentation
    this._theme = config.theme || theme

    // Set video element height and width if provided
    if (this.config.width) this._root.style.width = this.config.width;
    if (this.config.height) this._root.style.height = this.config.height;


    // Creating the Html5 video element
    this._videoEl = document.createElement('video')
    this._videoEl.autoplay = this.config.autoplay
    this._videoEl.muted = this.config.muted
    this._videoEl.loop = this.config.loop
    this._videoEl.className = styles.video

    this._playBtn = new PlayButton(this, this.config);
    this._volCtrl = new VolumeController(this, this.config);
    this._watchTimer = new WatchTimer(this.config);
    this._setting = new SettingControl(this, this.config);


    // Creating the OSD 
    this._osdBar = new Osd({
      left: [this._playBtn, this._volCtrl],
      right: [
        this._setting,
      ]
    })

    this._progressBar = new ProgressBar(this, this._osdBar, this._videoEl, this.config);
    const progressContainerWrapper = new PrgsContainerWrapper(this._progressBar, this._watchTimer)

    // Adding progess bar in the OSD
    // @ts-ignore
    this._osdBar.prepend(progressContainerWrapper)

    if (config?.theme) {
      const newtheme = document.querySelector(':root') as HTMLElement;
      const setRootVariables = (vars: Record<string, string>) => Object.entries(vars).forEach(v => newtheme?.style?.setProperty(v[0], v[1]));
      const colorVariables = {
        // "--skaraVideoPrimaryColor": this.theme?.colors?.primary,
        "--skaraVideoPrimaryColor": this.theme?.colors?.primary,
        "--skaraVideoSecondaryColor": this.theme?.colors?.secondary,

        "--bottomBarSpacing": this.theme?.spacing?.bottomBarSpacing,
        "--playerControlMargin": this.theme?.spacing?.playerControlMargin,
        "--playerCornerRadius": this.theme?.spacing?.playerCornerRadius,
        "--centerIconButtonCornerRadius": this.theme?.spacing?.centerIconButtonCornerRadius,
        "--centerIconButtonPadding": this.theme?.spacing?.centerIconButtonPadding,
        "--centerIconButtonSize": this.theme?.spacing?.centerIconButtonSize,
        "--iconButtonCornerRadius": this.theme?.spacing?.iconButtonCornerRadius,
        "--iconButtonPadding": this.theme?.spacing?.iconButtonPadding,
        "--progressBarHeight": this.theme?.spacing?.progressBarHeight,
        "--progressBarHoverScale": this.theme?.spacing?.progressBarHoverScale,

        "--centerIconButtonColor": this.theme?.colors?.centerIconButtonColor,
        "--centerIconButtonHoverColor": this.theme?.colors?.centerIconButtonHoverColor,
        "--iconButtonColor": this.theme?.colors?.iconButtonColor,
        "--iconButtonHoverColor": this.theme?.colors?.iconButtonHoverColor,
        "--brandColor": this.theme?.colors?.brandColor,
        "--progressBGColor": this.theme?.colors?.progressBGColor,
        "--progressLoadedColor": this.theme?.colors?.progressLoadedColor,
        "--settingsBGColor": this.theme?.colors?.settingsBGColor,
        "--settingsTextColor": this.theme?.colors?.settingsTextColor,
        "--settingsHoverColor": this.theme?.colors?.settingsHoverColor,
        "--tooltipTextColor": this.theme?.colors?.tooltipTextColor,
        "--tooltipBGColor": this.theme?.colors?.tooltipBGColor,

      }
      setRootVariables(colorVariables)
    }

    // Attch the idle and inactivity checker
    window.onload = () => this.idleHandler();

    // The spinner while player waits for data
    this._spinner = new Spinner();
    this._spinner.addTo(this._root)

    this._centerBtn = new CenterButton(this, this.config);
    this._root.appendChild(this._centerBtn.element);
    // Showing the center button at initial because player autoplay is off
    this._centerBtn.show();

    this._toolBar = new Toolbar(new FullSrcCtrl(this, this.config), this.config);
    // attaching events
    this.attachEventListeners();

    // Keyboard shortcuts
    this.detachKeyHandler = AttachKeyboardShortcuts(this);

    this._root.appendChild(this._videoEl);
    this._root.appendChild(this._osdBar.element);
    this._root.appendChild(this._toolBar.element);
    return this
  }

  /**
   * Starts the player 
   */
  async start() {
    // let fileType
    // const hlsarr = ["audio/x-mpegurl", "application/vnd.apple.mpegurl", "application/x-mpegurl"]
    // const r = await fetch(this.config.src, { method: 'HEAD' })
    // fileType = r.headers.get('Content-Type')
    // if (hlsarr.includes(fileType?.toLowerCase() as string)) {
    if (Hls.isSupported()) {
      this.hls = new Hls()
      this.hls.loadSource(this.config.src)
      this.hls.attachMedia(this._videoEl)
      this.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log('video and hls.js are now bound together !');
      });
      this.hls.on(Hls.Events.LEVEL_LOADED, () => {
        if (this.levelLoaded) return
        const setting = this._setting.createWindow({ player: this, levels: this.hls?.levels, hls: this.hls as Hls })
        this._root.appendChild(setting)
        this.levelLoaded = true
      });

      this.hls.on(Hls.Events.LEVEL_SWITCHED, () => {
        // TODO: when fixed from setting itself remove this code
        const activeIconWrapper = document.querySelectorAll(".iconWrapper")
        activeIconWrapper.forEach((item) => {
          if (item.hasChildNodes()) {
            item.firstChild?.remove()
          }
          if (item.getAttribute('data-id') === `quality_${this.hls?.currentLevel}`) {
            const activeIcon = document.createElement('div');
            activeIcon.className = styles.indicatorIcon
            item.appendChild(activeIcon)
          }
        });
        this._setting.quality = this.hls?.currentLevel as number;
      })

      this.hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.log('fatal network error encountered, try to recover');
              this.hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('fatal media error encountered, try to recover');
              this.hls?.recoverMediaError();
              break;
            default:
              // cannot recover
              this.hls?.destroy();
              break;
          }
        }
      });
    } else {
      console.log("Your browser does not support hls streaming")
    }
    // } else {
    //   this._videoEl.src = this.config.src
    // }
  }

  /**
   * @summary
   * Attach an event handler to the player instance 
   *
   * `loaded` - Fired when the frame at the current playback position of the media has finished loading; often the first frame.
   *
   * `metadataloade` - Fired when the metadata has been loaded
   *
   * `playing` - Fired when the video starts playing
   *
   * `paused` - Fired when the player is paused
   *
   * `ended` - Fired when when video has finished playing 
   *
   * `volumechange` - Fired when the player volume is changed
   *
   * `ratechange`  Fired when the playback rate has changed 
   *
   * `timeupdate` - Fired when the `currentTime` has changed 
   *
   * `waiting` - Fired when when the player is loading data or buffurring 
   *
   * `stalled` - Fired when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
   *
   * `abort` -  Fired when the resource was not fully loaded, but not as the result of an error 
   *
   * `suspend` - Fired when media data loading has been suspended.
   *
   * @param event - Name of the event 
   * @param callback - The callback function for the event handler 
   */
  public on(event: EventName, callback: () => void) {
    this.events[event] = callback
  }

  /**
   * @readonly
   * The root element of the player
   */
  public get root() {
    return this._root
  }

  /**
  * @readonly Tells whether the is paused  
  */
  public get paused() {
    return this._videoEl.paused
  }
  /**
   *  @summary
   *  Method will pause playback of the media, 
   *  if the media is already in a paused state this method will have no effect.
   */
  public pause() {
    return this._videoEl.pause()
  }

  /** 
   * @summary
   * Attempts to begin playback of the media. 
   * It returns a `Promise` which is resolved when playback has been successfully started. 
   */
  public play() {
    return this._videoEl.play();
  }

  public dispose() {
    this.detachKeyHandler();
    this.hls?.destroy();
    this._videoEl.src = "";
    this._videoEl.load()
  }

  /**
   * @summary
   * Sets the rate at which the media is being played back. 
   * This is used to implement user controls for fast forward, slow motion, and so forth. 
   * The normal playback rate is multiplied by this value to obtain the current rate, 
   * so a value of `1.0` indicates normal speed.
   *
   * If `playbackRate` is negative, the media is not played backwards.
   * 
   * Accepted values must be between `025` to `2.0`
   */
  public get playbackRate() {
    return this._videoEl.playbackRate;
  }

  /**
   * @summary
   * Sets the rate at which the media is being played back. 
   * This is used to implement user controls for fast forward, slow motion, and so forth. 
   * The normal playback rate is multiplied by this value to obtain the current rate, 
   * so a value of `1.0` indicates normal speed.
   *
   * If `playbackRate` is negative, the media is not played backwards.
   * 
   * Accepted values must be between `025` to `2.0`
   */
  public set playbackRate(rate: number) {
    if (rate < .25 || rate > 2) {
      throw new Error("playback rate must between .25 and 2");
    }
    this._videoEl.playbackRate = rate
  }

  /**
   * @readonly Indicates the length of the media in seconds.
   */
  public get duration() {
    return this._videoEl.duration;
  }

  /**
   * @summary
   * Specifies the current playback time of the media in seconds.
   * Changing the value `currentTime` will seek the media to new time.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
   */
  public get currentTime() {
    return this._videoEl.currentTime
  }

  /**
    * @summary
    * Specifies the current playback time of the media in seconds.
    * Changing the value `currentTime` will seek the media to new time.
    * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
    */
  public set currentTime(time: number) {
    if (time < 0) {
      throw new Error("Error setting currentTime: time can not be less then 0");
    }

    if (time > this.duration) {
      throw new Error("Error setting currentTime: time exceeded");
    }
    this._videoEl.currentTime = time;
  }

  /**
   * @summary 
   * Seeks the media in forward
   *
   * @param step - The number of seconds the go forward
   */
  public seekForward(step: number = SEEK_TIME_STEP) {
    if (this.currentTime + step > this.duration) return;
    this._videoEl.currentTime = this.currentTime + step;
  }
  /**
     * @summary 
     * Seeks the media in backward
     *
     * @param step - The number of seconds the go backward
     */
  public seekBackward(step: number = SEEK_TIME_STEP) {
    if (this.currentTime - step <= 0) return;
    this._videoEl.currentTime = this.currentTime - step;
  }

  /**
   * @summary
   * Sets and Gets the volume at which the media will be played 
   * A `double` value must fall between `0` and `1`
   * where `0` is effectively muted and `1` is the loudest possible value 
   */
  public get volume() {
    return this._videoEl.volume;
  }

  /**
    * @summary
    * Sets and Gets the volume at which the media will be played 
    * A `double` value must fall between `0` and `1`
    * where `0` is effectively muted and `1` is the loudest possible value 
    */
  public set volume(vol: number) {
    if (vol < 0 || vol > 1) throw new Error("volume must be number between 0 and 1");
    this._videoEl.volume = vol
  }

  /**
   * @summary 
   * Sets and Gets whether the player is muted
   * A `true` value means the player is muted 
   */
  public get muted() {
    return this._videoEl.muted;
  }

  /**
   * @summary 
   * Sets and Gets whether the player is muted
   * A `true` value means the player is muted 
   */
  public set muted(val: boolean) {
    this._videoEl.muted = val;
  }

  /**
   * @summary
   * Indiates whether the media playback has ended or not 
   * A `true` value indicates the playback has ended
   */
  public get ended() {
    return this._videoEl.ended;
  }

  /**
   * @summary 
   * Increased the playback volume 
   * @param step - The value to increase volume
   */
  public incVolume(step = VOL_CHANGE_STEP) {
    if (this.volume === 1) return
    // Calculating correct vol by avoiding floating point precision error
    const vol = ((step * VOL_CF) + (this.volume * VOL_CF)) / VOL_CF;
    if (this.muted) this.muted = !this.muted
    this.volume = vol
  }
  /**
     * @summary 
     * Decreses the playback volume 
     * @param step - The value to decrease volume
     */
  public decVolume(step = VOL_CHANGE_STEP) {
    if (this.volume <= 0) {
      this.muted = true;
      return;
    }
    // Calculating correct vol by avoiding floating point precision error
    const vol = ((this.volume * VOL_CF) - (step * VOL_CF)) / VOL_CF;
    this.volume = vol
  }

  public showCtrls = () => {
    this._osdBar.show();
    this._toolBar.show();
  }

  public hideCtrls = () => {
    this._osdBar.hide();
    this._toolBar.hide();
  }

  /**
  * This method check for idle and inactive in the browser and hides and show osd 
  */
  public idleHandler() {
    let time: number;
    const resetTimer = () => {
      clearTimeout(time);
      time = setTimeout(this.hideCtrls, 3000)
      // 1000 milliseconds = 1 second
    }
    // window.onload = resetTimer;
    // DOM Events
    //window.addEventListener('load', resetTimer, true);
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
      document.addEventListener(name, resetTimer, true);
    });
    this._osdBar.element.addEventListener('mouseenter', () => {
      this.showCtrls()
      clearTimeout(time)
    })
    this._osdBar.element.addEventListener('mouseleave', () => {
      this.hideCtrls()
      resetTimer()
    })
    this._osdBar.element.addEventListener('mousemove', () => {
      this.showCtrls()
      clearTimeout(time)
    })
    this._toolBar.element.addEventListener('mouseenter', () => {
      this.showCtrls()
      clearTimeout(time)
    })
    this._toolBar.element.addEventListener('mouseleave', () => {
      this.hideCtrls()
      resetTimer()
    })
    this._toolBar.element.addEventListener('mousemove', () => {
      this.showCtrls()
      clearTimeout(time)
    })

    this._videoEl.addEventListener('mouseenter', () => {
      if (window.navigator.maxTouchPoints > 0) return;
      this.showCtrls();
    })
    this._videoEl.addEventListener('mouseleave', () => this.hideCtrls())
    this._videoEl.addEventListener('mousemove', () => {
      if (window.navigator.maxTouchPoints > 0) return;
      this.showCtrls();
    })
  };


  public getProgressBarEl() {
    return this._prgsBar
  }


  // FIXME: Can we do it better that a setter method?
  public setProgressBarEl(el: HTMLDivElement) {
    this._prgsBar = el
  }

  public get isFullscreen() {
    return this._isFullscreen;
  }

  public async toggleFullScreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        this._isFullscreen = false
      } else {
        await this.root.requestFullscreen()
        this._isFullscreen = true
      }
    } catch (e) {
      // TODO: must be a toast message 
      console.log(e)
    }
  }

  public get theme() {
    return this._theme;
  }

  private attachEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target;

      if (this._setting.element.isSameNode(target as HTMLElement)) return;

      if (this._setting.contains(target as HTMLElement)) {
        return;
      }

      // if (this._setting.popupVisible) {
      //   this._setting.hide();
      // }
    });

    this._videoEl.addEventListener('click', (_) => {
      if (this._setting.popupVisible) return;

      if (!this._toolBar.visible || !this._osdBar.visible) {
        this.showCtrls();
        return;
      }

      this._videoEl.paused ? this.play() : this.pause();
    });

    this._videoEl.addEventListener('touch', (_) => {
      if (this._setting.popupVisible) return;

      if (!this._toolBar.visible || !this._osdBar.visible) {
        this.showCtrls();
        return;
      }

      this._videoEl.paused ? this.play() : this.pause();
    });


    this._videoEl.addEventListener('dblclick', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        this._root.requestFullscreen()
      }
    });

    this._videoEl.addEventListener('loadedmetadata', () => {
      this.events.metadataloaded && this.events.metadataloaded();
    })

    this._videoEl.addEventListener('canplay', () => {
      this._spinner.hide()
    });

    this._videoEl.addEventListener('volumechange', () => {
      this._volCtrl.update(this);
      this.events.volumechange && this.events.volumechange();
    });

    this._videoEl.addEventListener('play', () => {
      this._spinner.hide();
      this._playBtn.changeIcon(Material.PauseIcon);
      this._centerBtn.hide();
      this.events.playing && this.events.playing()
    });

    this._videoEl.addEventListener('pause', () => {
      this._playBtn.changeIcon(Material.PlayIcon)
      this._centerBtn.show();
      this.events.pause && this.events.pause()
    });

    this._videoEl.addEventListener('ended', () => {
      this._playBtn.changeIcon(Material.ReplayIcon);
      this.events.ended && this.events.ended()
    })

    this._videoEl.addEventListener('loadeddata', () => {
      console.log('video loaded')
      this._watchTimer.setDuration(this.duration);
      this._spinner.hide()
      this.events.loaded && this.events.loaded()
    });

    this._videoEl.addEventListener('ratechange', () => {
      const activeIconWrapper = document.querySelectorAll(".currSpeed")
      activeIconWrapper.forEach((item) => {
        if (item.hasChildNodes()) {
          item.firstChild?.remove()
        }
        if (item.getAttribute('data-id') === `speed_${this.playbackRate}`) {
          const activeIcon = document.createElement('div');
          activeIcon.className = styles.indicatorIcon
          item.appendChild(activeIcon)
        }
      });
      this._setting.playbackRate = this.playbackRate;
      this.events.ratechange && this.events.ratechange();
    })

    // Showing playing time
    this._videoEl.addEventListener('timeupdate', () => {
      this._watchTimer.setCurrentTime(this.currentTime)
      this._progressBar.update(this, this.currentTime)
      this.events.timeupdate && this.events.timeupdate();
    });

    this._videoEl.addEventListener('waiting', (_) => {
      console.log(
        "waitng"
      )
      this._centerBtn.hide();
      this._spinner.show()

      this.events.waiting && this.events.waiting();
    });

    this._videoEl.addEventListener('abort', () => {
      this.events.abort && this.events.abort();
    })
    this._videoEl.addEventListener('suspend', () => {
      this.events.suspend && this.events.suspend();
    })
    this._videoEl.addEventListener('stalled', () => {
      this.events.stalled && this.events.stalled();
    })
  }

}

export default SkaraPlayer;
