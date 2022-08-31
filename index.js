const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcRenderer,
  ipcMain,
  dialog,
} = require("electron");
const path = require("path");
const methods = require("./utils/methods");
const menu = require("./menu");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // webSecurity: false,
      // allowRunningInsecureContent: true,
      // preload: path.join(__dirname, 'preload.js')
      worldSafeExecuteJavaScript: true,
    },
    // autoHideMenuBar:true
  });
  win.webContents.openDevTools();
  Menu.setApplicationMenu(menu);

  // https://www.electronjs.org/docs/latest/api/accelerator
  globalShortcut.register("ctrl+r", () => {
    console.log("CmdOrCtrl+R global pressed!");
  });

  globalShortcut.register("CmdOrCtrl+s", () => {
    methods.saveFile();
  });

  globalShortcut.register("CmdOrCtrl+o", () => {
    methods.openFile();
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ipcMain.handle('ping', () => 'pong');

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

//
require("electron-reload")(__dirname, {
  electron: path.join(__dirname, "node_modules", ".bin", "electron"),
});
