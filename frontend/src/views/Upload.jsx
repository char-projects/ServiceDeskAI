import React, { useRef, useState, useEffect } from 'react'
import { FiSend, FiCamera, FiShare, FiShare2, FiMap } from "react-icons/fi";

function Upload() {
    const fileInputRef = useRef(null)
    const cameraInputRef = useRef(null)
    const [image, setImage] = useState({ url: '/default.jpg', isDefault: true })
    const [analysis, setAnalysis] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        return () => {
            if (image && image.url) URL.revokeObjectURL(image.url)
        }
    }, [image])

    const openFilePicker = () => fileInputRef.current && fileInputRef.current.click()
    const openCameraPicker = () => cameraInputRef.current && cameraInputRef.current.click()

    const onSelectFile = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        if (image && image.url && !image.isDefault) URL.revokeObjectURL(image.url)
        const url = URL.createObjectURL(file)
        setImage({ file, url, isDefault: false })
    }

    const clearImage = () => {
        if (image && image.url && !image.isDefault) URL.revokeObjectURL(image.url)
        setImage({ url: '/default.jpg', isDefault: true })
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (cameraInputRef.current) cameraInputRef.current.value = ''
    }

    return (
    <div className="container mx-auto px-4 pt-4 h-screen flex flex-col overflow-hidden pb-32 md:pb-24">
            <div className="text-center">
                <div className="font-bold text-3xl">ServiceDeskAI</div>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 flex-1">
                <div className="p-4 flex flex-col">
                    <div className="flex items-center justify-between md:justify-start gap-3 mb-3">
                        <span className="text-lg font-bold">Upload report</span>
                        <div className="flex items-center gap-2 ml-2">
                            <button onClick={openCameraPicker} className="mr-2 p-2 rounded text-gray-700 bg-gray-400 hover:bg-gray-500" aria-label="Attach photo">
                                <FiCamera />
                            </button>
                            <button onClick={openFilePicker} className="p-2 rounded text-gray-700 bg-white hover:bg-gray-300" aria-label="Share report">
                                <FiShare />
                            </button>
                        </div>
                    </div>

                    <div className="border border-white rounded-xl p-2 flex-1 flex items-center justify-center">
                    <div className="aspect-square flex items-center justify-center bg-transparent mx-auto relative overflow-hidden rounded-md"
                        style={{ width: 'min(100%, 40vh)' }}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onSelectFile}
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={onSelectFile}
                    />

                                {image ? (
                                    <>
                                        <img src={image.url} alt="preview" className="absolute inset-0 w-full h-full object-cover object-center" />
                                        {!image.isDefault && (
                                            <button
                                                onClick={clearImage}
                                                aria-label="Remove image"
                                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2"></div>
                                )}
                    </div>
                </div>
            </div>

                <div className="p-4 flex flex-col">
                    <div className="rounded-xl p-4 space-y-2 bg-gray-300 flex-1 flex flex-col">
                        <div className="text-gray-700 text-sm">Describe the problem</div>
                        <textarea
                            className="bg-white border border-gray-500 rounded w-full text-gray-900 p-2 resize-none flex-1 min-h-[120px]"
                            placeholder="the door that leads to the conference room is broken, it doesn't close."
                        />

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded text-gray-600 border-2 border-gray-600" aria-label="Add location">
                                    <FiMap />
                                </button>
                                <button className="p-2 rounded text-gray-600 border-2 border-gray-600" aria-label="Share">
                                    <FiShare2 />
                                </button>
                            </div>

                            <div className="flex items-center">
                                <button onClick={async () => {
                                    if (!image || image.isDefault) return alert('Please choose an image first')
                                    try {
                                        setIsLoading(true)
                                        setAnalysis(null)

                                        const form = new FormData()
                                        form.append('image', image.file)

                                        const token = localStorage.getItem('token')

                                        const res = await fetch('/api/interrogate/analyze', {
                                            method: 'POST',
                                            body: form,
                                            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
                                        })
                                        if (!res.ok) {
                                            const err = await res.json().catch(() => ({}))
                                            throw new Error(err.error || 'Upload failed')
                                        }

                                        const data = await res.json()
                                        setAnalysis(data)
                                    } catch (e) {
                                        console.error(e)
                                        alert(e.message || 'Upload failed')
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }} className="px-4 py-2 rounded flex items-center gap-2 text-white shadow-md hover:bg-gray-700 bg-gray-600">
                                    <span>{isLoading ? 'Analyzing...' : 'Send'}</span>
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </div>
                    {analysis && (
                        <div className="mt-4 p-3 rounded border">
                            <div className="font-semibold mb-2">Analysis result</div>
                            <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(analysis, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Upload
