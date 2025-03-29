const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('convert', {
	engToKor: (word) => ipcRenderer.invoke('convert:engToKor', word),
	korToEng: (word) => ipcRenderer.invoke('convert:korToEng', word)
})