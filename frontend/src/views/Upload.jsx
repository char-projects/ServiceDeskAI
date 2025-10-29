import React from 'react'
import { FiSend, FiCamera, FiShare2 } from "react-icons/fi";

const NeumorphismButton = () => {
    return (
        <button
            className={`
        px-4 py-2 rounded-full 
        flex items-center gap-2 
        text-slate-500
        shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        
        transition-all

        hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-violet-500
    `}
        >
            <FiSend />
            <span>Hover Me</span>
        </button>
    );
};

function Upload() {
    return (
        <div className="justify-items-center">
            <div className="text-red-500">ServiceDeskAI</div>
            <div className="flex items-center gap-3 text-lg">
                <span>Upload report</span>
                <button
                    type="button"
                    aria-label="Attach photo"
                    className="p-1 rounded hover:bg-white/10"
                >
                    <FiCamera />
                </button>
                <button
                    type="button"
                    aria-label="Share report"
                    className="p-1 rounded hover:bg-white/10"
                >
                    <FiShare2 />
                </button>
            </div>
            <div>Describe the problem</div>
            <div className="min-h-[200px] flex items-center justify-center">
                <NeumorphismButton />
            </div>
        </div>
    )
}

export default Upload
