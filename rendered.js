const { ipcRenderer } = require("electron");
const path = require("path");
const { encode } = require("punycode");

const editor = new SimpleMDE({
  element: document.getElementById("editor"),
  placeholder: "Markdown...",
  spellChecker: false,
  autosave: {
    enabled: true,
    uniqueId: "MyUniqueID",
    delay: 1000,
  },
  tabSize: 4, // Anot
});

editor.toggleSideBySide();

ipcRenderer.on("editor-event", (event, arg) => {
  console.log(arg);
  console.log(typeof arg);

  // event.sender.send("editor-reply", `Received ${arg}`);
  if (arg === "toggle-bold") {
    editor.toggleBold();
  } else if (arg === "toggle-italic") {
    editor.toggleItalic();
  } else if (arg === "save") {
    const dataMD = editor.value();
    event.sender.send("save", dataMD);
  }
});

ipcRenderer.on("open", (_, content) => {
  editor.value(content);
});

function dropHandler(event) {
  event.preventDefault();
  // Debe haber un archivo
  if (event.dataTransfer.items) {
    // El tipo debe ser file
    if (event.dataTransfer.items[0].kind === "file") {
      // tranformamos como a File para obtener sus propiedades
      // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
      const file = event.dataTransfer.items[0].getAsFile();
      const matchMarkdownOrText = file.name.match(/\.(md|txt)$/) || [];
      const isMarkdownOrText = matchMarkdownOrText.length > 0;

      if (isMarkdownOrText || file.type === "text/markdown") {
        console.log("entró");
        let reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.onload = (e) => {
          const content = e.target.result;
          editor.value(content);
        };
      }
    }
  }
}

//^ Sending confirmation messages to the main process
// ipcRenderer.send("editor-reply", "Page Loaded");

//^ 2. Sending confirmation messages to the main process
// ipcRenderer.invoke("test",{text:"prro!"})

//contextBridge
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // prints out 'pong'
};
