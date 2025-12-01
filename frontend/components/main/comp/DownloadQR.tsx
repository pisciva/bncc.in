'use client'

import React, { useState, useEffect, useRef } from 'react'
import { toPng, toSvg, toJpeg } from 'html-to-image'

type DownloadQRProps = {
    qrRef: React.RefObject<HTMLDivElement | null>
    name?: string
    rounded?: string
}

export default function DownloadQR({ qrRef, name = 'qr-code', rounded = "rounded-xl" }: DownloadQRProps) {
    const [open, setOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)

    const handleDownload = async (type: 'png' | 'svg' | 'jpeg') => {
        if (!qrRef.current) return
        try {
            let dataUrl: string
            if (type === 'png') dataUrl = await toPng(qrRef.current, { pixelRatio: 15 })
            else if (type === 'jpeg') dataUrl = await toJpeg(qrRef.current, { quality: 1, pixelRatio: 15 })
            else dataUrl = await toSvg(qrRef.current)

            const a = document.createElement('a')
            a.href = dataUrl
            a.download = `${name.trim().replace(/[^A-z0-9]/gi, '-')}.${type}`
            a.click()
        } catch (err) {
            alert('Failed to download QR code.')
        }
        setOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        if (open) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
        <div className={`relative inline-block z-200 ${rounded}`} ref={popupRef}>

            <button onClick={() => setOpen(!open)}
                title="Download QR"
                className="px-3 py-2 text-white rounded-xl bg-gradient-to-br from-[#0054A5] to-[#003d7a] hover:from-[#06387E] hover:to-[#002952] text-sm cursor-pointer flex items-center gap-2 shadow-[0_4px_12px_0_rgba(0,84,165,0.25)] hover:shadow-[0_6px_16px_0_rgba(0,84,165,0.35)] z-200"
            >
                Download QR
                <svg xmlns="http://www.w3.org/2000/svg" width="12" viewBox="0 0 14 8" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path d="M13 1L7 7L1 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div className={`absolute top-full mt-1 right-0 min-w-full bg-white border border-[#0054A5]/30 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-500 ease-in-out
                ${open ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}
            >
                {['png', 'svg', 'jpeg'].map((type) => (
                    <button className="w-full px-3 py-2 text-sm text-[#0054A5] font-medium hover:font-bold hover:bg-[#EAF3FC] transition-colors text-left cursor-pointer"
                        key={type}
                        title={`Download QR format ${type.toUpperCase()}`}
                        onClick={() => handleDownload(type as 'png' | 'svg' | 'jpeg')}
                    >
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    )
}
