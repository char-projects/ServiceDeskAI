import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchFiles = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/interrogate/uploads', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setFiles(data)
    } catch (e) {
      setError('Could not load uploads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return navigate('/login')
        const me = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
        if (!me.ok) return navigate('/')
        const body = await me.json()
        const role = body?.user?.role
        if (!(role === 'admin' || role === 'service')) return navigate('/')
        if (mounted) fetchFiles()
      } catch (e) {
        navigate('/')
      }
    })()
    return () => { mounted = false }
  }, [])


  return (
    <div className="container mx-auto px-4 pt-4 pb-32">
      <h1 className="text-2xl font-bold mb-4">Admin dashboard</h1>
      <div className="mb-4 text-sm text-gray-200">List of saved uploads</div>

      {error && <div className="text-red-400 mb-4">{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-3">
          {files.length === 0 && <div className="text-gray-300">No uploads found.</div>}
          {files.map((f, i) => (
            <div key={f.filename} className="p-3 bg-gray-700 rounded flex items-center justify-between">
              <div className="truncate">
                <div className="font-medium">{f.filename}</div>
                <div className="text-xs text-gray-300">{(f.size/1024).toFixed(1)} KB — {new Date(f.mtime).toLocaleString()}</div>
                {f.lastRetry && <div className="text-xs text-green-300">Last retry: {new Date(f.lastRetry).toLocaleString()}</div>}
              </div>
                <a className="text-sm underline text-blue-300" href={`/uploads/${encodeURIComponent(f.filename)}`} target="_blank" rel="noreferrer">Open</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
