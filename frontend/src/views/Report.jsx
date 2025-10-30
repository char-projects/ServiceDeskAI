import React from 'react'

function Report() {
  const reports = [
    { id: 1, title: 'Broken door in Conference Room', status: 'Open', date: '2025-10-28' },
    { id: 2, title: 'Leaky ceiling — 4th Floor', status: 'In progress', date: '2025-10-27' },
    { id: 3, title: 'Projector not working', status: 'Resolved', date: '2025-10-23' },
  ]

  return (
    <div className="container mx-auto px-4 pt-4 h-screen flex flex-col overflow-hidden pb-32 md:pb-24">
      <div className="text-center">
        <div className="font-bold text-3xl">ServiceDeskAI</div>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-2 flex-1">
        <div className="p-4 flex flex-col">
          <div className="text-lg font-bold mb-3">Reports</div>

          <div className="border border-white rounded-xl p-4 flex-1">
            <div className="text-sm text-gray-200 mb-2">Summary</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white text-gray-900 rounded p-3 text-center">Open<br/><strong>1</strong></div>
              <div className="bg-white text-gray-900 rounded p-3 text-center">In progress<br/><strong>1</strong></div>
              <div className="bg-white text-gray-900 rounded p-3 text-center">Resolved<br/><strong>1</strong></div>
              <div className="bg-white text-gray-900 rounded p-3 text-center">Total<br/><strong>{reports.length}</strong></div>
            </div>

            <div className="mt-4">
              <button className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded">New report</button>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col">
          <div className="rounded-xl p-4 space-y-4 bg-gray-200 flex-1 overflow-auto">
            {reports.map(r => (
              <div key={r.id} className="bg-white text-gray-900 rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-600">{r.date}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${r.status === 'Resolved' ? 'bg-green-200' : r.status === 'In progress' ? 'bg-yellow-200' : 'bg-red-200'}`}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report
