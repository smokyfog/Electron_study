const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')  // 用于判断当前环境
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const path = require('path')
let mainWindow, settingsWindow;

app.on('ready', () => {
  const mainWindwConfig = {
    width: 1024,
    height: 680,
  }
  const urlLocation = isDev ? 'http://localhost:3000' : 'http://bk.yanqiang.xyz'
  mainWindow = new AppWindow(mainWindwConfig, urlLocation)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // hook up main event
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    settingsWindow.on('closed', () => {
      mainWindow = null
    })
  })
  // 打开devtron
  mainWindow.webContents.openDevTools()
  // set the menu
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})