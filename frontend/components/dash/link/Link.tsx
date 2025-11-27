"use client"

import React, { useState, useEffect } from "react"
import Link from 'next/link'
import LinkItem from "./LinkItem"
import LoadMoreButton from "../layout/LoadMoreButton"
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
}

const Links: React.FC<LinksProps> = ({ links: initialLinks, onShowToast }) => {
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
        itemsPerPage: 10 // Adjust sesuai kebutuhan
    })

    // Infinite scroll (optional - uncomment jika mau auto-load)
    // const sentinelRef = useInfiniteScroll({
    //     onLoadMore: handleLoadMore,
    //     hasMore,
    //     loading: isLoadingMore
    // })

    useEffect(() => {
        setLinks(initialLinks)
        reset() // Reset pagination when links change
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
        // Simulate loading delay (remove in production)
        await new Promise(resolve => setTimeout(resolve, 300))
        loadMore()
        setIsLoadingMore(false)
    }

    if (links.length === 0) {
        return (
            <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
                <div className="flex flex-col justify-center items-center text-center py-24">
                    <img src="/images/dash/no-link.svg" className="w-50 lg:w-70 mb-4" alt="No links" />
                    <p className="text-[#0054A5] font-bold text-lg lg:text-2xl">Nothing's here yet.</p>
                    <p className="text-[#0054A5] font-medium text-sm lg:text-base mt-1">
                        Try{' '}
                        <Link href="/" className="text-[#2788CE] hover:underline">
                            creating a link
                        </Link>
                        {' '}to get started.
                    </p>
                </div>
            </div>
        )
    }

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