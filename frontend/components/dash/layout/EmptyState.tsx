"use client"

import React from "react"
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type EmptyStateType = 'no-data' | 'no-results'

interface EmptyStateProps {
    type: EmptyStateType
    dataType: 'link' | 'qr'
    searchQuery?: string
    hasActiveFilters?: boolean
    onClearSearch?: () => void
    onClearFilters?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({
    type,
    dataType,
    searchQuery = "",
    hasActiveFilters = false,
    onClearSearch,
    onClearFilters
}) => {
    const handleClearAll = () => {
        if (onClearSearch) onClearSearch()
        if (onClearFilters) onClearFilters()
    }

    const dataLabel = dataType === 'link' ? 'link' : 'QR code'
    const dataLabelPlural = dataType === 'link' ? 'links' : 'QR codes'

    // Truncate search query based on screen size
    const truncateQuery = (query: string) => {
        const maxLength = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 50
        if (query.length > maxLength) {
            return query.substring(0, maxLength) + '...'
        }
        return query
    }

    // State: Tidak ada data sama sekali
    if (type === 'no-data') {
        return (
            <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
                <div className="flex flex-col justify-center items-center text-center py-24">
                    <img 
                        src="/images/dash/no-link.svg" 
                        className="w-50 lg:w-70 mb-4" 
                        alt={`No ${dataLabelPlural}`} 
                    />
                    <p className="text-[#0054A5] font-bold text-lg lg:text-2xl">
                        Nothing's here yet.
                    </p>
                    <p className="text-[#0054A5] font-medium text-sm lg:text-base mt-1">
                        Try{' '}
                        <Link href="/" className="text-[#2788CE] hover:underline">
                            creating a {dataLabel}
                        </Link>
                        {' '}to get started.
                    </p>
                </div>
            </div>
        )
    }

    // State: Tidak ada hasil dari search/filter
    return (
        <div className="bg-transparent sm:bg-white/10 sm:backdrop-blur-xl border border-white/30 sm:p-3 sm:p-4 rounded-2xl shadow-none sm:shadow-lg">
            <div className="flex flex-col justify-center items-center text-center py-24">
                <div className="w-20 h-20 rounded-full bg-[#0054A5]/10 flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-[#0054A5]" />
                </div>
                <p className="text-[#0054A5] font-bold text-lg lg:text-2xl">
                    No {dataLabelPlural} found
                </p>
                <p className="text-[#0054A5]/70 font-medium text-sm lg:text-base mt-2 max-w-sm sm:max-w-md px-4">
                    {searchQuery && !hasActiveFilters && (
                        <>
                            No {dataLabelPlural} match your search "<span className="font-semibold">{truncateQuery(searchQuery)}</span>"
                        </>
                    )}
                    {!searchQuery && hasActiveFilters && (
                        <>No {dataLabelPlural} match your current filters</>
                    )}
                    {searchQuery && hasActiveFilters && (
                        <>No {dataLabelPlural} match your search and filters</>
                    )}
                </p>
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    {searchQuery && onClearSearch && !hasActiveFilters && (
                        <button
                            onClick={onClearSearch}
                            className="cursor-pointer px-4 py-2 bg-[#0054A5]/10 hover:bg-[#0054A5]/20 text-[#0054A5] font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear search
                        </button>
                    )}
                    {!searchQuery && hasActiveFilters && onClearFilters && (
                        <button
                            onClick={onClearFilters}
                            className="cursor-pointer px-4 py-2 bg-[#0054A5]/10 hover:bg-[#0054A5]/20 text-[#0054A5] font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Clear filters
                        </button>
                    )}
                    {searchQuery && hasActiveFilters && (
                        <>
                            <button
                                onClick={onClearSearch}
                                className="cursor-pointer px-4 py-2 bg-[#0054A5]/10 hover:bg-[#0054A5]/20 text-[#0054A5] font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Clear search
                            </button>
                            <button
                                onClick={onClearFilters}
                                className="cursor-pointer px-4 py-2 bg-[#0054A5]/10 hover:bg-[#0054A5]/20 text-[#0054A5] font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Clear filters
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="cursor-pointer px-4 py-2 bg-[#0054A5] hover:bg-[#003d7a] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Clear all
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmptyState