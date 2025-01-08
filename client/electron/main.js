const { app, globalShortcut, BrowserWindow, shell  } = require('electron')
require('./config')
const { createWindow } = require('./window')
const { exec, spawn, execFile } = require('child_process');

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

  const command = "G:\\Game\\FarCry4\\bin\\FarCry4.exe"
  const dir = "G:\\Game\\FarCry4\\bin\\"

  //shell.openExternal(command,{workingDirectory:dir})
  //spawn(command, [], { cwd: dir, detached: true })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
