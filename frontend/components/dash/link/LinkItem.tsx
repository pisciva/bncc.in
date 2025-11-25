"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import LinkViewMode from "./LinkViewMode"
import LinkEditMode from "./LinkEditMode"
import { API_URL } from '@/lib/api'

// Lazy load analytics mode
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
    
    // Form states
    const [title, setTitle] = useState(link.title)
    const [customUrl, setCustomUrl] = useState(link.customUrl)
    const [originalUrl, setOriginalUrl] = useState(link.originalUrl)
    const [code, setCode] = useState<string[]>(link.code ? link.code.split("") : Array(6).fill(""))
    const [expirationDate, setExpirationDate] = useState(link.expirationDate ? new Date(link.expirationDate).toISOString().slice(0, 10) : '')
    const [qrColor, setQrColor] = useState(link.qr?.qrColor || '#000000')
    const [showLogo, setShowLogo] = useState(link.qr?.showLogo || false)

    // Toggle states
    const [useCode, setUseCode] = useState(!!link.code)
    const [useQR, setUseQR] = useState(!!link.qr?.enabled)
    const [useExpiration, setUseExpiration] = useState(!!link.expirationDate)

    // UI states
    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errors, setErrors] = useState<Errors>({
        customUrl: '',
        title: '',
        code: '',
        expirationDate: ''
    })
    const [hasSubmitted, setHasSubmitted] = useState(false)

    // Memoized mode change handler
    const handleModeChange = useCallback((newMode: 'view' | 'edit' | 'analytics') => {
        if (newMode === 'edit' || newMode === 'analytics') {
            onActivate()
        }
        setMode(newMode)
    }, [onActivate])

    // Scroll to card when mode changes
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

    // Reset mode when deactivated
    useEffect(() => {
        if (!isActive && (mode === 'edit' || mode === 'analytics')) {
            setMode('view')
        }
    }, [isActive, mode])

    // Reset form when link changes
    useEffect(() => {
        setTitle(link.title)
        setCustomUrl(link.customUrl)
        setOriginalUrl(link.originalUrl)
        setCode(link.code ? link.code.split("") : Array(6).fill(""))
        setExpirationDate(link.expirationDate ? new Date(link.expirationDate).toISOString().slice(0, 10) : '')
        setUseCode(!!link.code)
        setUseQR(!!link.qr?.enabled)
        setQrColor(link.qr?.qrColor || '#000000')
        setShowLogo(link.qr?.showLogo || false)
        setUseExpiration(!!link.expirationDate)
        setHasSubmitted(false)
        setErrorMessage('')
        setErrors({ customUrl: '', title: '', code: '', expirationDate: '' })
    }, [link._id]) // Only re-run when link ID changes

    const handleSave = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setHasSubmitted(true)

        const newErrors: Errors = {
            customUrl: !customUrl 
                ? "Custom link is required" 
                : customUrl.trim().length < 4 
                ? "Custom link must be at least 4 characters" 
                : "",
            title: !title ? "Title is required" : "",
            code: useCode && code.some(c => !c) ? "Code must be 6 digits" : "",
            expirationDate: useExpiration && !expirationDate ? "Expiration date required" : "",
        }

        setErrors(newErrors)
        if (Object.values(newErrors).some(Boolean)) return

        setErrorMessage("")
        setSaving(true)

        try {
            const res = await fetch(`${API_URL}/api/links/${link._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    title,
                    originalUrl,
                    customUrl,
                    code: useCode ? code.join("") : null,
                    expirationDate: useExpiration ? expirationDate : null,
                    qr: useQR ? { enabled: true, qrColor, showLogo } : { enabled: false, qrColor: '#000000', showLogo: false }
                })
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.error?.toLowerCase().includes("custom link")) {
                    setErrors(prev => ({ ...prev, customUrl: data.error }))
                } else {
                    setErrorMessage(data.error || "Something went wrong")
                }
                setSaving(false)
                return
            }

            onShowToast({ message: "Link updated!", type: "success" })
            onUpdateLink?.(data.link)
            onDeactivate()
            setMode('view')

            // Visual feedback
            setJustUpdated(true)
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
            setTimeout(() => setJustUpdated(false), 1000)

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Network error")
        } finally {
            setSaving(false)
        }
    }, [title, customUrl, originalUrl, code, expirationDate, qrColor, showLogo, useCode, useQR, useExpiration, link._id, token, onShowToast, onUpdateLink, onDeactivate])

    const handleCancelEdit = useCallback(() => {
        setTitle(link.title)
        setCustomUrl(link.customUrl)
        setOriginalUrl(link.originalUrl)
        setCode(link.code ? link.code.split("") : Array(6).fill(""))
        setExpirationDate(link.expirationDate ? new Date(link.expirationDate).toISOString().slice(0, 10) : '')
        setUseCode(!!link.code)
        setUseQR(!!link.qr?.enabled)
        setQrColor(link.qr?.qrColor || '#000000')
        setShowLogo(link.qr?.showLogo || false)
        setUseExpiration(!!link.expirationDate)
        setHasSubmitted(false)
        setErrorMessage('')
        setErrors({ customUrl: '', title: '', code: '', expirationDate: '' })
        onDeactivate()
        setMode('view')
    }, [link, onDeactivate])

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

    return (
        <div ref={cardRef}>
            {mode === 'edit' ? (
                <LinkEditMode
                    link={link}
                    title={title}
                    setTitle={setTitle}
                    originalUrl={originalUrl}
                    customUrl={customUrl}
                    setCustomUrl={setCustomUrl}
                    code={code}
                    setCode={setCode}
                    expirationDate={expirationDate}
                    setExpirationDate={setExpirationDate}
                    qrColor={qrColor}
                    setQrColor={setQrColor}
                    showLogo={showLogo}
                    setShowLogo={setShowLogo}
                    useCode={useCode}
                    setUseCode={setUseCode}
                    useQR={useQR}
                    setUseQR={setUseQR}
                    useExpiration={useExpiration}
                    setUseExpiration={setUseExpiration}
                    errors={errors}
                    errorMessage={errorMessage}
                    saving={saving}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
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

// Memoization with custom comparison
export default React.memo(LinkItem, (prevProps, nextProps) => {
    // Only re-render if these specific props change
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