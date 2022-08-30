const { ipcRenderer } = require("electron");
const path = require("path");

const editor = new SimpleMDE({
    element: document.getElementById("editor"),
    placeholder: "Markdown...",
    spellChecker: false,
    autosave: {
        enabled: true,
        uniqueId: "MyUniqueID",
        delay: 1000,
    },
    tabSize: 4,// Anot
});

editor.toggleSideBySide();

ipcRenderer.on("editor-event", (event, arg) => {
    console.log("arg",arg);
    event.sender.send("editor-reply", `Received ${arg}`);
    console.log("event");
    console.log(event);
});

//^ Sending confirmation messages to the main process
ipcRenderer.send("editor-reply", "Page Loaded");

//contextBridge
const func = async () => {
    const response = await window.versions.ping();
    console.log(response); // prints out 'pong'
};