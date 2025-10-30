import React from 'react'
import { FiCamera, FiUser } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate()

    return (
        <div className="fixed bottom-0 left-0 right-0 pb-4">
            <div className="flex justify-center gap-14 md:gap-28 max-w-screen-md mx-auto">
                <button onClick={() => navigate('/report')} className="flex flex-col items-center text-sm text-white hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
                    </svg>
                    <span>Report</span>
                </button>

                <button onClick={() => navigate('/')} className="flex flex-col items-center text-sm text-white hover:text-gray-300">
                    <FiCamera className="w-6 h-6 mb-1" aria-hidden="true" />
                    <span>Upload</span>
                </button>

                <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-white hover:text-gray-300">
                    <FiUser className="w-6 h-6 mb-1" aria-hidden="true" />
                    <span>Profile</span>
                </button>
            </div>
        </div>
    )
}

export default NavBar