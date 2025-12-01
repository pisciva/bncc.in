import { useState, useEffect } from 'react'

export const useBlockTimer = (blockUntil: number | null, isBlocked: boolean) => {
    const [remainingTime, setRemainingTime] = useState('')

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)
        return `${hours}h ${minutes}m ${seconds}s`
    }

    useEffect(() => {
        if (!isBlocked || !blockUntil) return

        const interval = setInterval(() => {
            const diff = blockUntil - Date.now()
            if (diff <= 0) {
                window.location.reload()
            } else {
                setRemainingTime(formatTime(diff))
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [isBlocked, blockUntil])

    return remainingTime
}