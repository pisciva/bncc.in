"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from '@/context/AuthContext'
import QRViewMode from "./QRViewMode"
import QREditMode from "./QREditMode"
import { QRType } from "./QR"
import { API_URL } from '@/lib/api'

interface QRItemProps {
    qr: QRType
    onUpdateQR?: (updatedQR: QRType) => void
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
}

const QRItem: React.FC<QRItemProps> = ({ qr, onUpdateQR, onShowToast }) => {
    const { token } = useAuth()
    const [editing, setEditing] = useState(false)
    const [justUpdated, setJustUpdated] = useState(false)
    const [saving, setSaving] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const [title, setTitle] = useState(qr.title)
    const [originalUrl, setOriginalUrl] = useState(qr.originalUrl)
    const [qrColor, setQrColor] = useState(qr.qrColor || '#000000')
    const [showLogo, setShowLogo] = useState(qr.showLogo || false)
    const [errorMessage, setErrorMessage] = useState('')
    const [errors, setErrors] = useState({ title: '' })
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(() => {
        setTitle(qr.title)
        setOriginalUrl(qr.originalUrl)
        setQrColor(qr.qrColor || '#000000')
        setShowLogo(qr.showLogo || false)
        setHasSubmitted(false)
        setErrorMessage('')
        setErrors({ title: '' })
    }, [qr._id])

    useEffect(() => {
        if (!hasSubmitted) return
        if (title.trim()) {
            setErrors({ title: '' })
        } else {
            setErrors({ title: 'Title is required' })
        }
    }, [title, hasSubmitted])

    const handleSave = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        setHasSubmitted(true)

        if (!title.trim()) {
            setErrors({ title: "Title is required" })
            return
        }

        setErrorMessage("")
        setSaving(true)

        try {
            const res = await fetch(`${API_URL}/api/qrs/${qr._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    title: title.trim(),
                    originalUrl,
                    qrColor,
                    showLogo
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setErrorMessage(data.error || "Something went wrong")
                setSaving(false)
                return
            }

            onShowToast({ message: "QR updated!", type: "success" })
            onUpdateQR?.(data.qr)
            setEditing(false)
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
    }, [title, originalUrl, qrColor, showLogo, qr._id, token, onShowToast, onUpdateQR])

    const handleCancelEdit = useCallback(() => {
        setTitle(qr.title)
        setOriginalUrl(qr.originalUrl)
        setQrColor(qr.qrColor || '#000000')
        setShowLogo(qr.showLogo || false)
        setHasSubmitted(false)
        setErrorMessage('')
        setErrors({ title: '' })
        setEditing(false)
    }, [qr])

    const handleEdit = useCallback(() => {
        setEditing(true)
    }, [])

    return editing ? (
        <QREditMode
            qr={qr}
            title={title}
            setTitle={setTitle}
            originalUrl={originalUrl}
            qrColor={qrColor}
            setQrColor={setQrColor}
            showLogo={showLogo}
            setShowLogo={setShowLogo}
            errors={errors}
            errorMessage={errorMessage}
            saving={saving}
            onSave={handleSave}
            onCancel={handleCancelEdit}
        />
    ) : (
        <QRViewMode
            qr={qr}
            cardRef={cardRef}
            justUpdated={justUpdated}
            onEdit={handleEdit}
            onShowToast={onShowToast}
        />
    )
}

export default React.memo(QRItem, (prevProps, nextProps) => {
    return (
        prevProps.qr._id === nextProps.qr._id &&
        prevProps.qr.title === nextProps.qr.title &&
        prevProps.qr.originalUrl === nextProps.qr.originalUrl &&
        prevProps.qr.qrColor === nextProps.qr.qrColor &&
        prevProps.qr.showLogo === nextProps.qr.showLogo
    )
})

QRItem.displayName = 'QRItem'