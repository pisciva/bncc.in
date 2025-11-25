'use client'

import { useRef, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import validator from 'validator'
import ShowMore from './comp/ShowMore'
import FormInput from './comp/FormInput'
import QrCustomizer from './comp/QrCustomizer'
import ProtectedCode from './comp/ProtectedCode'
import ExpirationDate from './comp/ExpirationDate'
import ToggleMoreSetting from './comp/ToggleMoreSetting'

type Errors = {
    originalUrl: string
    customUrl: string
    title: string
    code: string
    expirationDate: string
}

type ShortenFormProps = { onSuccess?: (data: any) => void }

export default function ShortenLink({ onSuccess }: ShortenFormProps) {
    const { user, token } = useAuth()
    const [title, setTitle] = useState('')
    const [originalUrl, setOriginalUrl] = useState('')
    const [customUrl, setCustomUrl] = useState('')
    const [showMore, setShowMore] = useState(false)
    const [useTitle, setUseTitle] = useState(false)
    const [useQR, setUseQR] = useState(false)
    const [qrColor, setQrColor] = useState('#000000')
    const [showLogo, setShowLogo] = useState(false)
    const [useCode, setUseCode] = useState(false)
    const [code, setCode] = useState(Array(6).fill(''))
    const [useExpiration, setUseExpiration] = useState(false)
    const [expirationDate, setExpirationDate] = useState('')
    const [shakeCode, setShakeCode] = useState(false)
    const [shakeExpiration, setShakeExpiration] = useState(false)
    const [popupCode, setPopupCode] = useState(false)
    const [popupExpiration, setPopupExpiration] = useState(false)
    const popupCodeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const popupExpirationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [errors, setErrors] = useState<Errors>({
        originalUrl: '',
        customUrl: '',
        title: '',
        code: '',
        expirationDate: ''
    })
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const originalUrlRef = useRef<HTMLDivElement>(null)
    const customUrlRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const codeRef = useRef<HTMLDivElement>(null)
    const expirationRef = useRef<HTMLDivElement>(null)
    const qrValue = `https://bncc.in/${customUrl}`
    const resetForm = () => {
        setOriginalUrl('')
        setCustomUrl('')
        setTitle('')
        setUseCode(false)
        setCode(Array(6).fill(''))
        setUseExpiration(false)
        setExpirationDate('')
        setErrors({
            originalUrl: '',
            customUrl: '',
            title: '',
            code: '',
            expirationDate: ''
        })
        setHasSubmitted(false)
    }

    useEffect(() => {
        if (!showMore) {
            setUseTitle(false)
            setUseQR(false)
            setUseCode(false)
            setUseExpiration(false)
        }
    }, [showMore])

    useEffect(() => {
        if (!hasSubmitted) return
        if (originalUrl && validator.isURL(originalUrl, { require_protocol: false })) setErrors(prev => ({ ...prev, originalUrl: '' }))
    }, [originalUrl, hasSubmitted])

    useEffect(() => {
        if (!hasSubmitted) return
        if (customUrl && customUrl.trim().length >= 4) setErrors(prev => ({ ...prev, customUrl: '' }))
    }, [customUrl, hasSubmitted])

    useEffect(() => {
        if (!hasSubmitted) return
        if (useTitle && title) setErrors(prev => ({ ...prev, title: '' }))
    }, [title, useTitle, hasSubmitted])

    useEffect(() => {
        if (!hasSubmitted) return
        if (useCode && code.every(c => c !== '')) setErrors(prev => ({ ...prev, code: '' }))
    }, [code, useCode, hasSubmitted])

    useEffect(() => {
        if (!hasSubmitted) return
        if (useExpiration && expirationDate) setErrors(prev => ({ ...prev, expirationDate: '' }))
    }, [expirationDate, useExpiration, hasSubmitted])

    const scrollToFirstError = (errorObj: Errors) => {
        const errorFields = [
            { key: 'originalUrl', ref: originalUrlRef },
            { key: 'customUrl', ref: customUrlRef },
            { key: 'title', ref: titleRef },
            { key: 'code', ref: codeRef },
            { key: 'expirationDate', ref: expirationRef },
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

    const lockPopUp = (feature: 'code' | 'expiration') => {
        if (!user) {
            if (feature === 'code') {
                setShakeCode(true)
                setPopupCode(true)
                setTimeout(() => setShakeCode(false), 500)

                if (popupCodeTimeoutRef.current) clearTimeout(popupCodeTimeoutRef.current)

                popupCodeTimeoutRef.current = setTimeout(() => {
                    setPopupCode(false)
                }, 7000)
            }

            if (feature === 'expiration') {
                setShakeExpiration(true)
                setPopupExpiration(true)
                setTimeout(() => setShakeExpiration(false), 500)

                if (popupExpirationTimeoutRef.current) {
                    clearTimeout(popupExpirationTimeoutRef.current)
                }

                popupExpirationTimeoutRef.current = setTimeout(() => {
                    setPopupExpiration(false)
                }, 7000)
            }
            return
        }

        if (feature === 'code') setUseCode(!useCode)
        if (feature === 'expiration') setUseExpiration(!useExpiration)
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setHasSubmitted(true)

        const newErrors: Errors = {
            originalUrl: !originalUrl ? "Please enter a link" : !validator.isURL(originalUrl, { require_protocol: false })
                ? "Please enter a valid URL (e.g. bncc.net)" : "",
            customUrl: !customUrl ? "Custom link is required" : customUrl.trim().length < 4
                ? "Custom link is already in use" : "",
            title: useTitle && !title ? "Title is required" : "",
            code: useCode && code.some(c => !c) ? "Code must be 6 digits" : "",
            expirationDate: useExpiration && !expirationDate ? "Expiration date required" : "",
        }

        setErrors(newErrors)

        if (Object.values(newErrors).some(Boolean)) {
            scrollToFirstError(newErrors)
            return
        }

        setErrorMessage("")

        try {
            const res = await fetch("http://localhost:5000/api/links", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    title: user ? title : undefined,
                    originalUrl,
                    customUrl,
                    code: useCode ? code.join("") : undefined,
                    expirationDate: useExpiration ? expirationDate : undefined,
                    qr: {
                        enabled: useQR,
                        qrColor,
                        showLogo,
                    },
                })
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.error?.toLowerCase().includes("custom link")) {
                    setErrors(prev => ({ ...prev, customUrl: data.error }))
                    customUrlRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    })
                } else {
                    setErrorMessage(data.error || "Something went wrong")
                }
                return
            }

            if (onSuccess) {
                onSuccess({
                    type: "shorten",
                    link: data.link,
                    formData: {
                        title,
                        originalUrl,
                        customUrl,
                        qr: useQR ?
                            {
                                color: qrColor,
                                logo: showLogo,
                            } : null,
                        code: useCode ? code.join("") : null,
                        expirationDate: useExpiration ? expirationDate : null
                    },
                })
            }
            resetForm()

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Network error")
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6 w-full">
                <div ref={originalUrlRef}>
                    <FormInput
                        value={originalUrl}
                        onChange={e => setOriginalUrl(e.target.value)}
                        placeholder="Paste your long link here"
                        error={!!errors.originalUrl}
                        errorMessage={errors.originalUrl}
                    />
                </div>

                <div ref={customUrlRef}>
                    <FormInput
                        label="Custom Link"
                        value={customUrl}
                        onChange={e => setCustomUrl(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Custom link"
                        prefix="bncc.in/"
                        error={!!errors.customUrl}
                        errorMessage={errors.customUrl}
                        maxLength={50}
                    />
                </div>

                <ShowMore show={showMore} setShow={setShowMore} />

                {showMore && (
                    <div className='flex flex-col gap-6'>
                        {user && (
                            <div className='flex flex-col gap-3'>
                                <ToggleMoreSetting
                                    label="Link title"
                                    enabled={useTitle}
                                    onToggle={() => setUseTitle(!useTitle)}
                                    infoText="Add a descriptive title to help you organize and identify your shortened links easily."
                                />

                                {useTitle && (
                                    <div ref={titleRef}>
                                        <FormInput
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="Enter a title for your link"
                                            error={!!errors.title}
                                            errorMessage={errors.title}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <ToggleMoreSetting
                                label="Create QR with this link"
                                enabled={useQR}
                                onToggle={() => setUseQR(!useQR)}
                                infoText="Generate a scannable QR code for your shortened link. Customize the color and add a bncc logo."
                            />

                            {useQR && (
                                <QrCustomizer
                                    qrValue={qrValue}
                                    qrColor={qrColor}
                                    setQrColor={setQrColor}
                                    showLogo={showLogo}
                                    setShowLogo={setShowLogo}
                                />
                            )}
                        </div>

                        <div>
                            <ToggleMoreSetting
                                label="Protected Code"
                                enabled={useCode}
                                onToggle={() => lockPopUp('code')}
                                locked
                                showPopup={popupCode}
                                shake={shakeCode}
                                infoText="Add a 6-digit security code to protect your link. Users will need to enter this code before accessing the destination URL."
                            />

                            {useCode && (
                                <div ref={codeRef}>
                                    <ProtectedCode
                                        code={code}
                                        setCode={setCode}
                                        errorMessage={errors.code} />
                                </div>
                            )}
                        </div>

                        <div>
                            <ToggleMoreSetting
                                label="Expiration Access"
                                enabled={useExpiration}
                                onToggle={() => lockPopUp('expiration')}
                                locked
                                showPopup={popupExpiration}
                                shake={shakeExpiration}
                                infoText="Set an expiration date for your link. After this date, the link will no longer be accessible and will redirect to an expired page."
                            />

                            {useExpiration && (
                                <div ref={expirationRef}>
                                    <ExpirationDate
                                        expirationDate={expirationDate}
                                        setExpirationDate={setExpirationDate}
                                        errorMessage={errors.expirationDate} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center">
                    <button type="submit" className="shorten-btn">Shorten</button>
                </div>
            </form>
        </>
    )
}