import styles from "../style.module.css"

class Spinner {
  private visible: boolean;
  private element: HTMLDivElement;
  constructor() {
    this.visible = false;
    this.element = document.createElement("div");
    this.element.className = styles.spinner;
    this.hide();
  }

  get() {
    return this.element;
  }
  show() {
    this.element.classList.remove(styles.hide);
    this.visible = true;
  };

  hide() {
    this.visible = false;
    this.element.classList.add(styles.hide);
  };

  addTo(el: HTMLElement) {
    el.appendChild(this.element)
  }
}

export default Spinner;
