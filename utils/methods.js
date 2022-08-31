const { BrowserWindow, dialog } = require("electron");
const fs = require("fs");

function openFile() {
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
    if (dialogResult.filePaths && dialogResult.filePaths.length > 0) {
      const data = fs.readFileSync(dialogResult.filePaths[0], {
        encoding: "utf-8",
      });
      window.webContents.send("open", data);
    }
  });
}

function saveFile() {
  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send("editor-event", "save");
}

module.exports = {
  openFile,
  saveFile,
};
