import React, { useState, useEffect } from 'react'
import axios from 'axios'

const DogShow = () => {
  const [ url, setUrl ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [fetch, setFetch] = useState(false)
  const style = {
    width: 200
  }
  // 当只需要执行一次且不依赖于任何一个属性时useEffect传入第二个参数为空数组
  // 这个实例定义了第一次和当依赖fetch改变时再次调用当前useEffect
  useEffect(() => {
     setLoading(true)
     axios.get('https://dog.ceo/api/breeds/image/random')
      .then(res => {
        setUrl(res.data.message)
        setLoading(false)
      })
  }, [fetch])
  return (
    <>
      { loading ? <p>🐶读取中</p>
      : <img src={url} alt="dog" style={ style } /> }
      <button onClick={() => { setFetch(!fetch) }}>
        再看一张图片
      </button>
    </>
  )
}

export default DogShow