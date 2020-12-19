const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')

let mainWindow
let tray

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 194,
		frame: false,
		alwaysOnTop: true,
		backgroundColor: '#363636',
		darkTheme: true,
		// resizable: false,
		webPreferences: {
			nodeIntegration: true,
		},
	})
	mainWindow.hide()

	tray = new Tray('./static/icons/tray.png')
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Open',
			type: 'normal',
			click: () => (mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()),
		},
		{ type: 'separator' },
		{ label: 'Quit', type: 'normal', click: () => app.quit() },
	])
	tray.setContextMenu(contextMenu)

	tray.on('click', () => (mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()))

	mainWindow.on('show', () => {
		const mainWidowPos = mainWindow.getBounds()
		let y = 0
		let x = mainWidowPos.x
		mainWindow.setPosition(x, y)
	})

	mainWindow.on('blur', () => {
		mainWindow.hide()
	})

	mainWindow.setAutoHideMenuBar(true)
	mainWindow.loadFile('app/index.html')

	ipcMain.on('change-height', (event, arg) => {
		const mainWidowBounds = mainWindow.getBounds()
		const refreshIconHeight = 32
		arg
			? mainWindow.setSize(mainWidowBounds.width, mainWidowBounds.height - refreshIconHeight)
			: mainWindow.setSize(mainWidowBounds.width, mainWidowBounds.height + refreshIconHeight)
	})
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWinodw.getAllWindows().length === 0) {
		createWindow()
	}
})
