'use client'

import React, { useState, useRef, useEffect } from 'react'
import LockPopup from './lockPopup'

type ToggleMoreSettingProps = {
    label: string
    enabled: boolean
    onToggle: () => void
    locked?: boolean
    showPopup?: boolean
    shake?: boolean
    infoText?: string
}

export default function ToggleMoreSetting({
    label,
    enabled,
    onToggle,
    locked = false,
    showPopup = false,
    shake = false,
    infoText,
}: ToggleMoreSettingProps) {
    const [showInfo, setShowInfo] = useState(false)
    const infoPopupRef = useRef<HTMLDivElement | null>(null)
    const infoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowInfo(!showInfo)

        if (!showInfo) {
            if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current)
            infoTimeoutRef.current = setTimeout(() => {
                setShowInfo(false)
            }, 5000)
        }
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (infoPopupRef.current && !infoPopupRef.current.contains(event.target as Node)) {
                setShowInfo(false)
            }
        }

        if (showInfo) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current)
        }
    }, [showInfo])

    return (
        <div className="flex items-center justify-between relative">
            <label className="font-semibold text-sm lg:text-base text-[#0054A5]">{label}</label>

            <div className="relative flex items-center gap-3">
                {infoText && (
                    <div className="relative" ref={infoPopupRef}>
                        <button className="w-5 h-5 rounded-full bg-[#0054A5]/10 hover:bg-[#0054A5]/20 flex items-center justify-center cursor-pointer transition-all duration-200 group"
                            type="button"
                            onClick={handleInfoClick}
                            title="More information"
                        >
                            <span className="text-[#0054A5] text-xs font-bold group-hover:scale-110 transition-transform">i</span>
                        </button>

                        {showInfo && (
                            <div className="absolute right-[-14px] top-6 mt-2 w-64 bg-white rounded-xl shadow-31 border border-[#0054A5]/20 p-4 z-50 animate-fadeIn">
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-[#0054A5]/20 transform rotate-45"></div>
                                <p className="text-sm text-[#64748B] leading-relaxed">
                                    {infoText}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative">
                    <button className={`w-12 rounded-full p-1 cursor-pointer transition-transform duration-200 ${enabled ? 'bg-[#0054A5]' : 'bg-[#D7E0E8]'} ${shake ? 'animate-shake' : ''}`}
                        type="button"
                        onClick={onToggle}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transition ${enabled ? 'translate-x-6' : ''}`}/>
                    </button>

                    {locked && (
                        <LockPopup show={showPopup} />
                    )}
                </div>
            </div>
        </div>
    )
}