"use client"

import React, { useState, useRef, useEffect } from "react"
import { toPng } from 'html-to-image'
import QRCode from "react-qr-code"
import BNCCLogo from "../..//layout/BNCCLogo"
import DownloadQR from "../../main/comp/DownloadQR"
import { formatCreatedAt } from "@/utils/formatCreatedAt"
import { Eye, EyeOff, Copy, QrCode, Edit, Lock, Unlock, Clock, Calendar, KeyRound, BarChart3, MoreVertical, Monitor } from 'lucide-react'
import { LinkCard } from "./LinkItem"
import Link from 'next/link'

interface LinkViewModeProps {
    link: LinkCard
    justUpdated: boolean
    onEdit: () => void
    onViewAnalytics: () => void
    onCopy: () => void
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
}

const LinkViewMode: React.FC<LinkViewModeProps> = ({
    link,
    justUpdated,
    onEdit,
    onViewAnalytics,
    onCopy,
    onShowToast
}) => {
    const [showPasscode, setShowPasscode] = useState(false)
    const [popup, setPopup] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [showDesktopOnlyPopup, setShowDesktopOnlyPopup] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    const qrButtonRef = useRef<HTMLButtonElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)

    const expDate = link.expirationDate ? new Date(link.expirationDate) : null
    const now = new Date()
    const isActive = !expDate || expDate > now
    const qrValue = `https://bncc.in/${link.customUrl}`
    const size = 160

    const handleCopyQR = async () => {
        try {
            if (!qrRef.current) return
            const dataUrl = await toPng(qrRef.current, { pixelRatio: 5 })
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            onShowToast({ message: 'QR grabbed! Go paste it!', type: 'success' })
        } catch (err) {
            onShowToast({ message: "Uh-oh! Couldn't grab the QR!", type: 'error' })
        }
    }

    const handleMobileQRClick = () => {
        setMobileMenu(false)
        setPopup(true)
    }

    const handleMobileAnalyticsClick = () => {
        setMobileMenu(false)
        setShowDesktopOnlyPopup(true)
    }

    const handleMobileEditClick = () => {
        setMobileMenu(false)
        onEdit()
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (qrButtonRef.current && qrButtonRef.current.contains(e.target as Node)) return
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setPopup(false)
            }
        }

        if (popup) document.addEventListener("mousedown", handleClickOutside)
        else document.removeEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [popup])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (mobileMenuButtonRef.current && mobileMenuButtonRef.current.contains(e.target as Node)) return
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setMobileMenu(false)
            }
        }

        if (mobileMenu) document.addEventListener("mousedown", handleClickOutside)
        else document.removeEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [mobileMenu])

    return (
        <>
            <div className={`rounded-2xl shadow-7 hover:shadow-7 transition-all duration-300 border ${justUpdated ? 'border-[#0054A5]/50 shadow-12 scale-[1.01]' : 'border-transparent'}`}>
                <div className="p-5 sm:p-6 lg:px-7">
                    <div className="flex flex-row gap-4 lg:gap-6">
                        <div className="flex-1 space-y-3 sm:space-y-4 overflow-hidden">
                            {link.title && (
                                <p className="text-xs sm:text-sm font-medium text-[#64748B]">{link.title}</p>
                            )}

                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0054A5] truncate">
                                    bncc.in/{link.customUrl}
                                </p>
                                <Link
                                    href={link.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="max-w-85 text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#0054A5] underline decoration-[0.5px] underline-offset-2 truncate block transition-colors"
                                >
                                    {link.originalUrl}
                                </Link>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:gap-16 text-xs sm:text-sm z-0">
                                <div className="md:w-50 flex items-center gap-1.5 py-1 rounded-full">
                                    <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                                    <span className="text-[#64748B] font-medium">{formatCreatedAt(link.createdAt)}</span>
                                </div>

                                <div className="md:w-20 flex items-center gap-1.5 py-1 rounded-full">
                                    {link.code ? <Lock className="w-3.5 h-3.5 text-[#64748B]" /> : <Unlock className="w-3.5 h-3.5 text-[#64748B]" />}
                                    <span className="text-[#64748B] font-medium">{link.code ? "Private" : "Public"}</span>
                                </div>

                                <div className={`flex items-center gap-1.5 py-1 rounded-full ${!link.code ? 'invisible' : ''}`}>
                                    <KeyRound className="w-3.5 h-3.5 text-[#64748B]" />
                                    <span className="text-[#64748B] font-medium">
                                        {showPasscode ? link.code : "••••••"}
                                    </span>
                                    <button onClick={() => setShowPasscode(!showPasscode)} className="cursor-pointer ml-1 text-[#64748B] hover:text-[#0054A5] transition-colors">
                                        {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4 items-end">
                            <div className="flex flex-col gap-2 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 justify-end">
                                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#10B981]" : "bg-[#EF4444]"}`} />
                                    <span className={`font-semibold ${isActive ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                                        {isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                {expDate && (
                                    <div className="flex items-center gap-1.5 text-[#64748B]">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-medium">
                                            {(() => {
                                                const diffTime = expDate.getTime() - now.getTime()
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                                return diffTime > 0 ? `${diffDays} days left` : "Expired"
                                            })()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 flex-col sm:flex-row items-center">
                                {/* Desktop: Copy Link Button - Always visible */}
                                <button
                                    onClick={onCopy}
                                    className="cursor-pointer h-9 sm:h-10 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white text-xs sm:text-sm font-semibold rounded-full hover:shadow-3 transition-all duration-300 flex items-center gap-2"
                                >
                                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Copy Link</span>
                                </button>

                                {/* Desktop: Analytics, QR, Edit, Delete buttons - Hidden below lg (1024px) */}
                                <div className="hidden lg:flex gap-2">
                                    <button
                                        onClick={onViewAnalytics}
                                        className="cursor-pointer h-9 sm:h-10 px-3 sm:px-4 py-2 border border-[#D3D3D3] bg-white/15 text-[#0054A5] text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-2"
                                        title="View Analytics"
                                    >
                                        <BarChart3 className="w-3 h-3 sm:w-5 sm:h-5 text-[#0054A5]" />
                                        <span className="hidden sm:inline">Analytics</span>
                                    </button>

                                    {link.qr?.enabled && (
                                        <div className="relative">
                                            <button
                                                ref={qrButtonRef}
                                                onClick={() => setPopup(!popup)}
                                                className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full hover:bg-white/25 transition-all duration-300 flex items-center justify-center"
                                            >
                                                <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#0054A5]" />
                                            </button>

                                            <div className={`absolute right-0 bottom-full mb-2 z-50 transition-all duration-300 ease-out ${popup ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                                <div ref={popupRef}>
                                                    <div className="bg-white rounded-2xl shadow-1 p-4 flex flex-col gap-4">
                                                        <div className="overflow-hidden rounded-2xl shadow-2">
                                                            <div
                                                                ref={qrRef}
                                                                className="relative bg-white flex items-center justify-center transition-all duration-300 hover:shadow-7"
                                                                style={{ width: size + 40, height: size + 40 }}
                                                            >
                                                                <div className="relative" style={{ width: size, height: size }}>
                                                                    <QRCode value={qrValue || ""} size={size} fgColor={link.qr.qrColor || "#000"} className="w-full h-full" />
                                                                    {link.qr.showLogo && (
                                                                        <div className="absolute bg-white rounded-tl-md" style={{ bottom: 0, right: 0, paddingLeft: size * 0.02, paddingTop: size * 0.02 }}>
                                                                            <BNCCLogo color={link.qr.qrColor} width={Math.floor(size / 3)} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <DownloadQR qrRef={qrRef} name={link.title} />
                                                            <button
                                                                onClick={handleCopyQR}
                                                                title="Copy QR"
                                                                className="flex-1 px-3 py-2 bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-xl border border-[#0054A5]/30 hover:bg-white/80 hover:border-[#0054A5]/50 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-6 hover:shadow-16 flex items-center justify-center"
                                                            >
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={onEdit} className="cursor-pointer w-9 h-9 sm:w-10 sm:h-10 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full hover:bg-white/25 transition-all duration-300 flex items-center justify-center">
                                        <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-[#0054A5]" />
                                    </button>
                                </div>

                                {/* Mobile: Three-dot menu - Visible below lg (1024px) */}
                                <div className="relative lg:hidden">
                                    <button
                                        ref={mobileMenuButtonRef}
                                        onClick={() => setMobileMenu(!mobileMenu)}
                                        className="cursor-pointer w-9 h-9 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full hover:bg-white/25 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <MoreVertical className="w-4 h-4 text-[#0054A5]" />
                                    </button>

                                    {/* Mobile dropdown menu */}
                                    <div className={`absolute right-0 top-full mt-2 z-50 transition-all duration-300 ease-out ${mobileMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div ref={mobileMenuRef} className="bg-white rounded-xl shadow-1 border border-[#D3D3D3] overflow-hidden min-w-[160px]">
                                            <button
                                                onClick={handleMobileAnalyticsClick}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left opacity-50 cursor-not-allowed"
                                            >
                                                <BarChart3 className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-400">Analytics</span>
                                            </button>

                                            {link.qr?.enabled && (
                                                <button
                                                    onClick={handleMobileQRClick}
                                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0054A5]/5 transition-colors text-left border-t border-[#D3D3D3]"
                                                >
                                                    <QrCode className="w-4 h-4 text-[#0054A5]" />
                                                    <span className="text-sm font-medium text-[#0054A5]">QR Code</span>
                                                </button>
                                            )}

                                            <button
                                                onClick={handleMobileEditClick}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#0054A5]/5 transition-colors text-left border-t border-[#D3D3D3]"
                                            >
                                                <Edit className="w-4 h-4 text-[#0054A5]" />
                                                <span className="text-sm font-medium text-[#0054A5]">Edit</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Popup - Shared for both mobile and desktop */}
                                {link.qr?.enabled && popup && (
                                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center lg:hidden" onClick={() => setPopup(false)}>
                                        <div onClick={(e) => e.stopPropagation()} className="m-4">
                                            <div ref={popupRef}>
                                                <div className="bg-white rounded-2xl shadow-1 p-4 flex flex-col items-center gap-4">
                                                    <div className="overflow-hidden rounded-2xl shadow-2">
                                                        <div
                                                            ref={qrRef}
                                                            className="relative bg-white flex items-center justify-center transition-all duration-300"
                                                            style={{ width: size + 40, height: size + 40 }}
                                                        >
                                                            <div className="relative" style={{ width: size, height: size }}>
                                                                <QRCode value={qrValue || ""} size={size} fgColor={link.qr.qrColor || "#000"} className="w-full h-full" />
                                                                {link.qr.showLogo && (
                                                                    <div className="absolute bg-white rounded-tl-md" style={{ bottom: 0, right: 0, paddingLeft: size * 0.02, paddingTop: size * 0.02 }}>
                                                                        <BNCCLogo color={link.qr.qrColor} width={Math.floor(size / 3)} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DownloadQR qrRef={qrRef} name={link.title} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Only Feature Popup */}
            {showDesktopOnlyPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Monitor className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Desktop Only</h3>
                                <p className="text-sm text-gray-500">Feature not available on mobile</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            Analytics is only available on desktop devices. Please use a computer or laptop for the best experience.
                        </p>

                        <button
                            onClick={() => setShowDesktopOnlyPopup(false)}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white font-semibold rounded-xl hover:shadow-3 transition-all"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default LinkViewMode