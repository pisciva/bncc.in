"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import LinkViewMode from "./LinkViewMode"
import LinkEditMode from "./LinkEditMode"
import { API_URL } from '@/lib/api'

const LinkAnalyticsMode = dynamic(() => import('./LinkAnalyticsMode'), {
    loading: () => (
        <div className="bg-white/10 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-lg">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-300/20 rounded w-1/3"></div>
                <div className="h-64 bg-gray-300/20 rounded"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-gray-300/20 rounded"></div>
                    <div className="h-20 bg-gray-300/20 rounded"></div>
                    <div className="h-20 bg-gray-300/20 rounded"></div>
                </div>
            </div>
        </div>
    ),
    ssr: false
})

export interface LinkCard {
    _id: string
    userId: string
    title: string
    originalUrl: string
    customUrl: string
    shortenLink: string
    qr: {
        enabled: boolean
        qrColor: string
        showLogo: boolean
    }
    code: string
    expirationDate: Date
    createdAt: string
}

interface LinkItemProps {
    link: LinkCard
    isActive: boolean
    onUpdateLink?: (updatedLink: LinkCard) => void
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
    onActivate: () => void
    onDeactivate: () => void
}

export type Errors = {
    title: string
    customUrl: string
    code: string
    expirationDate: string
}

const LinkItem: React.FC<LinkItemProps> = ({
    link,
    isActive,
    onUpdateLink,
    onShowToast,
    onActivate,
    onDeactivate
}) => {
    const { token } = useAuth()
    const [mode, setMode] = useState<'view' | 'edit' | 'analytics'>('view')
    const [justUpdated, setJustUpdated] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    const handleModeChange = useCallback((newMode: 'view' | 'edit' | 'analytics') => {
        if (newMode === 'edit' || newMode === 'analytics') {
            onActivate()
        }
        setMode(newMode)
    }, [onActivate])

    useEffect(() => {
        if (mode === 'edit' || mode === 'analytics') {
            const timer = setTimeout(() => {
                cardRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [mode])

    useEffect(() => {
        if (!isActive && (mode === 'edit' || mode === 'analytics')) {
            setMode('view')
        }
    }, [isActive, mode])

    const handleCloseEdit = useCallback(() => {
        onDeactivate()
        setMode('view')
    }, [onDeactivate])

    const handleCloseAnalytics = useCallback(() => {
        onDeactivate()
        setMode('view')
    }, [onDeactivate])

    const handleCopyShortenLink = useCallback(() => {
        const linkToCopy = link.shortenLink.startsWith("http")
            ? link.shortenLink
            : `https://${link.shortenLink}`

        navigator.clipboard
            .writeText(linkToCopy)
            .then(() => onShowToast({ message: "Link grabbed!", type: "success" }))
            .catch(() => onShowToast({ message: "Failed to copy link", type: "error" }))
    }, [link.shortenLink, onShowToast])

    const handleUpdateSuccess = useCallback(() => {
        setJustUpdated(true)
        setTimeout(() => {
            cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
        setTimeout(() => setJustUpdated(false), 1000)
    }, [])

    return (
        <div ref={cardRef}>
            {mode === 'edit' ? (
                <LinkEditMode
                    link={link}
                    token={token}
                    onClose={handleCloseEdit}
                    onUpdateLink={onUpdateLink}
                    onShowToast={onShowToast}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            ) : mode === 'analytics' ? (
                <LinkAnalyticsMode
                    link={link}
                    linkId={link._id}
                    token={token}
                    onClose={handleCloseAnalytics}
                />
            ) : (
                <LinkViewMode
                    link={link}
                    justUpdated={justUpdated}
                    onEdit={() => handleModeChange('edit')}
                    onViewAnalytics={() => handleModeChange('analytics')}
                    onCopy={handleCopyShortenLink}
                    onShowToast={onShowToast}
                />
            )}
        </div>
    )
}

export default React.memo(LinkItem, (prevProps, nextProps) => {
    return (
        prevProps.link._id === nextProps.link._id &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.link.title === nextProps.link.title &&
        prevProps.link.customUrl === nextProps.link.customUrl &&
        prevProps.link.code === nextProps.link.code &&
        prevProps.link.expirationDate === nextProps.link.expirationDate &&
        prevProps.link.qr?.qrColor === nextProps.link.qr?.qrColor &&
        prevProps.link.qr?.showLogo === nextProps.link.qr?.showLogo
    )
})

LinkItem.displayName = 'LinkItem'