/// <reference types="vite/client" />

interface ElectronAPI {
  showNotification: (title: string, body: string) => Promise<void>
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

interface Window {
  electronAPI?: ElectronAPI
}
