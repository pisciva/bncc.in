'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import validator from 'validator'
import FormInput from './comp/FormInput'
import QrCustomizer from './comp/QrCustomizer'
import ToggleMoreSetting from './comp/ToggleMoreSetting'

type Errors = {
    originalUrl: string
    title: string
}

type ShortenQRProps = { onSuccess: (data: any) => void }

export default function QRForm({ onSuccess }: ShortenQRProps) {
    const { user, token } = useAuth()
    const [title, setTitle] = useState('')
    const [originalUrl, setOriginalUrl] = useState('')
    const [qrColor, setQrColor] = useState('#000000')
    const [showLogo, setShowLogo] = useState(false)
    const [useTitle, setUseTitle] = useState(false)
    const [errors, setErrors] = useState<Errors>({ originalUrl: '', title: '' })
    const [errorMessage, setErrorMessage] = useState('')
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const originalUrlRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const qrValue = (originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`)
    const resetForm = () => {
        setOriginalUrl('')
        setQrColor('#000000')
        setShowLogo(false)
        setTitle('')
        setUseTitle(false)
        setErrors({ originalUrl: '', title: '' })
        setErrorMessage('')
        setHasSubmitted(false)
    }

    useEffect(() => {
        if (!hasSubmitted) return
        if (originalUrl && validator.isURL(originalUrl, { require_protocol: false })) setErrors(prev => ({ ...prev, originalUrl: '' }))
    }, [originalUrl, hasSubmitted])

    useEffect(() => {
        if (!hasSubmitted) return
        if (useTitle && title) setErrors(prev => ({ ...prev, title: '' }))
    }, [title, useTitle, hasSubmitted])

    const scrollToFirstError = (errorObj: Errors) => {
        const errorFields = [
            { key: 'originalUrl', ref: originalUrlRef },
            { key: 'title', ref: titleRef },
        ]

        for (const field of errorFields) {
            if (errorObj[field.key as keyof Errors]) {
                field.ref.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
                break
            }
        }
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setHasSubmitted(true)

        const newErrors: Errors = {
            originalUrl: !originalUrl ? 'Please enter a link' : !validator.isURL(originalUrl, { require_protocol: false })
                ? 'Please enter a valid URL (e.g. bncc.net)' : '',
            title: useTitle && !title ? 'Title is required' : '',
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(Boolean)) {
            scrollToFirstError(newErrors)
            return
        }

        setErrorMessage('')

        try {
            const res = await fetch('http://localhost:5000/api/qrs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    title: user ? title : undefined,
                    originalUrl,
                    qrColor,
                    showLogo,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setErrorMessage(data.error || data.message || 'Something went wrong')
                return
            }

            if (onSuccess) {
                onSuccess({
                    type: 'qr',
                    qrId: data.qr,
                    formData: {
                        title,
                        originalUrl,
                        qr: { color: qrColor, logo: showLogo },
                    },
                })
            }

            resetForm()
        } catch (err: any) {
            setErrorMessage(err.message ?? 'Network error')
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 w-full">
            <div ref={originalUrlRef}>
                <FormInput
                    value={originalUrl}
                    onChange={e => setOriginalUrl(e.target.value)}
                    placeholder="Paste your long link here"
                    error={!!errors.originalUrl}
                    errorMessage={errors.originalUrl}/>
            </div>

            <QrCustomizer
                qrValue={qrValue}
                qrColor={qrColor}
                setQrColor={setQrColor}
                showLogo={showLogo}
                setShowLogo={setShowLogo}/>

            {user && (
                <div className="flex flex-col gap-3">
                    <ToggleMoreSetting
                        label="QR title"
                        enabled={useTitle}
                        onToggle={() => setUseTitle(!useTitle)}
                        infoText="Add a descriptive title to help you organize and identify your QRs easily."/>

                    {useTitle && (
                        <div ref={titleRef}>
                            <FormInput
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter a title for your QR"
                                error={!!errors.title}
                                errorMessage={errors.title}/>
                        </div>
                    )}
                </div>
            )}

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage} </p>}

            <div className="flex items-center justify-center">
                <button type="submit" className="shorten-btn">Generate</button>
            </div>
        </form>
    )
}