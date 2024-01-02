import Hls, { Level } from "hls.js";
declare const theme: {
    colors: {
        primary: string;
        secondary: string;
        centerIconButtonColor: string;
        centerIconButtonHoverColor: string;
        iconButtonColor: string;
        iconButtonHoverColor: string;
        brandColor: string;
        progressBGColor: string;
        progressLoadedColor: string;
        progressForegroundColor: string;
        volumeBarBGColor: string;
        volumeBarForegroundColor: string;
        settingsBGColor: string;
        settingsTextColor: string;
        settingsHoverColor: string;
        tooltipTextColor: string;
        tooltipBGColor: string;
    };
    spacing: {
        padding: string;
        margin: string;
        bottomBarSpacing: string;
        playerControlMargin: string;
        playerCornerRadius: string;
        centerIconButtonCornerRadius: string;
        centerIconButtonPadding: string;
        centerIconButtonSize: string;
        iconButtonCornerRadius: string;
        iconButtonPadding: string;
        iconButtonSize: string;
        progressBarHeight: string;
        progressBarHoverScale: string;
        volumeBarHeight: string;
    };
};
type Theme = typeof theme;
interface Controll {
    element: HTMLElement;
}
declare class PlayButton implements Controll {
    constructor(player: SkaraPlayer, config: PlayerConfig);
    addTo(el: HTMLElement): void;
    changeIcon(icon: string): void;
    get element(): HTMLElement;
}
declare class FullSrcCtrl implements Controll {
    constructor(player: SkaraPlayer, config: PlayerConfig);
    get element(): HTMLElement;
}
declare class VolumeController implements Controll {
    constructor(player: SkaraPlayer, config: PlayerConfig);
    update(player: SkaraPlayer): void;
    get element(): HTMLElement;
}
type OsdParams = {
    left: Controll[];
    right: Controll[];
};
declare class Osd implements Controll {
    constructor({ left, right }: OsdParams);
    get element(): HTMLElement;
    get visible(): boolean;
    show(): void;
    hide(): void;
    append(ctrl: Controll): void;
    prepend(ctrl: Controll): void;
}
declare class WatchTimer implements Controll {
    constructor(config: PlayerConfig);
    setDuration(time: number): void;
    setCurrentTime(time: number): void;
    get element(): HTMLElement;
}
declare class ProgressBar implements Controll {
    constructor(player: SkaraPlayer, osd: Osd, video: HTMLVideoElement, config: PlayerConfig);
    update(player: SkaraPlayer, time: number): void;
    get element(): HTMLElement;
}
type CreateSettingWindowProps = {
    player: SkaraPlayer;
    levels?: Level[];
    hls?: Hls;
};
declare class SettingControl implements Controll {
    popupVisible: boolean;
    constructor(player: SkaraPlayer, config: PlayerConfig);
    show(): void;
    hide(): void;
    set quality(id: number);
    set playbackRate(rate: number);
    createWindow({ player, levels, hls }: CreateSettingWindowProps): HTMLElement;
    createLevelSelector(levels: Level[], hls: Hls): void;
    get element(): HTMLElement;
    get innerElement(): HTMLElement;
    contains(el: HTMLElement): boolean;
}
declare class Spinner {
    constructor();
    get(): HTMLDivElement;
    show(): void;
    hide(): void;
    addTo(el: HTMLElement): void;
}
declare class CenterButton implements Controll {
    constructor(player: SkaraPlayer, config: PlayerConfig);
    show(): void;
    hide(): void;
    get element(): HTMLElement;
}
declare class Toolbar implements Controll {
    constructor(fullscrCtrl: FullSrcCtrl, config: PlayerConfig);
    show(): void;
    hide(): void;
    get element(): HTMLElement;
    get visible(): boolean;
}
declare class BrandImage implements Controll {
    constructor(player: SkaraPlayer, config: PlayerConfig);
    addTo(el: HTMLElement): void;
    get element(): HTMLImageElement;
}
export type PlayerConfig = {
    src: string;
    mediaType: string;
    brandImage: string;
    height?: string;
    width?: string;
    theme?: Theme;
    title: string;
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    showBrandImage: boolean;
    showCenterPlayPause: boolean;
    showPlayPause: boolean;
    showProgressBar: boolean;
    showTimestamp: boolean;
    showVolumeBar: boolean;
    showVideoTitle: boolean;
    showSettings: boolean;
    showFullscreen: boolean;
    showBackButton: boolean;
};
type EventName = 'loaded' | 'metadataloaded' | 'playing' | 'pause' | 'ended' | 'volumechange' | 'ratechange' | 'timeupdate' | 'waiting' | 'stalled' | 'abort' | 'suspend';
/**
 * @class SkaraPlayer
 */
