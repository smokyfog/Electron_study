const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const isDev = require('electron-is-dev')  // 用于判断当前环境
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const path = require('path')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const QiniuManager = require('./src/utils/QiniuManager')
const fileStore = new Store({name: 'Files Data'})

const createManager = () => {
  const accessKey = settingsStore.get('accessKey')
  const secretKey = settingsStore.get('secretKey')
  const bucketName = settingsStore.get('bucketName')
  console.log(accessKey, secretKey, bucketName)
  return new QiniuManager(accessKey, secretKey, bucketName)
}

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
  ipcMain.on('upload-file', (event, data) => {
    const manager = createManager()
    manager.uploadFile(data.key, data.path).then(data => {
      console.log('上传成功', data)
      mainWindow.webContents.send('active-file-uploaded')
    }).catch(() => {
      dialog.showErrorBox('同步失败', '请检查七牛云参数是否正确')
    })
  })

  ipcMain.on('download-file', (event, data) => {
    const manager = createManager()
    const filesObj = fileStore.get('files')
    const { key, path, id } = data
    manager.getStat(data.key).then((resp) => {
      const serverUpdatedTime = Math.round(resp.putTime / 10000)
      const localUpdatedTime = filesObj[id].updatedAt
      if (serverUpdatedTime > localUpdatedTime || !localUpdatedTime) {
        manager.downloadFile(key, path).then(() => {
          mainWindow.webContents.send('file-downloaded', {status: 'download-success', id})
        })
      } else {
        mainWindow.webContents.send('file-downloaded', {status: 'no-new-file', id})
      }
    }, (error) => {
      if (error.statusCode === 612) {
        mainWindow.webContents.send('file-downloaded', {status: 'no-file', id})
      }
    })
  })

  ipcMain.on('upload-all-to-qiniu', () => {
    mainWindow.webContents.send('loading-status', true)
    const manager = createManager()
    const filesObj = fileStore.get('files') || {}
    const uploadPromiseArr = Object.keys(filesObj).map(key => {
      const file = filesObj[key]
      return manager.uploadFile(`${file.title}.md`, file.path)
    })
    Promise.all(uploadPromiseArr).then(result => {
      console.log(result)
      // show uploaded message
      dialog.showMessageBox({
        type: 'info',
        title: `成功上传了${result.length}个文件`,
        message: `成功上传了${result.length}个文件`,
      })
      mainWindow.webContents.send('files-uploaded')
    }).catch(() => {
      dialog.showErrorBox('同步失败', '请检查七牛云参数是否正确')
    }).finally(() => {
      mainWindow.webContents.send('loading-status', false)
    })
  })

})