const { app, BrowserWindow, Tray } = require("electron");

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.hide();

  tray = new Tray("./static/icons/tray.png");

  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  mainWindow.on("show", () => {
    //* Can't get right position on linux for now
    //* https://github.com/electron/electron/issues/15003
    const trayBounds = tray.getBounds();
    let y = 0;
    let x = 0;

    mainWindow.setPosition(x, y);
  });

  mainWindow.setAutoHideMenuBar(true);
  mainWindow.loadFile("app/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWinodw.getAllWindows().length === 0) {
    createWindow();
  }
});
