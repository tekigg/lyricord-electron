const { contextBridge, ipcRenderer  } = require('electron');



contextBridge.exposeInMainWorld('electron', {
	
	closeApp: () => ipcRenderer.send('close-app'),
	minimizeApp: () => ipcRenderer.send('minimize-app'),
	send: (channel, data) => {
		ipcRenderer.send(channel, data);
	},
	sendSync: (channel, data) => {
		ipcRenderer.sendSync(channel, data);
	},
	receive: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
	getAppVersion: () => {
		return ipcRenderer.sendSync('get-app-version');
	  },
});
