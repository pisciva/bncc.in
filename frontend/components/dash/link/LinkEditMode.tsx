"use client"

import Link from 'next/link'
import React, { useState, useEffect, useRef } from "react"
import FormInput from "@/components/main/comp/FormInput"
import ToggleMoreSetting from "@/components/main/comp/ToggleMoreSetting"
import ProtectedCode from "@/components/main/comp/ProtectedCode"
import ExpirationDate from "@/components/main/comp/ExpirationDate"
import QrCustomizer from "@/components/main/comp/QrCustomizer"
import { Edit, X, Save, RotateCcw } from 'lucide-react'
import { LinkCard, Errors } from "./LinkItem"
import { API_URL } from '@/lib/api'

interface LinkEditModeProps {
    link: LinkCard
    token: string | null
    onClose: () => void
    onUpdateLink?: (updatedLink: LinkCard) => void
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
    onUpdateSuccess: () => void
}

const LinkEditMode: React.FC<LinkEditModeProps> = ({
    link,
    token,
    onClose,
    onUpdateLink,
    onShowToast,
    onUpdateSuccess
}) => {
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

    const titleRef = useRef<HTMLDivElement>(null)
    const customUrlRef = useRef<HTMLDivElement>(null)
    const codeRef = useRef<HTMLDivElement>(null)
    const expirationRef = useRef<HTMLDivElement>(null)

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
    }, [link._id])

    const handleReset = () => {
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
    }

    const handleSave = async (e: React.FormEvent) => {
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
            onClose()
            onUpdateSuccess()

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Network error")
        } finally {
            setSaving(false)
        }
    }

    const qrValue = `https://bncc.in/${customUrl}`

    return (
        <li className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7">
            <div className="rounded-t-2xl bg-gradient-to-r from-[#0054A5] to-[#003d7a] px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Link
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
                        title="Reset changes"
                    >
                        <RotateCcw className="w-5 h-5 cursor-pointer" />
                    </button>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
                    >
                        <X className="w-5 h-5 cursor-pointer" />
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col xl:flex-row gap-6">
                <div className="flex-1 xl:w-[60%] space-y-4">
                    <div ref={titleRef}>
                        <FormInput
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter link title"
                            error={!!errors.title}
                            errorMessage={errors.title}
                        />
                    </div>

                    <div className="w-full">
                        <label className="font-semibold text-sm lg:text-base text-[#0054A5] block mb-2">
                            Original Link
                        </label>
                        <input
                            type="text"
                            value={originalUrl}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-[#D3D3D3] shadow-5 text-[#64748B] font-medium placeholder:text-gray-400 cursor-not-allowed opacity-60"
                        />
                        <p className="text-xs text-[#64748B] mt-2 italic">Original link cannot be edited</p>
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

                    <div ref={codeRef}>
                        <ToggleMoreSetting
                            label="Protected Code"
                            enabled={useCode}
                            onToggle={() => setUseCode(!useCode)}
                        />

                        {useCode && (
                            <ProtectedCode
                                code={code}
                                setCode={setCode}
                                errorMessage={errors.code}
                            />
                        )}
                    </div>
                </div>

                <div className="flex-1 xl:w-[40%] space-y-6">
                    <div ref={expirationRef}>
                        <ToggleMoreSetting
                            label="Expiration Access"
                            enabled={useExpiration}
                            onToggle={() => setUseExpiration(!useExpiration)}
                        />

                        {useExpiration && (
                            <ExpirationDate
                                expirationDate={expirationDate}
                                setExpirationDate={setExpirationDate}
                                errorMessage={errors.expirationDate}
                            />
                        )}
                    </div>

                    <div>
                        <ToggleMoreSetting
                            label="Create QR with this link"
                            enabled={useQR}
                            onToggle={() => setUseQR(!useQR)}
                        />

                        {useQR && (
                            <QrCustomizer
                                qrValue={qrValue}
                                qrColor={qrColor}
                                setQrColor={setQrColor}
                                showLogo={showLogo}
                                setShowLogo={setShowLogo}
                                size={160}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-6 lg:flex items-end justify-between">
                <div className="flex-1">
                    {errorMessage && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 animate-slideDown inline-block">
                            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 sm:gap-3 ml-auto">
                    <button onClick={onClose} className="cursor-pointer flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-white/10 backdrop-blur-xl border border-[#D3D3D3] rounded-full text-[#0054A5] font-semibold hover:bg-white/20 transition-all duration-300">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="cursor-pointer flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#0054A5] to-[#003d7a] rounded-full text-white font-semibold hover:shadow-3 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </li>
    )
}

export default LinkEditMode