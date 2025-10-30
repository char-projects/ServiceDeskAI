import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const parseJsonSafe = async (res) => {
    try {
      const text = await res.text()
      return text ? JSON.parse(text) : {}
    } catch (e) {
      return {}
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isRegister) {
      if (!name || !email || !password || !confirm) {
        setError('Please fill all fields to register')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match')
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        const data = await parseJsonSafe(res)
        if (!res.ok) {
          const msg = data.error || data.message || res.statusText || 'Registration failed'
          setError(msg)
          return
        }

  if (data.token) localStorage.setItem('token', data.token)

        navigate('/')
        return
      } catch (err) {
        setError('Could not reach server')
      } finally {
        setLoading(false)
      }
    }

    // login
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await parseJsonSafe(res)
      if (!res.ok) {
        const msg = data.error || data.message || res.statusText || 'Login failed'
        setError(msg)
        return
      }

  if (data.token) localStorage.setItem('token', data.token)

      navigate('/')
    } catch (err) {
      setError('Could not reach server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-4 h-screen flex flex-col overflow-hidden pb-32 md:pb-24">
      <div className="text-center">
        <div className="font-bold text-3xl">ServiceDeskAI</div>
      </div>

      <div className="text-gray-700 mt-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{isRegister ? 'Create account' : 'Sign in'}</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm mb-1">Full name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm mb-1">Confirm password</label>
                <div className="relative">
                  <input
                    className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex justify-end">
              <button disabled={loading} type="submit" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded">{isRegister ? (loading ? 'Registering...' : 'Register') : (loading ? 'Logging in...' : 'Login')}</button>
            </div>
            <div className="text-sm text-center text-gray-700">
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button type="button" className="text-blue-700 underline" onClick={() => { setIsRegister(false); setError('') }}>Sign in</button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button type="button" className="text-blue-700 underline" onClick={() => { setIsRegister(true); setError('') }}>Register</button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
