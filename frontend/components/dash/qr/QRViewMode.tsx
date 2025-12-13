'use client'

import React, { useRef } from "react"
import { toPng } from 'html-to-image'
import QRCode from "react-qr-code"
import BNCCLogo from "../../layout/BNCCLogo"
import DownloadQR from "../../main/comp/DownloadQR"
import { formatCreatedAt } from "@/utils/formatCreatedAt"
import { Copy, Edit, Calendar } from 'lucide-react'
import { QRType } from "./QR"
import Link from 'next/link'

interface QRViewModeProps {
    qr: QRType
    cardRef: React.RefObject<HTMLDivElement | null>
    justUpdated: boolean
    onEdit: () => void
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
}

const QRViewMode: React.FC<QRViewModeProps> = ({
    qr,
    cardRef,
    justUpdated,
    onEdit,
    onShowToast
}) => {
    const qrRef = useRef<HTMLDivElement>(null)
    const size = 180

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

    return (
        <div ref={cardRef} className={`rounded-2xl shadow-2  transition-all duration-300 border ${justUpdated ? 'border-[#0054A5]/50 shadow-[0_6px_18px_rgba(0,0,0,0.15)] scale-[1.01]' : 'border-transparent shadow-[0_4px_14px_rgba(0,0,0,0.12)]'}`}>
            <div className="p-4 sm:p-5 flex flex-col md:flex-row md:gap-5">
                <div className="mb-4 md:mb-0 overflow-hidden rounded-2xl shadow-2 mx-auto md:mx-0">
                    <div className="relative bg-white flex items-center justify-center p-5 transition-all duration-300"
                        ref={qrRef}
                        style={{ width: size + 40, height: size + 40 }}
                    >
                        <div className="relative" style={{ width: size, height: size }}>
                            <QRCode
                                value={qr.originalUrl || ""}
                                size={size}
                                fgColor={qr.qrColor}
                                className="w-full h-full"
                            />
                            {qr.showLogo && (
                                <div className="absolute bg-white rounded-tl-md"
                                    style={{
                                        bottom: 0,
                                        right: 0,
                                        paddingLeft: size * 0.02,
                                        paddingTop: size * 0.02,
                                    }}
                                >
                                    <BNCCLogo color={qr.qrColor} width={Math.floor(size / 3)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-3 mb-4 md:mb-0">
                        {qr.title && (
                            <p className="text-base sm:text-lg font-bold text-[#0054A5] text-center md:text-left truncate">
                                {qr.title}
                            </p>
                        )}
                        <Link
                            href={qr.originalUrl.startsWith('http://') || qr.originalUrl.startsWith('https://') ? qr.originalUrl : `https://${qr.originalUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={qr.originalUrl}
                            className="text-xs sm:text-sm font-medium text-[#64748B] hover:text-[#0054A5] underline decoration-[0.5px] underline-offset-2 block text-center md:text-left truncate transition-colors w-full max-w-full min-w-0"
                        >
                            {qr.originalUrl}
                        </Link>

                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs sm:text-sm">
                            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                            <span className="text-[#64748B] font-medium">
                                {formatCreatedAt(qr.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col flex-row gap-2 justify-center md:justify-end items-end">
                        <DownloadQR qrRef={qrRef} name={qr.title} rounded="rounded-full" />
                        <button className="hidden lg:flex cursor-pointer w-10 h-10 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full hover:bg-white/25 transition-all duration-300 items-center justify-center flex-shrink-0"
                            onClick={handleCopyQR}
                        >
                            <Copy className="w-3.5 h-3.5 text-[#0054A5]" />
                        </button>
                        <button className="cursor-pointer w-10 h-10 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full hover:bg-white/25 transition-all duration-300 flex items-center justify-center flex-shrink-0"
                            onClick={onEdit}
                        >
                            <Edit className="w-4 h-4 text-[#0054A5]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QRViewMode