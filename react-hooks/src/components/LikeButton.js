import React, { useState, useEffect }  from 'react'
import useMousePosition from '../hooks/useMousePosition'

const LikeButton = () => {
  const position = useMousePosition()
  const [ like, setLike ]  = useState(0)
  const [ on, setOn ] = useState(true)
  // 第一次渲染和更新后都会被调用
  useEffect(() => {
    document.title = `点击了${like}次`
  })
  return (
    <>
      <p>{ position.y }</p>
      <button onClick={() => { setLike( like + 1 ) }}>
        { like } 👍  
      </button>
      <button onClick={() => { setOn( !on ) }}>
        { on ? 'On': 'off' } 
      </button>
    </>
  )
}

export default LikeButton