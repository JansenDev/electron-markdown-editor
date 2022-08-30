const { ipcRenderer } = require("electron");
const path = require("path");

const editor = new SimpleMDE({
  element: document.getElementById("editor"),
  placeholder: "Markdown...",
  spellChecker: false,
  autosave: {
    // enabled: true,
    // uniqueId: "MyUniqueID",
    // delay: 1000,
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

ipcRenderer.on("open",(_,content)=>{
  editor.value(content)
})

//^ Sending confirmation messages to the main process
// ipcRenderer.send("editor-reply", "Page Loaded");

//^ 2. Sending confirmation messages to the main process
// ipcRenderer.invoke("test",{text:"prro!"})

//contextBridge
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // prints out 'pong'
};
