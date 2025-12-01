'use client'

import React from 'react'

type ToggleMoreProps = {
    label?: string
    show: boolean
    setShow: (v: boolean) => void
}

export default function ToggleMore({
    label = 'More Settings',
    show,
    setShow,
}: ToggleMoreProps) {
    return (
        <div className="w-full flex items-center justify-center cursor-pointer select-none mt-1 group"
            onClick={() => setShow(!show)}
        >
            <svg className={`w-4 h-4 mr-2 transform transition-transform duration-300 origin-center ${show ? 'rotate-180' : ''}`} viewBox="0 0 24 24" stroke="#0054A5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="6 15 12 9 18 15" />
            </svg>
            <span className="text-[#0054A5] text-sm lg:text-base font-semibold group-hover:underline">
                {label}
            </span>
        </div>
    )
}
