
const fs = require('fs').promises
const path = require('path')

const fileHelper = {
  redFile: (path, cb) => {
    return fs.readFile(path, { encoding: 'utf-8' })
  },
  writeFile: (path, content, cb)  => {
    return fs.writeFile(path, content, { encoding: 'utf8' })
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath)
  },
  deleteFile: (path) => {
    return fs.unlink(path)
  }
}

// const testPath = path.join(__dirname, 'helper.js')
// const testWritePath = path.join(__dirname, 'hello.md')
// const renamePath = path.join(__dirname, 'rname.md')

// // 读文件
// fileHelper.redFile(testPath).then((data) => {
//   console.log(data)
// })

// // 写文件
// fileHelper.writeFile(testWritePath, '## hello world').then(() => {
//   console.log('写入成功！')
// }) 

// // 重命名
// fileHelper.renameFile(testWritePath, renamePath).then(() => {
//   console.log('重命名成功！')
// })

// // 删除文件
// fileHelper.deleteFile(renamePath).then(() => [
//   console.log(`${renamePath} 删除成功！`)
// ])