export default class SkaraPlayer {
    config: PlayerConfig;
    /**
    * The pogress bar inside the osd.
    * This is the bar which actually changes its background with time change
    */
    _prgsBar: HTMLDivElement | null;
    /**
    * The whole OSD bar element. The parent of progess bar and other control elements
    */
    _osdBar: Osd;
    _playBtn: PlayButton;
    _volCtrl: VolumeController;
    _watchTimer: WatchTimer;
    _progressBar: ProgressBar;
    _setting: SettingControl;
    _centerBtn: CenterButton;
    _spinner: Spinner;
    _toolBar: Toolbar;
    _brandImage: BrandImage;
    _isFullscreen: boolean;
    /**
     * @constructor
     * @param el - The html element where the player will be mounted
     * @param config - player options
     * @returns SkaraPlayer
     */
    constructor(el: HTMLDivElement | string, config?: PlayerConfig);
    /**
     * Starts the player
     */
    start(): Promise<void>;
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
    on(event: EventName, callback: () => void): void;
    /**
     * @readonly
     * The root element of the player
     */
    get root(): HTMLDivElement;
    /**
    * @readonly Tells whether the is paused
    */
    get paused(): boolean;
    /**
     *  @summary
     *  Method will pause playback of the media,
     *  if the media is already in a paused state this method will have no effect.
     */
    pause(): void;
    /**
     * @summary
     * Attempts to begin playback of the media.
     * It returns a `Promise` which is resolved when playback has been successfully started.
     */
    play(): Promise<void>;
    dispose(): void;
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
    get playbackRate(): number;
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
    set playbackRate(rate: number);
    /**
     * @readonly Indicates the length of the media in seconds.
     */
    get duration(): number;
    /**
     * @summary
     * Specifies the current playback time of the media in seconds.
     * Changing the value `currentTime` will seek the media to new time.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
     */
    get currentTime(): number;
    /**
      * @summary
      * Specifies the current playback time of the media in seconds.
      * Changing the value `currentTime` will seek the media to new time.
      * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime
      */
    set currentTime(time: number);
    /**
     * @summary
     * Seeks the media in forward
     *
     * @param step - The number of seconds the go forward
     */
    seekForward(step?: number): void;
    /**
       * @summary
       * Seeks the media in backward
       *
       * @param step - The number of seconds the go backward
       */
    seekBackward(step?: number): void;
    /**
     * @summary
     * Sets and Gets the volume at which the media will be played
     * A `double` value must fall between `0` and `1`
     * where `0` is effectively muted and `1` is the loudest possible value
     */
    get volume(): number;
    /**
      * @summary
      * Sets and Gets the volume at which the media will be played
      * A `double` value must fall between `0` and `1`
      * where `0` is effectively muted and `1` is the loudest possible value
      */
    set volume(vol: number);
    /**
     * @summary
     * Sets and Gets whether the player is muted
     * A `true` value means the player is muted
     */
    get muted(): boolean;
    /**
     * @summary
     * Sets and Gets whether the player is muted
     * A `true` value means the player is muted
     */
    set muted(val: boolean);
    /**
     * @summary
     * Indiates whether the media playback has ended or not
     * A `true` value indicates the playback has ended
     */
    get ended(): boolean;
    /**
     * @summary
     * Increased the playback volume
     * @param step - The value to increase volume
     */
    incVolume(step?: number): void;
    /**
       * @summary
       * Decreses the playback volume
       * @param step - The value to decrease volume
       */
    decVolume(step?: number): void;
    showCtrls: () => void;
    hideCtrls: () => void;
    /**
    * This method check for idle and inactive in the browser and hides and show osd
    */
    idleHandler(): void;
    getProgressBarEl(): HTMLDivElement | null;
    setProgressBarEl(el: HTMLDivElement): void;
    get isFullscreen(): boolean;
    toggleFullScreen(): Promise<void>;
    get theme(): {
        colors: {
            primary: string;
            secondary: string;
            centerIconButtonColor: string;
            centerIconButtonHoverColor: string;
            iconButtonColor: string;
            iconButtonHoverColor: string;
            brandColor: string;
            progressBGColor: string;
            progressLoadedColor: string;
            progressForegroundColor: string;
            volumeBarBGColor: string;
            volumeBarForegroundColor: string;
            settingsBGColor: string;
            settingsTextColor: string;
            settingsHoverColor: string;
            tooltipTextColor: string;
            tooltipBGColor: string;
        };
        spacing: {
            padding: string;
            margin: string;
            bottomBarSpacing: string;
            playerControlMargin: string;
            playerCornerRadius: string;
            centerIconButtonCornerRadius: string;
            centerIconButtonPadding: string;
            centerIconButtonSize: string;
            iconButtonCornerRadius: string;
            iconButtonPadding: string;
            iconButtonSize: string;
            progressBarHeight: string;
            progressBarHoverScale: string;
            volumeBarHeight: string;
        };
    };
}
export default SkaraPlayer;

//# sourceMappingURL=index.d.ts.map
