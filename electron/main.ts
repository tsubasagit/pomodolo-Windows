import { app, BrowserWindow, ipcMain, Menu, Notification } from 'electron'
import path from 'node:path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  Menu.setApplicationMenu(null)

  win = new BrowserWindow({
    width: 380,
    height: 520,
    resizable: false,
    maximizable: false,
    frame: false,
    transparent: true,
    icon: path.join(process.env.VITE_PUBLIC!, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ポモドーロタイマー',
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

ipcMain.handle('show-notification', (_event, title: string, body: string) => {
  const notification = new Notification({ title, body })
  notification.show()
})

ipcMain.handle('minimize-window', () => {
  win?.minimize()
})

ipcMain.handle('close-window', () => {
  win?.close()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
