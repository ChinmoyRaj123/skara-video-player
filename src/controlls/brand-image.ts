import { Controll } from ".";
import SkaraPlayer, { PlayerConfig } from "..";
import styles from "../style.module.css";

class BrandImage implements Controll {
    private _el: HTMLImageElement;

    constructor(player: SkaraPlayer, config: PlayerConfig) {
        this._el = document.createElement("img");
        this._el.src = config.brandImage;
        this._el.className = styles.brandImage;
        if (!config.showBrandImage) this._el.style.display = "none";
    }

    public addTo(el: HTMLElement) {
        el.appendChild(this._el);
    }

    public get element() {
        return this._el;
    }
}

export default BrandImage;