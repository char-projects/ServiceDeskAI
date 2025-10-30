import React, { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [user, setUser] = useState(null)
  
  const [originalProfile, setOriginalProfile] = useState(null)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    favoriteOffice: '',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const token = localStorage.getItem('token')
        console.log('Profile: token present?', !!token)
        if (!token) {
          console.log('Profile: no token, skipping fetch')
          return
        }
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('Profile: GET /api/users/me status', res.status)
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          console.warn('Profile: fetch failed', res.status, txt)
          return
        }
        const body = await res.json()
        console.log('Profile: fetched body', body)
        if (body && body.user) {
          const u = body.user
          console.log('Profile: setting user from backend', u)
          setUser(u)
          const p = {
            name: u.name || '',
            email: u.email || '',
            password: u.password || '',
            location: u.location || '',
            favoriteOffice: u.favoriteOffice || ''
          }
          setOriginalProfile(p)
          setProfile({ name: '', email: '', password: '', location: '', favoriteOffice: '' })
        }
      } catch (e) {}
    })()
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
    } catch (e) {}
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone.'
    )
    if (!ok) return

    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const res = await fetch('/api/users/me', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || 'Failed to delete')
        }
      } else {
        console.warn('No auth token found while attempting account delete')
      }
      localStorage.removeItem('token')
      navigate('/login')
    } catch (err) {
      console.error('Delete account failed', err)
      window.alert('Could not delete account. Try again or contact support.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-4 h-screen flex flex-col overflow-hidden pb-32 md:pb-24">
      <div className="text-center">
        <div className="font-bold text-3xl">ServiceDeskAI</div>
      </div>
    <div className="mt-4 grid gap-6 grid-cols-1 flex-1 items-start">
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between md:justify-start gap-3 mb-3">
            <span className="text-lg font-bold">Profile</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="font-semibold text-lg truncate">{originalProfile?.name || user?.name || profile.name || 'Jane Doe'}</div>
              <div className="text-sm truncate">{user?.role || 'Admin'}</div>
            </div>
          </div>
        </div>

        <div className="px-4 flex flex-col">
          <div className="rounded-xl p-4 space-y-4 bg-gray-200 flex-1 flex flex-col justify-between">
            <div>
              <form className="space-y-3" onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                      const token = localStorage.getItem('token')
                      if (!token) {
                        window.alert('Not authenticated. Cannot save profile.')
                        return
                      }
                      const updates = {}
                      if (profile.name && profile.name.trim()) updates.name = profile.name.trim()
                      if (profile.email && profile.email.trim()) updates.email = profile.email.trim()
                      if (profile.location && profile.location.trim()) updates.location = profile.location.trim()
                      if (profile.favoriteOffice && profile.favoriteOffice.trim()) updates.favoriteOffice = profile.favoriteOffice.trim()
                      if (Object.keys(updates).length === 0) {
                        window.alert('No changes to save')
                        return
                      }
                      const res = await fetch('/api/users/me', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify(updates)
                      })
                      if (!res.ok) {
                        const txt = await res.text()
                        throw new Error(txt || 'Failed to save profile')
                      }
                      const body = await res.json()
                      if (body && body.user) {
                        const u = body.user
                        setUser(u)
                        const p = {
                          name: u.name || '',
                          email: u.email || '',
                          location: u.location || '',
                          favoriteOffice: u.favoriteOffice || ''
                        }
                        setOriginalProfile(p)
                        setProfile({ name: '', email: '', password: '', location: '', favoriteOffice: '' })
                        window.alert('Profile saved')
                        return
                      }
                    } catch (err) {
                      console.error('Failed saving profile', err)
                      window.alert('Could not save profile')
                    }
                  }}>
                  
                  <div className="text-gray-600 text-sm mt-2 mb-1">
                    <label className="block text-sm mb-1 text-gray-500">Full name</label>
                    <div className="relative">
                      <input id="profile-name" className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        type="text"
                        placeholder={originalProfile?.name || user?.name || ''} />
                      <button type="button" aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-600 text-sm mt-2 mb-1">
                    <label className="block text-sm mb-1 text-gray-500">Email</label>
                    <div className="relative">
                      <input id="profile-email" className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        type="email"
                        placeholder={originalProfile?.email || user?.email || ''} />
                      <button type="button" aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-500">Location</label>
                    <div className="relative">
                      <input id="profile-location" className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900" value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder={originalProfile?.location || ''} />
                      <button type="button" aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-500">Favorite office / workstation</label>
                    <div className="relative">
                      <input id="profile-favoriteOffice" className="w-full p-2 pr-10 border border-gray-300 rounded bg-white text-gray-900" value={profile.favoriteOffice}
                        onChange={(e) => setProfile(prev => ({ ...prev, favoriteOffice: e.target.value }))}
                        placeholder={originalProfile?.favoriteOffice || ''} />
                      <button type="button" aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 p-1">
                        <FiEdit2 />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 rounded bg-gray-700 text-white">Save</button>
                  </div>
                </form>
            </div>

            <div className="flex flex-row md:flex-row justify-end gap-3 mt-4">

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
