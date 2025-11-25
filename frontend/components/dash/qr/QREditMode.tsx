"use client"

import React, { useRef } from "react"
import FormInput from "@/components/main/comp/FormInput"
import QrCustomizer from "@/components/main/comp/QrCustomizer"
import { Edit, X, Save } from 'lucide-react'
import { QRType } from "./QR"

interface QREditModeProps {
    qr: QRType
    title: string
    setTitle: (value: string) => void
    originalUrl: string
    qrColor: string
    setQrColor: (value: string) => void
    showLogo: boolean
    setShowLogo: (value: boolean) => void
    errors: { title: string }
    errorMessage: string
    saving: boolean
    onSave: (e: React.FormEvent) => void
    onCancel: () => void
}

const QREditMode: React.FC<QREditModeProps> = ({
    qr,
    title,
    setTitle,
    originalUrl,
    qrColor,
    setQrColor,
    showLogo,
    setShowLogo,
    errors,
    errorMessage,
    saving,
    onSave,
    onCancel
}) => {
    const titleRef = useRef<HTMLDivElement>(null)

    return (
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7 col-span-1 lg:col-span-2">
            <div className="rounded-t-2xl bg-gradient-to-r from-[#0054A5] to-[#003d7a] px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit QR Code
                </div>
                <button
                    onClick={onCancel}
                    className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
                >
                    <X className="w-5 h-5 cursor-pointer" />
                </button>
            </div>

            <div className="p-4 sm:p-5 flex flex-col lg:flex-row sm:gap-6">
                <div className="flex-1 space-y-4">
                    <div ref={titleRef}>
                        <FormInput
                            label="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter QR title"
                            error={!!errors.title}
                            errorMessage={errors.title}
                        />
                    </div>

                    <div className="w-full">
                        <label className="font-semibold text-sm lg:text-base text-[#0054A5] block mb-2">Original Link</label>
                        <input
                            type="text"
                            value={originalUrl}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-[#D3D3D3] shadow-5 text-[#64748B] font-medium placeholder:text-gray-400 cursor-not-allowed opacity-60"
                        />
                        <p className="text-xs text-[#64748B] mt-2 italic">Original link cannot be edited</p>
                    </div>
                </div>

                <div className="flex-1">
                    <QrCustomizer
                        qrValue={originalUrl}
                        qrColor={qrColor}
                        setQrColor={setQrColor}
                        showLogo={showLogo}
                        setShowLogo={setShowLogo}
                        size={180}
                    />
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

                <div className="flex gap-2 sm:gap-3 ml-auto mt-4 lg:mt-0">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer flex-1 sm:flex-none px-4 sm:px-6 py-2.5 bg-white/10 backdrop-blur-xl border border-[#D3D3D3] rounded-full text-[#0054A5] font-semibold hover:bg-white/20 transition-all duration-300"
                    >
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
        </div>
    )
}

export default QREditMode