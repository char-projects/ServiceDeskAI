import React from 'react'

function NavBar() {
    return (
        <div className="fixed bottom-0 min-w-screen">
            <div className="flex justify-between mx-32">
                <button>Report</button>
                <button>Upload</button>
                <button>Profile</button>
            </div>
        </div>
    )
}

export default NavBar