import { app, BrowserWindow, ipcMain, Menu, Notification, screen } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const POSITION_FILE = path.join(app.getPath('userData'), 'window-position.json')

function loadPosition(): { x: number; y: number } | null {
  try {
    const data = fs.readFileSync(POSITION_FILE, 'utf-8')
    const pos = JSON.parse(data)
    const displays = screen.getAllDisplays()
    const inBounds = displays.some(d =>
      pos.x >= d.bounds.x && pos.x < d.bounds.x + d.bounds.width &&
      pos.y >= d.bounds.y && pos.y < d.bounds.y + d.bounds.height
    )
    return inBounds ? pos : null
  } catch {
    return null
  }
}

function savePosition() {
  if (!win) return
  const [x, y] = win.getPosition()
  fs.writeFileSync(POSITION_FILE, JSON.stringify({ x, y }))
}

function createWindow() {
  Menu.setApplicationMenu(null)

  const savedPos = loadPosition()

  win = new BrowserWindow({
    width: 380,
    height: 520,
    ...(savedPos ? { x: savedPos.x, y: savedPos.y } : {}),
    resizable: false,
    maximizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    icon: path.join(process.env.VITE_PUBLIC!, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ポモドーロタイマー',
  })

  win.on('moved', savePosition)

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
