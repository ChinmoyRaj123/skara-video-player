import SkaraPlayer from ".";
const createShortcuts = (player: SkaraPlayer): Record<string, (player: SkaraPlayer) => void> => ({
  ArrowUp: (player) => player.incVolume(),
  ArrowDown: (player) => player.decVolume(),
  ArrowLeft: (player) => player.seekBackward(),
  ArrowRight: (player) => player.seekForward(),
  f: (player) => player.toggleFullScreen(),
  F: (player) => player.toggleFullScreen(),
  m: (player) => player.muted = !player.muted,
  M: (player) => player.muted = !player.muted,
  " ": (player) => player.paused ? player.play() : player.pause()
});

export const AttachKeyboardShortcuts = (player: SkaraPlayer) => {
  const shortcuts = createShortcuts(player);
  const shortcustHandler = (e: KeyboardEvent) => {
    for (let key in shortcuts) {
      if (e.key === key) shortcuts[e.key](player)
    }
  }
  document.addEventListener("keydown", shortcustHandler, true);

  const deatachShortcut = () =>  document.removeEventListener("keydown", shortcustHandler, true);

  return deatachShortcut;
}
