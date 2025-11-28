"use client"

import React, { useState, useEffect } from "react"
import LinkItem from "./LinkItem"
import LoadMoreButton from "../layout/LoadMoreButton"
import EmptyState from "../layout/EmptyState"
import { usePagination } from "@/hooks/usePagination"


interface LinkCard {
    _id: string
    userId: string
    title: string
    originalUrl: string
    customUrl: string
    shortenLink: string
    qr: {
        enabled: boolean
        qrColor: string
        showLogo: boolean
    }
    code: string
    expirationDate: Date
    createdAt: string
}

type LinksProps = {
    links: LinkCard[]
    onShowToast: (toast: { message: string; type?: "success" | "error" | "warning" }) => void
    searchQuery?: string
    onClearSearch?: () => void
    hasActiveFilters?: boolean
    onClearFilters?: () => void
}

const Links: React.FC<LinksProps> = ({ 
    links: initialLinks, 
    onShowToast,
    searchQuery = "",
    onClearSearch,
    hasActiveFilters = false,
    onClearFilters
}) => {
    const [links, setLinks] = useState<LinkCard[]>(initialLinks)
    const [activeLinkId, setActiveLinkId] = useState<string | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    // Pagination hook
    const {
        visibleItems: visibleLinks,
        hasMore,
        remainingCount,
        loadMore,
        reset
    } = usePagination({
        items: links,
        itemsPerPage: 10
    })

    useEffect(() => {
        setLinks(initialLinks)
        reset()
    }, [initialLinks])

    const handleUpdateLink = (updatedLink: LinkCard) => {
        setLinks(prev =>
            prev.map(link => link._id === updatedLink._id ? updatedLink : link)
        )
    }

    const handleActivateLink = (linkId: string) => {
        setActiveLinkId(linkId)
    }

    const handleDeactivateLink = () => {
        setActiveLinkId(null)
    }

    const handleLoadMore = async () => {
        setIsLoadingMore(true)
        await new Promise(resolve => setTimeout(resolve, 300))
        loadMore()
        setIsLoadingMore(false)
    }

    // Check if it's truly empty (no links in database) vs filtered out
    const isTrulyEmpty = initialLinks.length === 0 && !searchQuery && !hasActiveFilters
    const isFilteredEmpty = links.length === 0 && (searchQuery || hasActiveFilters)

    // State: Tidak ada link sama sekali di database
    if (isTrulyEmpty) {
        return (
            <EmptyState
                type="no-data"
                dataType="link"
            />
        )
    }

    // State: Link tidak ditemukan karena search/filter
    if (isFilteredEmpty) {
        return (
            <EmptyState
                type="no-results"
                dataType="link"
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onClearSearch={onClearSearch}
                onClearFilters={onClearFilters}
            />
        )
    }

    // State: Ada links yang ditampilkan
    return (
        <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
            <ul className="space-y-3 sm:space-y-4">
                {visibleLinks.map((link) => (
                    <LinkItem
                        key={link._id}
                        link={link}
                        isActive={activeLinkId === link._id}
                        onUpdateLink={handleUpdateLink}
                        onShowToast={onShowToast}
                        onActivate={() => handleActivateLink(link._id)}
                        onDeactivate={handleDeactivateLink}
                    />
                ))}
            </ul>

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

export default Links    