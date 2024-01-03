import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import styles from "../style.module.css";

class BrandImage implements Controll {
    private _el: HTMLElement;
    private _iconel: HTMLImageElement;

    constructor(player: SkaraPlayer, config: PlayerConfig) {
        this._el = document.createElement("div");
        this._el.style.opacity = `${config.theme?.colors?.brandOpacity}`;
        this._iconel = document.createElement("img");
        this._iconel.src = config.brandImage;
        this._iconel.style.width = "100%";
        this._iconel.style.height = "100%";
        this._el.className = styles.brandImage;
        this._el.appendChild(this._iconel);
        if (!config.showBrandImage) this._iconel.style.display = "none";
    }

    public addTo(el: HTMLElement) {
        el.appendChild(this._el);
    }

    public get element() {
        return this._el;
    }
}

export default BrandImage;