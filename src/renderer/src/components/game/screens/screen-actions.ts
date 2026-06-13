export const quitToDesktop = () => {
  if (!window.electron) {
    return;
  }

  void window.electron.requestQuit();
};
