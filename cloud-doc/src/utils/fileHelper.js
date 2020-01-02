
const fs = require('fs')
const path = require('path')

const fileHelper = {
  redFile: (path, cb) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
      if (!err) {
        cb(data)
      }
    })
  },
  writeFile: (path, content, cb)  => {
    fs.writeFile(path, content, { encoding: 'utf8' }, (err) => {
      if (!err) {
        cb()
      }
    })
  }
}

const testPath = path.join(__dirname, 'helper.js')
const testWritePath = path.join(__dirname, 'hello.md')

fileHelper.redFile(testPath, (data) => {
  console.log(data)
})
fileHelper.writeFile(testWritePath, '## hello world', () => {
  console.log('写入成功')
})