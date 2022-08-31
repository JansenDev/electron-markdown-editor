const { Menu, shell, dialog } = require("electron");
const { ipcMain, BrowserWindow } = require("electron");
const fs = require("fs");
const methods = require("./utils/methods");

const template = [
  {
    role: "help",
    submenu: [
      {
        label: "About Editor Component",
        click() {
          shell.openExternal("https://simplemde.com/");
        },
      },
    ],
  },
  {
    label: "Format",
    submenu: [
      {
        label: "Toggle Bold",
        click() {
          // ^Sending messages to the renderer process
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-bold");
        },
      },
      {
        label: "Tiggle Italic",
        click: () => {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-italic");
        },
      },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "Save",
        accelerator: "CmdOrCtrl+s",
        click: () => {
          methods.saveFile();
        },
      },
      {
        label: "Open",
        accelerator: "CmdOrCtrl+o",
        click: () => {
          methods.openFile();
        },
      },
    ],
  },
];

// Agregar un menu mas si se le pasa el env DEBUG
console.log("process.env.DEBUG:", process.env.DEBUG);
if (process.env.DEBUG) {
  template.push({
    label: "Debugging",
    submenu: [
      {
        label: "Dev Tools",
        role: "toggleDevTools",
      },
      { type: "separator" },
      { role: "reload", accelerator: "Alt+R", enabled: true },
    ],
  });
}

ipcMain.on("save", (event, arg) => {
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: "Save markdown file",
    filters: [
      {
        name: "markdown",
        extensions: ["md"],
      },
    ],
    properties: ["showHiddenFiles"],
  };

  dialog.showSaveDialog(window, options).then((dialogResult) => {
    if (!!dialogResult.filePath) {
      fs.writeFileSync(dialogResult.filePath, arg, { encoding: "utf-8" });
      console.log("Saved!");
    }
  });
  //   if (err) console.log(err);
  // });
});

// ^Respuesta del channel 'editor-replay'
ipcMain.on("editor-reply", (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
  //  console.log(event);
});

// ^Respuesta del invoke con channel 'test'
ipcMain.handle("test", (event, arg) => {
  console.log("INVOCADO: ", arg.text);
  console.log("arg: ", arg);
});

// @process.platform: (Linux|windows|masOs)
// aix
// darwin (macOS)
// freebsd
// linux
// openbsd
// sunos
// win32 (Windows platforms)

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
  });
}

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
