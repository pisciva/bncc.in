"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import QRItem from "./QRItem"

export interface QRType {
    _id: string
    userId: string
    title: string
    originalUrl: string
    qrColor: string
    showLogo: boolean
    createdAt: string
}

type QRsProps = {
    qrs: QRType[]
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
}

const QRs: React.FC<QRsProps> = ({ qrs: initialQrs, onShowToast }) => {
    const [qrs, setQrs] = useState<QRType[]>(initialQrs)

    useEffect(() => {
        setQrs(initialQrs)
    }, [initialQrs])

    const handleUpdateQR = (updatedQR: QRType) => {
        setQrs(prev =>
            prev.map(qr => qr._id === updatedQR._id ? updatedQR : qr)
        )
    }

    return (
        <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
            {qrs.length === 0 ? (
                <div className="flex flex-col justify-center items-center text-center py-24">
                    <img src="/images/dash/no-link.svg" className="w-50 lg:w-70 mb-4" alt="" />
                    <p className="text-[#0054A5] font-bold text-lg lg:text-2xl">Nothing's here yet.</p>
                    <p className="text-[#0054A5] font-medium text-sm lg:text-base mt-1">Try {' '}
                        <Link href="/" className="text-[#2788CE] hover:underline">
                            creating a QR
                        </Link>
                        {' '} to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {qrs.map((qr) => (
                        <QRItem
                            key={qr._id}
                            qr={qr}
                            onUpdateQR={handleUpdateQR}
                            onShowToast={onShowToast}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default QRs