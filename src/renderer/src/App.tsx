import { useState, useEffect } from 'react'
import axios from 'axios'
import '../../preload/preload'

const url = 'http://localhost:8000/'

function App(): JSX.Element {
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    const response = axios.get(url)
    response
      .then((res) => {
        setTitle(res.data.message)
      })
      .catch((error) => {
        setTitle(error.message)
      })
  })

  return <div>{title}</div>
}

export default App
