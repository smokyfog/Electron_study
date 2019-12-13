// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { ipcRenderer } = require('electron')
// 导入remote
const { BrowserWindow } = require('electron').remote

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('node-version').innerHTML = process.versions.node
  // 发出消息
  document.getElementById('send').addEventListener('click', () => {
    ipcRenderer.send('message', 'hello from renderer')
    // 使用remote快捷的创建一个只有主进程模块才能使用的创建窗口的功能
    let win = new BrowserWindow({
      width: 800,
      height: 600
    })
    win.loadURL('https://baidu.com')
  })
  ipcRenderer.on('reply', (event, arg) => {
    document.getElementById('message').innerHTML = arg
  })
})