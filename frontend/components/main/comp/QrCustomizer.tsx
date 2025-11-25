'use client'

import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { HexColorPicker } from "react-colorful"
import BNCCLogo from '../../layout/BNCCLogo'

type QrCustomizerProps = {
    qrValue: string
    qrColor: string
    setQrColor: (color: string) => void
    showLogo: boolean
    setShowLogo: (v: boolean) => void
    size?: number
}

export default function QrCustomizer({
    qrValue,
    qrColor,
    setQrColor,
    showLogo,
    setShowLogo,
    size = 220,
}: QrCustomizerProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false)

    return (
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mt-4">
            <div className="flex flex-col w-full gap-6">
                <div>
                    <h2 className="text-[#64748B] text-sm font-semibold mb-3">QR Code Color</h2>
                    <div className="flex flex-row items-center gap-3">
                        <div className="relative flex">
                            <button
                                type="button"
                                onClick={() => setIsPickerOpen(!isPickerOpen)}
                                className="w-12 h-12 rounded-xl border-white/50 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                                style={{ backgroundColor: qrColor }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            {isPickerOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsPickerOpen(false)} />
                                    <div className="absolute top-14 left-0 z-50 p-4 bg-white rounded-2xl border border-white/50 shadow-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <HexColorPicker color={qrColor} onChange={setQrColor} />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex-1 flex items-center px-4 py-2.5 bg-white/10 backdrop-blur-xl border border-[#D3D3D3] rounded-lg shadow-5 transition-all duration-300 focus-within:border-[#0054A5]/30 focus-within:shadow-6">
                            <span className="text-[#64748B] font-medium">#</span>
                            <input
                                type="text"
                                value={qrColor.replace(/^#/, '')}
                                maxLength={6}
                                onChange={(e) => {
                                    const hex = e.target.value
                                        .replace(/^#/, '')
                                        .replace(/[^0-9A-Fa-f]/g, '')
                                        .toUpperCase()
                                    setQrColor(`#${hex}`)
                                }}
                                className="flex-1 outline-none ml-1 bg-transparent text-[#64748B] font-medium placeholder:text-gray-400"
                                placeholder="000000"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <h2 className="text-[#64748B] text-sm font-semibold">Show BNCC Logo</h2>
                    <button type="button"
                        onClick={() => setShowLogo(!showLogo)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${showLogo ? 'bg-[#0054A5]' : 'bg-[#D7E0E8]'}`}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${showLogo ? 'translate-x-6' : ''}`}
                        />
                    </button>
                </div>
            </div>

            <div className="w-full lg:w-auto lg:pl-5">
                <h2 className="text-[#64748B] text-sm font-semibold mb-3">Preview QR</h2>
                <div className="relative bg-white backdrop-blur-xl rounded-2xl border border-[#D3D3D3] shadow-5 flex items-center justify-center p-5 transition-all duration-300 hover:shadow-7 mx-auto lg:mx-0"
                    style={{ width: size + 40, height: size + 40, maxWidth: '100%' }}
                >
                    {qrValue ? (
                        <div className="relative" style={{ width: size, height: size }}>
                            <QRCode value={qrValue} size={size} fgColor={qrColor} />

                            {showLogo && (
                                <div className="bottom-0 right-0 absolute bg-white rounded-tl-md"
                                    style={{
                                        paddingLeft: size * 0.02,
                                        paddingTop: size * 0.02,
                                    }}
                                >
                                    <BNCCLogo color={qrColor} width={Math.floor(size / 3)} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm text-center font-medium">
                            Enter custom link <br /> to preview QR
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}