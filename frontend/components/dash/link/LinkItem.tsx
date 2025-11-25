"use client"

import Link from 'next/link'
import React, { useState, useEffect, useRef } from "react"
import { useAuth } from '@/context/AuthContext'
import LinkViewMode from "./LinkViewMode"
import LinkEditMode from "./LinkEditMode"
import LinkAnalyticsMode from "./LinkAnalyticsMode"
import { API_URL } from '@/lib/api'

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
    const [title, setTitle] = useState(link.title)
    const [customUrl, setCustomUrl] = useState(link.customUrl)
    const [originalUrl, setOriginalUrl] = useState(link.originalUrl)
    const [code, setCode] = useState<string[]>(link.code ? link.code.split("") : Array(6).fill(""))
    const [expirationDate, setExpirationDate] = useState(link.expirationDate ? new Date(link.expirationDate).toISOString().slice(0, 10) : '')
    const [qrColor, setQrColor] = useState(link.qr?.qrColor || '#000000')
    const [showLogo, setShowLogo] = useState(link.qr?.showLogo || false)

    const [useCode, setUseCode] = useState(!!link.code)
    const [useQR, setUseQR] = useState(!!link.qr?.enabled)
    const [useExpiration, setUseExpiration] = useState(!!link.expirationDate)

    const [saving, setSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errors, setErrors] = useState<Errors>({
        customUrl: '',
        title: '',
        code: '',
        expirationDate: ''
    })
    const [hasSubmitted, setHasSubmitted] = useState(false)

    const handleModeChange = (newMode: 'view' | 'edit' | 'analytics') => {
        if (newMode === 'edit' || newMode === 'analytics') {
            onActivate()
        }
        setMode(newMode)
    }

    useEffect(() => {
        if (mode === 'edit' || mode === 'analytics') {
            setTimeout(() => {
                cardRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }, 100)
        }
    }, [mode])

    useEffect(() => {
        if (!isActive && (mode === 'edit' || mode === 'analytics')) {
            setMode('view')
        }
    }, [isActive])

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
    }, [link])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setHasSubmitted(true)

        const newErrors: Errors = {
            customUrl: !customUrl ? "Custom link is required" : customUrl.trim().length < 4 ? "Custom link is already in use" : "",
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
            setSaving(false)
            onDeactivate()
            setMode('view')
            onUpdateLink?.(data.link)

            setJustUpdated(true)
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 100)
            setTimeout(() => setJustUpdated(false), 1000)

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Network error")
            setSaving(false)
        }
    }

    const handleCancelEdit = () => {
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
    }

    const handleCloseAnalytics = () => {
        onDeactivate()
        setMode('view')
    }

    const handleCopyShortenLink = () => {
        const linkToCopy = link.shortenLink.startsWith("http") ? link.shortenLink : `https://${link.shortenLink}`
        navigator.clipboard
            .writeText(linkToCopy)
            .then(() => onShowToast({ message: "Link grabbed!", type: "success" }))
            .catch(() => onShowToast({ message: "Failed to copy link", type: "error" }))
    }

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

export default LinkItem