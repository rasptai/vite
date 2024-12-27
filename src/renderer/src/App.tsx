import '../../preload/preload'

import { useState } from 'react'

function App(): JSX.Element {
  async function sendFastAPIRequest(param: string) {
    const response = await fetch(`http://localhost:8000/${param}`)
    const data = await response.json()
    setMessage(data.test)
  }
  const [message, setMessage] = useState<string>('')

  return (
    <div>
      <h1>Hello, World!</h1>
      <button onClick={() => sendFastAPIRequest('root')}>Push</button>
      <button onClick={() => sendFastAPIRequest('test')}>Push</button>
      <p>{message}</p>
    </div>
  )
}

export default App
