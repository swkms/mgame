const { app, globalShortcut, BrowserWindow,protocol } = require('electron')
require('./config')
const { createWindow } = require('./window')


function registerKey() {
  const isSuccess = globalShortcut.register('CommandOrControl+F12', () => {
    try {
      const window = BrowserWindow.getFocusedWindow()
      if (window) {
        if (window.webContents.isDevToolsOpened()) {
          window.webContents.closeDevTools()
        } else {
          window.webContents.openDevTools()
        }
      }
    } catch (err) {
      console.log("set dev tools faild", err)
    }
  })
  console.log("register key", isSuccess)
}

app.whenReady().then(() => {
  require('@electron/remote/main').initialize()
  createWindow("/", 640, 480, true)
  registerKey()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
