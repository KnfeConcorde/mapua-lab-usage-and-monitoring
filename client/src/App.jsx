import React, { useState } from 'react'

export default function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: fd
    })
    const data = await res.json()
    setResult(data)
  }

  async function fetchData() {
    const res = await fetch('http://localhost:5000/api/data')
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="app">
      <h1>Mapua Lab — Upload XLSX</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <button onClick={fetchData}>Load Stored Data</button>
      <pre className="output">{result ? JSON.stringify(result, null, 2) : 'No result yet'}</pre>
    </div>
  )
}
