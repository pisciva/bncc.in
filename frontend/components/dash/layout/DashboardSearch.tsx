'use client'

import React from 'react'
import { Search, X, Filter } from 'lucide-react'
import { TabType } from '@/types/dashboard'
import { FilterState } from '@/types/filters'
import FilterPopup from '@/components/dash/layout/DashboardFilter'

interface DashboardSearchProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    activeTab: TabType
    showFilterPopup: boolean
    onToggleFilter: () => void
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    filterButtonRef: React.RefObject<HTMLDivElement>
    activeFilterCount: number
}

const DashboardSearch: React.FC<DashboardSearchProps> = ({
    searchQuery,
    onSearchChange,
    activeTab,
    showFilterPopup,
    onToggleFilter,
    filters,
    onFiltersChange,
    filterButtonRef,
    activeFilterCount
}) => {
    const placeholder = activeTab === "links"
        ? "Search by title, shorten link, or URL..."
        : "Search by title or URL..."

    return (
        <div className="flex-1 lg:max-w-lg flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-10 text-sm lg:text-base font-medium w-full px-10 py-2.5 pl-11 bg-white/10 backdrop-blur-xl border border-[#D3D3D3] rounded-full text-[#0054A5] placeholder-gray-400 focus:border-[#0054A5] focus:outline-none"
                />

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />

                {searchQuery && (
                    <button onClick={() => onSearchChange("")} className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0054A5]">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div ref={filterButtonRef} className="relative">
                <button
                    onClick={onToggleFilter}
                    className="min-h-10 cursor-pointer relative px-5 py-2.5 bg-[#0054A5] rounded-full flex items-center gap-2 text-white"
                >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>

                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {showFilterPopup && (
                    <FilterPopup
                        filters={filters}
                        onFiltersChange={onFiltersChange}
                        onClose={() => onToggleFilter()}
                        className="absolute right-0"
                        type={activeTab}
                    />
                )}
            </div>
        </div>
    )
}

export default DashboardSearch