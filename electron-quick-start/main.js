
const { app, BrowserWindow, ipcMain } = require('electron')

// 实例化完成
app.on('ready', () => {
  // 引入devtron
  require('devtron').install()
  //  主窗口
  let mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
  // 打开devtron
  mainWindow.webContents.openDevTools()
  // 接收信息
  ipcMain.on('message', (event, arg) => {
    console.log(arg)
    // 返回消息
    event.reply('reply', 'hello from main process')
  })
})

  // 子窗口
  // let secondWindow = new BrowserWindow({
  //   width: 400,
  //   height: 300,
  //   webPreferences: {
  //     nodeIntegration: true
  //   },
  //   parent: mainWindow
  // })
  // secondWindow.loadFile('second.html')