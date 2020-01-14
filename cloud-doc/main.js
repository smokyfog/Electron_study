const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const isDev = require('electron-is-dev')  // 用于判断当前环境
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const path = require('path')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})

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
  // set the menu
  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
  // hook up main event
  ipcMain.on('open-settings-window', () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow
    }
    const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
    settingsWindow = new AppWindow(settingsWindowConfig, settingsFileLocation)
    settingsWindow.removeMenu()
    settingsWindow.on('closed', () => {
      mainWindow = null
    })
  })
  // 打开devtron
  // mainWindow.webContents.openDevTools()
  ipcMain.on('config-is-saved', () => {
    // watch out menu items index for mac and windows
    let qiniuMenu = process.platform === 'darwin' ? menu.items[3]: menu.items[2]
    qiniuMenu.submenu.items[1].enabled = true
    const swicthItems = (toggle) => {
      [1, 2, 3].forEach(number => {
        qiniuMenu.submenu.items[number].enabled = toggle
      })
    }
    const qiniuIsCinfiged = ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
    if (qiniuIsCinfiged) {
      swicthItems(true)
    } else {
      swicthItems(false)
    }
  })
})