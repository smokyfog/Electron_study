import React, { useState, useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import uuidv4 from 'uuid/v4'
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import "easymde/dist/easymde.min.css";

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import useIpcRenderer from './hooks/useIpcRenderer'


// 引入nodejs模块
const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')
const FileStore = new Store({ 'name': 'Files Data' })
const settingsStore = new Store({ name: 'Settings' })
const saveFileToStore = (files) => {
  // we don't have to store any info in file system ,eg: isnew, body, etc
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createAt } = file
    result[id]  = {
      id,
      path,
      title,
      createAt
    }
    return result
  }, {})
  FileStore.set('files', fileStoreObj)
}
// // electron-store的应用
// const Store = window.require('electron-store')
// const store = new Store()
// // 设置
// store.set('name', 'yq')
// console.log(store.get('name'))
// // 删除
// store.delete('name')
// console.log(store.get('name'))

function App() {
  const [ files, setFiles ] = useState(FileStore.get('files') || {})
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([]) 
  const [ unsavedFileIDs, setUnsaveFileIDs ] = useState([])
  const [ searchFiles, setSearchFiles ] = useState([])
  const filesArr = objToArr(files)
  const saveLocation =  settingsStore.get('savedFileLocation') || remote.app.getPath('documents')
  const activeFile =  files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr =  (searchFiles.length > 0) ? searchFiles : filesArr
  
  // 打开文档
  const fileClick = (fileID) => {
    // set currid active file
    setActiveFileID(fileID)
    const currentFile = files[fileID]
    if (!currentFile.isLoaded) {
      fileHelper.redFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true }
        setFiles({ ...files, [fileID]: newFile })
      })
    }
    // if openedFiles don't have the current ID
    // then add new fileID to openedFiles
    if (!openedFileIDs.includes(fileID)) {
      // add new fileID to openedFiles
      setOpenedFileIDs([ ...openedFileIDs, fileID ])
    }
  }
  // 文档切换
  const tabClick = (fileID) => {
    setActiveFileID(fileID)
  }
  
  // 关闭文档
  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setOpenedFileIDs(tabsWithout)
    // set the active to the first opened tab if tab left
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0])
    } else {
      setActiveFileID('')
    }
  }
  
  // 文件内容发生改变的回调 
  const fileChange = (id, value) => {
    // const newFiles =  files.map(file => {
    //    if (file.id === id) {
    //      file.body = value
    //    }
    //    return file
    // })
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value }
      setFiles({ ...files, [id]: newFile })
      // update unsaveIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsaveFileIDs( [...unsavedFileIDs, id] )
      }
    }
  }

  // 删除笔记
  const deleteFile = (id) => {
    if (files[id].isNew) {
      const { [id]: value, ...afterDelete } = files
      setFiles(afterDelete)
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        const { [id]: value, ...afterDelete } = files
        setFiles(afterDelete)
        saveFileToStore(afterDelete)
        tabClose(id)
      })
    }
  }

  // 修改笔记的名称
  const updateFileName = (id, title, isNew) => {
    // loop through files, and update the title
    // const newFiles = files.map(file => {
    //   if (file.id === id) { 
    //     file.title = title
    //     file.isNew = false
    //   }
    //   return file
    // })
    // newPath should be different based on isNew
    // if isNew is flase, path should be old dirname + new title
    const newPath = isNew 
      ? join(saveLocation, `/${title}.md`) 
      : join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile }
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
          setFiles(newFiles)
          saveFileToStore(newFiles)
        })
    } else {
      const oldPath = files[id].path
      fileHelper.renameFile( oldPath, newPath ).then(() => {
        setFiles(newFiles)
        saveFileToStore(newFiles)
      })
    }
    
  }

  // 搜索笔记
  const fileSearch = (keywords) => {
    const newFiles = filesArr.filter(files => files.title.includes(keywords))
    setSearchFiles(newFiles)
  }

  const createNewFile = () => {
    const newID = uuidv4()
    // const newFiles = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: '',
    //     body: '## 请输入 MarkDown',
    //     createdAt: new Date().getTime(),
    //     isNew: true
    //   }
    // ]
    const newFile = {
      id: newID,
      title: '',
      body: '## 请输入 MarkDown',
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({ ...files, [newID]: newFile })
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(
      activeFile.path ,
      activeFile.body
    ).then(() => {
      setUnsaveFileIDs(unsavedFileIDs.filter(id => id !== activeFile.id))
    })
  }

  const importFiles = () => {
    // 调用主进程
    remote.dialog.showOpenDialog({
      title: '选择导入的 Markdown 文件',
      properties: [ 'openFile', 'multiSelections'],
      filters: [
        {
          name: 'Markdown files',
          extensions: ['md']
        }
      ]
    }).then(({filePaths: paths}) => {
      if (paths.length) {
        // filter out the path we already have in electron stroe
        const filteredPaths = paths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => {
            return file.path === path
          })
          return !alreadyAdded
        })
        // extend the path array to ab array contaibs files info
        const importFilesArr = filteredPaths.map(path => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            path
          }
        })
        // get the new files object in flattenArr
        const newFiles = { ...files, ...flattenArr(importFilesArr) }
        // setState and update electron store
        setFiles(newFiles)
        saveFileToStore(newFiles)
        if (importFilesArr.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功导入了${ importFilesArr.length }个文件`,
            message: `成功导入了${ importFilesArr.length }个文件`
          })
        }
      }
    })
  }

  // useEffect(() => {
  //   const callback = () => {
  //     console.log('hello from menu')
  //   }
  //   ipcRenderer.on('create-new-file', callback)
  //   return () => {
  //     ipcRenderer.removeAllListeners('create-new-file', callback)
  //   }
  // })

  useIpcRenderer({
    'create-new-file': createNewFile,
    'import-file': importFiles,
    'save-edit-file': saveCurrentFile
  })
  
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={ fileSearch }
          />
          <FileList
            files={ fileListArr }
            onFileClick={ fileClick }
            onFileDelete={ deleteFile }
            onSaveEdit={ updateFileName }
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                icon={ faPlus }
                text="新建"
                colorClass="btn-primary"
                onBtnclick={ createNewFile }
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={ faFileImport }
                onBtnclick={ importFiles }
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {
            !activeFile &&
            <div className="start-page">
              选择或者创建新的 Markdown 文档
            </div>
          }
          {
            activeFile &&
            <>
              <TabList
                files={ openedFiles }
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                onTabClick={ tabClick }
                onCloseTab={ tabClose }
              />
              <SimpleMDE
                className="MDE"
                key={ activeFile && activeFile.id }
                value={ activeFile && activeFile.body }
                onChange={(value) => { fileChange(activeFile.id, value) }}
                options={{
                  minHeight: 'calc(100% - 100px)',
                  width: '100%'
                }}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
