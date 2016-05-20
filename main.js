/**
 * support electron 1.0.2
 */
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const http = require('http');

let mainWindow;

app.on('ready',function() {
	mainWindow = new BrowserWindow({
		width:1800,
		height:1000,
		minWidth:1200,
		minHeight:800,
		center:true,
		icon: './1463145149_wrench.png'
	});
	mainWindow.loadURL('file://' + __dirname +'/signIn.html');
	mainWindow.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null
	});
});

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});