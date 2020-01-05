const fs = window.require('fs').promises
// const path = window.require('path')

const fileHelper = {
  redFile: (path) => {
    return fs.readFile(path, { encoding: 'utf-8' })
  },
  writeFile: (path, content)  => {
    return fs.writeFile(path, content, { encoding: 'utf8' })
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath)
  },
  deleteFile: (path) => {
    return fs.unlink(path)
  }
}

export default fileHelper