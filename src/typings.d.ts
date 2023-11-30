declare module '*.css' {
  interface CssStyle {
    [className: string]: string
  }
  const classNames: CssStyle;
  export = classNames;
}
declare module "\*.svg" {
  const svg: string
  export default svg;
}
