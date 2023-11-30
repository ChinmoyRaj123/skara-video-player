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
    btn.style.mask = `url(${cfg.icon})`
    btn.style.webkitMask = `url(${cfg.icon})`
    btn.style.webkitMaskSize = 'contain'
    btn.style.webkitMaskRepeat = 'no-repeat'
  }

  if (cfg.style) {
    btn.style.cssText = JSON.stringify(cfg.style);
  } else {
    btn.className = styles.controls
  }
  return btn;
}

export const replaceIcon = (el: HTMLElement, icon: string) => {
  el.style.mask = `url(${icon})`
  el.style.webkitMask = `url(${icon})`
  el.style.webkitMaskSize = 'contain'
  el.style.webkitMaskRepeat = 'no-repeat'
}
