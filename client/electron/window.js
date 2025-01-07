'use strict';

const { app, ipcMain, BrowserWindow, screen } = require('electron')
const NODE_ENV = process.env.NODE_ENV
const path = require('path')


//打开主界面
ipcMain.handle('loginSuccess', async (event, config) => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
        exports.createWindow("", 1280, 720)
        window.close()
    }
})

//设置配置
ipcMain.handle('changeWindowStatus', async (event, statusType) => {
    const window = BrowserWindow.getFocusedWindow()
    if (window) {
        switch (statusType) {
            case "close": {
                window.close()
            }
                break;
            case "min": {
                window.minimize()
            }
                break;
        }
    }
})

exports.createWindow = function (router, width, height, fullscreen = false) {
    const mainWindow = new BrowserWindow({
        width: width == 0 ? screen.getPrimaryDisplay().workAreaSize.width : width,
        height: height == 0 ? screen.getPrimaryDisplay().workAreaSize.height : height,
        frame: false,
        show: false,
        icon: path.join(__dirname, '../public/favicon.ico'),
        autoHideMenuBar: true,
        fullscreen: fullscreen,
        resizable: true,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            // preload: path.join(__dirname, '/preload.js')
        }
    })
    require("@electron/remote/main").enable(mainWindow.webContents)
    console.log('model', NODE_ENV, router)
    mainWindow.loadURL(
        NODE_ENV === 'development'
            ? 'http://10.8.0.66:5000' + router
            : 'http://10.8.0.66:5000' + router
    );

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    })
    return mainWindow
}
