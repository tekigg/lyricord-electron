const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const contextMenu = require('electron-context-menu');
const serve = require('electron-serve');
const fs = require('fs');
const path = require('path');
const { initDB } = require('electron-data-holder');

// I have no idea how to properly encrypt your token to make sure other software can't get it sooooo 

initDB({ key: 'the-encryption-key'});



try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
let mainWindow;

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 400,
		defaultHeight: 400,
	});

	const mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		title: "LYRICORD",
		frame: false,
		transparent: true,
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32,
		},
		minHeight: 400,
		minWidth: 400,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			transparent:true,
			devTools: dev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Make App 💻',
		},
	],
});

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	console.log("encrypted stuff:" + safeStorage.encryptString("gaming"))

	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once('ready', createMainWindow);
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('to-main', (event, count) => {
	return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});
ipcMain.on('close-app', (event) => {
	mainWindow.close();
  });
  
  ipcMain.on('minimize-app', (event) => {
	mainWindow.minimize();
  });

  ipcMain.on('get-app-version', (event) => {
	const parentDirectory = path.join(__dirname, '..');
	const packagePath = path.join(parentDirectory, 'package.json');
  
	fs.readFile(packagePath, 'utf8', (err, data) => {
	  if (err) {
		console.error('Error reading package.json:', err);
		event.returnValue = 'Unknown';
	  } else {
		const packageInfo = JSON.parse(data);
		event.returnValue = packageInfo.version;
	  }
	});
  });
