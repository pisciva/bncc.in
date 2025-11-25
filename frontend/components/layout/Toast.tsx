'use client'

import { useEffect, useState } from 'react'

type ToastProps = {
    message: string
    type?: 'success' | 'error' | 'warning'
    onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        setShow(true)

        const timer = setTimeout(() => {
            setShow(false)
            setTimeout(onClose, 400)
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    const bgColor =
        type === 'success'
            ? 'bg-[#10B981]'
            : type === 'error'
                ? 'bg-[#EF4444]'
                : 'bg-[#F59E0B]'

    const iconSrc =
        type === 'success'
            ? '/icon-tick.svg'
            : type === 'error'
                ? '/icon-x.svg'
                : '/icon-time.svg'

    return (
        <div className={`fixed left-1/2 transform -translate-x-1/2 flex items-center gap-2 pl-3 pr-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-500 ease-in-out
            ${bgColor}
            ${show ? 'translate-y-0 opacity-100 top-5' : '-translate-y-10 opacity-0 top-0'}`}
            style={{
                zIndex: 50,
            }}
        >
            <img src={iconSrc} className="mr-1 w-4 h-4" alt="" />
            <span>{message}</span>
        </div>
    )
}
