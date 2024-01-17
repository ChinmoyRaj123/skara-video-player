import styles from "../style.module.css";
export type ControlProps = {
  icon?: string// Path of the icon
  text?: string
  style?: Record<string, string | number>
}

export const createCtrl = (cfg: ControlProps = {}) => {
  const btn = document.createElement('div');
  if (cfg.text) btn.textContent = cfg.text;
  if (cfg.icon) {
    const el = document.createElement("p");
    el.textContent = cfg.icon;
    el.className = styles.iconButtonImage;
    btn.appendChild(el)
  }
  if (cfg.style) {
    btn.style.cssText = JSON.stringify(cfg.style);
  } else {
    btn.className = styles.controls
  }
  return btn;
}

export const replaceIcon = (el: HTMLElement, icon: string) => {
  const imgel = el.children[0] as HTMLElement
  imgel.textContent = icon
}
