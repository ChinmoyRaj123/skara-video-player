export const theme = {
  colors: {
    primary: "#00b428",
    secondary: "#e8dd26",
    centerIconButtonColor: "green",
    centerIconButtonHoverColor: "yellow",
    iconButtonColor: "purple",
    iconButtonHoverColor: "violet",
    brandColor: "blue",
    progressBGColor: "red",
    progressLoadedColor: "blue",
    settingsBGColor: "blue",
    settingsTextColor: "red",
    settingsHoverColor: "green",
    tooltipTextColor: "blue",
    tooltipBGColor: "pink",
  },
  spacing: {
    padding: "6px",
    margin: "20px",
    bottomBarSpacing: "21px",
    playerControlMargin: "20px",
    playerCornerRadius: "12px",
    centerIconButtonCornerRadius: "4px",
    centerIconButtonPadding: "4px",
    iconButtonCornerRadius: "4px",
    iconButtonPadding: "4px",
    progressBarHeight: "4px",
    progressBarHoverScale: "1.8"
  }
}

export type Theme = typeof theme;
