const { Menu, shell } = require("electron");
const { ipcMain, BrowserWindow } = require("electron");

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

// ^Respuesta del canal 'editor-replay'
ipcMain.on("editor-reply", (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
  //  console.log(event);
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
