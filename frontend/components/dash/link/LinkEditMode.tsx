"use client"

import Link from 'next/link'
import React, { useRef } from "react"
import FormInput from "@/components/main/comp/FormInput"
import ToggleMoreSetting from "@/components/main/comp/ToggleMoreSetting"
import ProtectedCode from "@/components/main/comp/ProtectedCode"
import ExpirationDate from "@/components/main/comp/ExpirationDate"
import QrCustomizer from "@/components/main/comp/QrCustomizer"
import { Edit, X, Save } from 'lucide-react'
import { LinkCard, Errors } from "./LinkItem"

interface LinkEditModeProps {
    link: LinkCard
    title: string
    setTitle: (value: string) => void
    originalUrl: string
    customUrl: string
    setCustomUrl: (value: string) => void
    code: string[]
    setCode: React.Dispatch<React.SetStateAction<string[]>>
    expirationDate: string
    setExpirationDate: (value: string) => void
    qrColor: string
    setQrColor: (value: string) => void
    showLogo: boolean
    setShowLogo: (value: boolean) => void
    useCode: boolean
    setUseCode: (value: boolean) => void
    useQR: boolean
    setUseQR: (value: boolean) => void
    useExpiration: boolean
    setUseExpiration: (value: boolean) => void
    errors: Errors
    errorMessage: string
    saving: boolean
    onSave: (e: React.FormEvent) => void
    onCancel: () => void
}

const LinkEditMode: React.FC<LinkEditModeProps> = ({
    link,
    title,
    setTitle,
    originalUrl,
    customUrl,
    setCustomUrl,
    code,
    setCode,
    expirationDate,
    setExpirationDate,
    qrColor,
    setQrColor,
    showLogo,
    setShowLogo,
    useCode,
    setUseCode,
    useQR,
    setUseQR,
    useExpiration,
    setUseExpiration,
    errors,
    errorMessage,
    saving,
    onSave,
    onCancel
}) => {
    const titleRef = useRef<HTMLDivElement>(null)
    const customUrlRef = useRef<HTMLDivElement>(null)
    const codeRef = useRef<HTMLDivElement>(null)
    const expirationRef = useRef<HTMLDivElement>(null)

    const qrValue = `https://bncc.in/${customUrl}`

    return (
        <li className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7">
            <div className="rounded-t-2xl bg-gradient-to-r from-[#0054A5] to-[#003d7a] px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Link
                </div>
                <button
                    onClick={onCancel}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
                >
                    <X className="w-5 h-5 cursor-pointer" />
                </button>
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
                    <button onClick={onCancel} className="cursor-pointer flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-white/10 backdrop-blur-xl border border-[#D3D3D3] rounded-full text-[#0054A5] font-semibold hover:bg-white/20 transition-all duration-300">
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
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