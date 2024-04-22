// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
});
// contextBridge.exposeInMainWorld('electronStore', {
//     get: (key) => store.get(key),
//     set: (key, value) => store.set(key, value),
//   });
