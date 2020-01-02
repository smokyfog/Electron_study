import React, { useState } from 'react';
import SimpleMDE from "react-simplemde-editor";
import uuidv4 from 'uuid/v4'
import { flattenArr, objToArr } from './utils/helper'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import "easymde/dist/easymde.min.css";
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
const fs = window.require('fs')
console.dir(fs)

function App() {
  const [ files, setFiles ] = useState(flattenArr(defaultFiles))
  const [ activeFileID, setActiveFileID ] = useState('')
  const [ openedFileIDs, setOpenedFileIDs ] = useState([]) 
  const [ unsavedFileIDs, setUnsaveFileIDs ] = useState([])
  const [ searchFiles, setSearchFiles ] = useState([])
  const filesArr = objToArr(files)
  
  
  // 打开文档
  const fileClick = (fileID) => {
    // set currid active file
    setActiveFileID(fileID)
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
    const newFile = { ...files[id], body: value }
    setFiles({ ...files, [id]: newFile })
    // update unsaveIDs
    if (!unsavedFileIDs.includes(id)) {
      setUnsaveFileIDs( [...unsavedFileIDs, id] )
    }
  }

  // 删除笔记
  const deleteFile = (id) => {
    // filter out th current file id
    // const newFiles = files.filter(file => file.id !== id)
    delete files[id]
    setFiles(files)
    // colse the tab if opened
    tabClose(id)
  }

  // 修改笔记的名称
  const updateFileName = (id, title) => {
    // loop through files, and update the title
    // const newFiles = files.map(file => {
    //   if (file.id === id) {
    //     file.title = title
    //     file.isNew = false
    //   }
    //   return file
    // })
    const modifiedFile = { ...files[id], title, isNew: false }
    setFiles({ ...files, [id]: modifiedFile })
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

  const activeFile =  files[activeFileID]
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchFiles.length > 0) ? searchFiles : filesArr
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
                key={ activeFile && activeFile.id }
                value={ activeFile && activeFile.body }
                onChange={(value) => { fileChange(activeFile.id, value) }}
                options={{
                  minHeight: '515px',
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
