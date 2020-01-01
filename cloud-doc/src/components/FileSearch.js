import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/usekeypress'

const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  // 使用useRef记住dom节点
  let node = useRef(null)
  const closeSearch = () => {
    setInputActive(false)
    setValue('')
    onFileSearch('')
  }
  useEffect(() => { 
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }
    // const handleInoutEvent = (event) => {
    //   const { keyCode } = event
    //   if (keyCode === 13 && inputActive) {
    //     onFileSearch(value)
    //   } else if (keyCode === 27 && inputActive){
    //     closeSearch(event)
    //   }
    // }
    // document.addEventListener('keyup', handleInoutEvent)
    // return () => {
    //   document.removeEventListener('keyup', handleInoutEvent)
    // }
  })
  useEffect(() => {
    if (inputActive) {
      node.current.focus()
    }
  }, [inputActive])
  return (
    <div 
      className="alert alert-primary d-flex justify-content-between align-items-center mb-0"
      style={{ borderRadius: 0 }}
    >
      { !inputActive &&
        <>
          <span>{ title }</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => { setInputActive(true) }}
          >
            <FontAwesomeIcon
              title="搜索"
              size="lg"
              icon={ faSearch }
            />
          </button>
        </>
      }
      {
        inputActive &&
        <>
          <input
            className="form-control"
            value={ value }
            ref={ node }
            onChange={(e) => { setValue(e.target.value) }}
          />
          <button
            type="button"
            className="icon-button"
            onClick={ closeSearch }
          >
            <FontAwesomeIcon
              title="关闭"
              size="lg"
              icon={ faTimes }
            />
          </button>
        </>
      }
    </div>
  )
}

// 类型检查器
FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}
// 添加默认值
FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch