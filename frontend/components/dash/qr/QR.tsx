"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import QRItem from "./QRItem"
import LoadMoreButton from "../layout/LoadMoreButton"
import { usePagination } from "@/hooks/usePagination"

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
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const {
        visibleItems: visibleQrs,
        hasMore,
        remainingCount,
        loadMore,
        reset
    } = usePagination({
        items: qrs,
        itemsPerPage: 12
    })

    useEffect(() => {
        setQrs(initialQrs)
        reset()
    }, [initialQrs])

    const handleUpdateQR = (updatedQR: QRType) => {
        setQrs(prev =>
            prev.map(qr => qr._id === updatedQR._id ? updatedQR : qr)
        )
    }

    const handleLoadMore = async () => {
        setIsLoadingMore(true)
        await new Promise(resolve => setTimeout(resolve, 300))
        loadMore()
        setIsLoadingMore(false)
    }

    if (qrs.length === 0) {
        return (
            <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
                <div className="flex flex-col justify-center items-center text-center py-24">
                    <img src="/images/dash/no-link.svg" className="w-50 lg:w-70 mb-4" alt="No QR codes" />
                    <p className="text-[#0054A5] font-bold text-lg lg:text-2xl">Nothing's here yet.</p>
                    <p className="text-[#0054A5] font-medium text-sm lg:text-base mt-1">
                        Try{' '}
                        <Link href="/" className="text-[#2788CE] hover:underline">
                            creating a QR
                        </Link>
                        {' '}to get started.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {visibleQrs.map((qr) => (
                    <QRItem
                        key={qr._id}
                        qr={qr}
                        onUpdateQR={handleUpdateQR}
                        onShowToast={onShowToast}
                    />
                ))}
            </div>

            {hasMore && (
                <LoadMoreButton
                    onLoadMore={handleLoadMore}
                    remainingCount={remainingCount}
                    loading={isLoadingMore}
                />
            )}
        </div>
    )
}

export default QRs