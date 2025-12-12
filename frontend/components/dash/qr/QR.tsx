'use client'

import React, { useState, useEffect } from "react"
import QRItem from "./QRItem"
import LoadMoreButton from "../layout/LoadMoreButton"
import EmptyState from "../layout/EmptyState"
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
    searchQuery?: string
    onClearSearch?: () => void
    hasActiveFilters?: boolean
    onClearFilters?: () => void
}

const QRs: React.FC<QRsProps> = ({ 
    qrs: initialQrs, 
    onShowToast,
    searchQuery = "",
    onClearSearch,
    hasActiveFilters = false,
    onClearFilters
}) => {
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

    const isTrulyEmpty = initialQrs.length === 0 && !searchQuery && !hasActiveFilters
    const isFilteredEmpty = qrs.length === 0 && (searchQuery || hasActiveFilters)

    if (isTrulyEmpty) {
        return (
            <EmptyState
                type="no-data"
                dataType="qr"
            />
        )
    }

    if (isFilteredEmpty) {
        return (
            <EmptyState
                type="no-results"
                dataType="qr"
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onClearSearch={onClearSearch}
                onClearFilters={onClearFilters}
            />
        )
    }

    return (
        <div>
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