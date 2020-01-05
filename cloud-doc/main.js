const { app, BrowserWindow, Menu } = require('electron')
const isDev = require('electron-is-dev')  // 用于判断当前环境
const menuTemplate = require('./src/menuTemplate')
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : 'http://bk.yanqiang.xyz'
  mainWindow.loadURL(urlLocation)
  // 打开devtron
  mainWindow.webContents.openDevTools()
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})