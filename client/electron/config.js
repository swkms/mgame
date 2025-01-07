'use strict';

const { app, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

//获取用户目录 https://www.electronjs.org/zh/docs/latest/api/app
ipcMain.handle('getUserDirectory', async (event, name) => {
    return app.getPath(name);
})

//获取配置
ipcMain.handle('getConfig', async (event) => {
    return new Promise((resolve, reject) => {
        const rootPath = app.getPath("userData")
        const fileName = path.join(rootPath, "config.data")
        const exist = fs.existsSync(fileName)
        if (exist) {
            fs.readFile(fileName, { flag: 'r', encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    resolve(null);
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch {
                        resolve(null);
                    }

                }
            });
        } else {
            resolve(null)
        }
    })
})

//设置配置
ipcMain.handle('setConfig', async (event, config) => {
    return new Promise((resolve, reject) => {
        const rootPath = app.getPath("userData")
        const fileName = path.join(rootPath, "config.data")
        fs.writeFile(fileName, JSON.stringify(config), { flag: 'w', encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
})