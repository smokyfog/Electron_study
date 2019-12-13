import React, { useState, useEffect } from 'react'

const MouseTracker = () => {
  const [ positions, setPositions ] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const updateMouse = (event) => {
      setPositions({ x: event.clientX, y: event.clientY })
    }
    // 添加订阅
    document.addEventListener('click', updateMouse)
    return () => {  // 在组件卸载的时候做事情
      // 清除订阅
      document.removeEventListener('click', updateMouse)
    }
  })
  return (
    <p>X: { positions.x }, Y: { positions.y }</p>
  )
} 

export default MouseTracker