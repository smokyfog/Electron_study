import React, { useState, useEffect } from 'react'

// 必须以use开头
const useMousePosition = () => {
  const [ positions, setPositions ] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updateMouse = (event) => {
      setPositions({ x: event.clientX, y: event.clientY })
    }
    // 添加订阅
    document.addEventListener('mousemove', updateMouse)
    return () => {  // 在组件卸载的时候做事情
      // 清除订阅
      document.removeEventListener('mousemove', updateMouse)
    }
  })
  return positions
}

export default useMousePosition