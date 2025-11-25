'use client'

import React from 'react'
import '@/components/main/forms.css'

type LockPopupProps = {
    show: boolean
    message?: string
    className?: string
}

export default function LockPopup({ show, message = 'Sign in to unlock this feature 🚀', className = '' }: LockPopupProps) {
    return (
        <div className={`popup-bubble ${show ? 'show' : ''} ${className}`}>
            {message}
            <div className="popup-tail"></div>
        </div>
    )
}
