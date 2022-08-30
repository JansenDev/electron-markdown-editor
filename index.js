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
const fs = require("fs");
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
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send("editor-event", "save");
  });

  globalShortcut.register("CmdOrCtrl+o", () => {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
      title: "Open markdown file",
      filters: [
        { name: "markdown", extensions: ["md", "txt"] },
        { name: "text", extensions: ["txt", "md"] },
      ],
      properties: ["showHiddenFiles"],
    };

    dialog.showOpenDialog(window, options).then((dialogResult) => {
      if (dialogResult.filePaths &&  dialogResult.filePaths.length > 0) {
        const data = fs.readFileSync(dialogResult.filePaths[0], {
          encoding: "utf-8",
        });
        window.webContents.send("open", data);
      }
    });
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
