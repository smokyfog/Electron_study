import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
 import PropTypes from "prop-types";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ value, setValue ] = useState('')
  let node = useRef(null)
  const closeSearch = (e, editItem) => {
    e.preventDefault()
    setEditStatus(false)
    setValue('')
    if (editItem.isNew) {
      onFileDelete(editItem.id)
    }
  }
  // 事件
  useEffect(() => { 
    const handleInoutEvent = (event
      ) => {
      const { keyCode } = event
      const editItem = files.find(file => file.id === editStatus)
      if (keyCode === 13 && editStatus && value.trim() !== '') {
        onSaveEdit(editItem.id, value)
        setEditStatus(false)
        setValue('')
      } else if (keyCode === 27 && editStatus){
        closeSearch(event, editItem)
      }
    }
    document.addEventListener('keyup', handleInoutEvent)
    return () => {
      document.removeEventListener('keyup', handleInoutEvent)
    }
  })
  // 新建逻辑
  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if (newFile) {
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])

  useEffect(() => {
    if (editStatus) {
      node.current.focus()
    }
  }, [editStatus]);
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files.map(file => (
          <li
            className="list-group-item bg-light d-flex row align-items-center file-item mx-0"
            key={ file.id }
          >
            {
              ((file.id !== editStatus) && !files.isNew) &&
              <>
                <span className="col-2">
                  <FontAwesomeIcon
                    size="lg"
                    icon={ faMarkdown }
                  />
                </span>
                <span
                  className="col-6 c-link"
                  onClick={() => { onFileClick(file.id) }}
                >
                  { file.title }
                </span>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => { setEditStatus(file.id); setValue(file.title); }}
                >
                  <FontAwesomeIcon
                    title="编辑"
                    size="lg"
                    icon={ faEdit }
                  />
                </button>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => { onFileDelete(file.id) }}
                >
                  <FontAwesomeIcon
                    title="删除"
                    size="lg"
                    icon={ faTrash }
                  />
                </button>
              </>
            }
            {
              ((file.id === editStatus) || files.isNew) &&
              <>
                <input
                  className="form-control col-10"
                  value={ value }
                  ref={ node }
                  placeholder='请输入文件名称'
                  onChange={(e) => { setValue(e.target.value) }}
                />
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={(e)  => closeSearch(e, file) }
                >
                  <FontAwesomeIcon
                    title="关闭"
                    size="lg"
                    icon={ faTimes }
                  />
                </button>
              </>
            }
            
          </li>
        ))
      }
    </ul> 
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileDelete: PropTypes.func,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func
}

export default FileList