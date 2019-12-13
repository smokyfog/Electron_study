import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useURLLoader = (url) => {
  const [ data, setData ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(url)
     .then(res => {
      setData(res.data)
       setLoading(false)
     })
  }, [url])
  return [data, loading]
}

export default useURLLoader