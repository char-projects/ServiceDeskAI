import React, { useState, useEffect } from 'react'
import { FiSearch, FiPlus, FiMapPin, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function Report() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [openExpanded, setOpenExpanded] = useState(true)
  const [closedExpanded, setClosedExpanded] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleDocClick() {
      setActiveMenu(null)
    }
    function handleKey(e) {
      if (e.key === 'Escape') setActiveMenu(null)
    }
    document.addEventListener('click', handleDocClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleDocClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  useEffect(() => {
    async function fetchTickets() {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        setLoading(true)
        const res = await fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        const normalized = data.map(t => ({ id: t._id || t.id, ...t }))
        setReports(normalized)
      } catch (e) {
        console.warn('Failed to fetch tickets', e)
        setError(e.message || 'Could not fetch tickets')
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const openReports = reports.filter(r => r.status !== 'Resolved')
  const closedReports = reports.filter(r => r.status === 'Resolved')

  return (
    <>
      <div className="container justify-center mx-auto max-w-5xl px-4 pt-4 h-screen flex flex-col overflow-hidden pb-32 md:pb-24">
          <div className="text-center">
            <div className="font-bold text-3xl">ServiceDeskAI</div>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-2 flex-1">
            <div className="p-4 flex flex-col">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Preferred office, location"
                    className="w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 text-white transform -translate-y-1/2 pointer-events-none">
                    <FiMapPin />
                  </div>
                </div>
              </div>

              <div className="flex items-center text-2xl justify-between mb-2">
                <div className="font-semibold">Report list</div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded">
                    <FiSearch />
                  </button>
                  <button onClick={() => navigate('/')} className="p-2 rounded text-3xl">
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="rounded-xl space-y-4 flex-1 overflow-auto">
                <div className="">
                  <button
                    onClick={() => setOpenExpanded(v => !v)}
                    className="w-full flex items-center justify-between rounded p-3 mb-2"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Open reports</div>
                    </div>
                    <div>{openExpanded ? '▾' : '▸'}</div>
                  </button>

                  {openExpanded && (
                    <div className="space-y-2 mb-4">
                      {openReports.length === 0 && (
                        <div className="text-sm">No open reports</div>
                      )}
                      {openReports.map(r => (
                        <div key={r.id} className="rounded p-3 flex items-center justify-between relative">
                          <div>
                            <div className="font-semibold">{r.title}</div>
                            <div className="text-sm">{r.status}</div>
                          </div>

                          <div className="ml-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === r.id ? null : r.id) }}
                              aria-haspopup="true"
                              aria-expanded={activeMenu === r.id}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <FiMoreVertical />
                            </button>

                            {activeMenu === r.id && (
                              <div onClick={(e) => e.stopPropagation()} className="absolute right-3 top-full mt-2 w-72 bg-white rounded shadow-lg p-3 text-sm z-20">
                                <div className="font-semibold mb-1">{r.title}</div>
                                {r.description && <div className="text-gray-700 text-sm mb-1">{r.description}</div>}
                                {r.reporter && (
                                  <div className="text-gray-600 text-sm mb-1">Reporter: <span className="font-medium">{r.reporter.name || r.reporter}</span>{r.reporter.email ? ` (${r.reporter.email})` : ''}</div>
                                )}
                                {r.office && <div className="text-gray-600 text-sm">Office: <span className="font-medium">{r.office}</span></div>}
                                <div className="text-gray-600 text-sm">Status: <span className="font-medium">{r.status}</span></div>
                                {r.media && r.media.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-gray-600 text-xs mb-1">Media:</div>
                                    <div className="flex gap-2">
                                      {r.media.map((m, i) => (
                                        <a key={i} href={m} target="_blank" rel="noreferrer" className="block w-16 h-16 rounded overflow-hidden">
                                          <img src={m} alt={`media-${i}`} className="object-cover w-full h-full" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {r.location && (r.location.lat || r.location.lng) && (
                                  <div className="text-gray-600 text-sm mt-2">Location: <span className="font-medium">{r.location.lat}, {r.location.lng}</span></div>
                                )}
                                {r.createdAt && <div className="text-gray-500 text-xs mt-2">Created: {new Date(r.createdAt).toLocaleString()}</div>}
                                {r.updatedAt && <div className="text-gray-500 text-xs">Updated: {new Date(r.updatedAt).toLocaleString()}</div>}
                                <div className="mt-3 flex gap-2">
                                  <button onClick={() => { setSelectedTicket(r); setActiveMenu(null) }} className="px-3 py-1 bg-gray-200 rounded text-sm">View details</button>
                                  <a href={r.media && r.media[0]} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-100 rounded text-sm">Open media</a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="">
                  <button
                    onClick={() => setClosedExpanded(v => !v)}
                    className="w-full flex items-center justify-between rounded p-3 mb-2"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Closed reports</div>
                    </div>
                    <div className="text-white">{closedExpanded ? '▾' : '▸'}</div>
                  </button>

                  {closedExpanded && (
                    <div className="space-y-2">
                      {closedReports.length === 0 && (
                        <div className="text-sm text-white">No closed reports</div>
                      )}
                      {closedReports.map(r => (
                        <div key={r.id} className="text-white rounded p-3 flex items-center justify-between relative">
                          <div>
                            <div className="font-semibold">{r.title}</div>
                            <div className="text-sm">{r.status}</div>
                          </div>

                          <div className="ml-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === r.id ? null : r.id) }}
                              aria-haspopup="true"
                              aria-expanded={activeMenu === r.id}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <FiMoreVertical />
                            </button>

                            {activeMenu === r.id && (
                              <div onClick={(e) => e.stopPropagation()} className="absolute right-3 top-full mt-2 w-72 bg-white rounded shadow-lg p-3 text-sm z-20">
                                <div className="font-semibold mb-1">{r.title}</div>
                                {r.description && <div className="text-gray-700 text-sm mb-1">{r.description}</div>}
                                {r.reporter && (
                                  <div className="text-gray-600 text-sm mb-1">Reporter: <span className="font-medium">{r.reporter.name || r.reporter}</span>{r.reporter.email ? ` (${r.reporter.email})` : ''}</div>
                                )}
                                {r.office && <div className="text-gray-600 text-sm">Office: <span className="font-medium">{r.office}</span></div>}
                                <div className="text-gray-600 text-sm">Status: <span className="font-medium">{r.status}</span></div>
                                {r.media && r.media.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-gray-600 text-xs mb-1">Media:</div>
                                    <div className="flex gap-2">
                                      {r.media.map((m, i) => (
                                        <a key={i} href={m} target="_blank" rel="noreferrer" className="block w-16 h-16 rounded overflow-hidden">
                                          <img src={m} alt={`media-${i}`} className="object-cover w-full h-full" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {r.location && (r.location.lat || r.location.lng) && (
                                  <div className="text-gray-600 text-sm mt-2">Location: <span className="font-medium">{r.location.lat}, {r.location.lng}</span></div>
                                )}
                                {r.createdAt && <div className="text-gray-500 text-xs mt-2">Created: {new Date(r.createdAt).toLocaleString()}</div>}
                                {r.updatedAt && <div className="text-gray-500 text-xs">Updated: {new Date(r.updatedAt).toLocaleString()}</div>}
                                <div className="mt-3 flex gap-2">
                                  <button onClick={() => { setSelectedTicket(r); setActiveMenu(null) }} className="px-3 py-1 bg-gray-200 rounded text-sm">View details</button>
                                  <a href={r.media && r.media[0]} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-100 rounded text-sm">Open media</a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {selectedTicket && (
          <div onClick={() => setSelectedTicket(null)} className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <div onClick={(e) => e.stopPropagation()} className="bg-white text-gray-900 rounded-lg w-full max-w-2xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-lg">{selectedTicket.title}</div>
                  <div className="text-sm text-gray-600">{selectedTicket.office ? selectedTicket.office : ''} {selectedTicket.reporter?.name ? `• ${selectedTicket.reporter.name}` : ''}</div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-gray-600">✕</button>
              </div>

              {selectedTicket.media && selectedTicket.media.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {selectedTicket.media.map((m, i) => (
                    <a key={i} href={m} target="_blank" rel="noreferrer" className="block w-full h-28 rounded overflow-hidden">
                      <img src={m} alt={`media-${i}`} className="object-cover w-full h-full" />
                    </a>
                  ))}
                </div>
              )}

              {selectedTicket.description && (
                <div className="mt-3 text-sm text-gray-700">{selectedTicket.description}</div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {selectedTicket.createdAt && <div>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</div>}
                  {selectedTicket.updatedAt && <div>Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => alert('Assign action (not implemented)')} className="px-3 py-1 bg-yellow-200 rounded">Assign</button>
                  <button onClick={() => alert('Close action (not implemented)')} className="px-3 py-1 bg-red-200 rounded">Close</button>
                  <button onClick={() => alert('Comment action (not implemented)')} className="px-3 py-1 bg-gray-200 rounded">Comment</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default Report
