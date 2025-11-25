'use client'

import React from "react"
import { QrCode } from "lucide-react"

type Mode = 'shorten' | 'qr'

interface ToggleButtonProps {
    mode: Mode
    setMode: (mode: Mode) => void
}

export default function ToggleButton({ mode, setMode }: ToggleButtonProps) {
    const modes: { key: Mode; label: string; icon: React.ReactNode }[] = [
        {
            key: 'shorten',
            label: 'Shorten Link',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={`w-5 h-5 ${mode === 'qr' ? 'fill-white' : 'fill-[#0054A5]'}`} >
                    <path d="M12.4892 10.375L15.9035 6.96075C17.1608 5.70337 17.2028 3.7075 15.9971 2.50262C14.7922 1.29687 12.7964 1.33887 11.539 2.59625L8.12473 6.0105M9.87473 12.9667L6.46923 16.3617C5.21623 17.613 3.28423 17.7749 2.02248 16.4554C0.760726 15.1367 0.862226 13.2712 2.1161 12.0209L5.5216 8.625M6.37473 12.125L11.6247 6.875"
                        stroke="currentColor"
                        strokeWidth="1.34615"
                        strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            )
        },
        {
            key: 'qr',
            label: 'QR Generate',
            icon: (
                <QrCode
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${mode === 'qr' ? 'text-white' : 'text-[#0054A5]'
                        }`}
                />
            )
        }

    ]

    return (
        <div className="relative flex bg-white/20 backdrop-blur-xl shadow-7 border border-white/30 rounded-full p-1.5 lg:p-2 w-fit">
            <div
                className={`absolute top-1.5 bottom-1.5 lg:top-2 lg:bottom-2 left-1.5 lg:left-2 rounded-full bg-gradient-to-br from-[#0054A5] to-[#003d7a] shadow-26 transition-all duration-500 ease-out`}
                style={{
                    width: 'calc(50% - 6px)',
                    transform: mode === 'shorten' ? 'translateX(0%)' : 'translateX(calc(99%)'
                }}
            />

            <div className="relative flex w-full">
                {modes.map(({ key, label, icon }) => (
                    <button
                        key={key}
                        onClick={() => setMode(key)}
                        className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-full text-xs lg:text-base font-medium transition-all duration-500 ease-outrelative z-10 w-32 lg:w-40 justify-center cursor-pointer
                            ${mode === key
                                ? 'text-white scale-[1.02]'
                                : 'text-[#0054A5] hover:bg-white/10'
                            }
                        `}
                    >
                        {icon}
                        <span className="hidden sm:inline">{label}</span>
                        <span className="sm:hidden">{key === 'shorten' ? 'Shorten' : 'QR'}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}