'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Links from '@/components/dash/link/Link'
import QRs from '@/components/dash/qr/QR'
import Toast from '@/components/layout/Toast'
import DashboardHeader from '@/components/dash/layout/DashboardHeader'
import DashboardTabs from '@/components/dash/layout/DashboardTabs'
import DashboardSearch from '@/components/dash/layout/DashboardSearch'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useFilteredLinks, useFilteredQrs } from '@/hooks/useDashboardFilters'
import { useDashboardState } from '@/hooks/useDashboardState'
import { getActiveFilterCount, handleLogout } from '@/utils/dashboardHelpers'

function DashboardContent() {
    const { links, qrs, loading, error } = useDashboardData()
    const {
        activeTab,
        searchQuery,
        showFilterPopup,
        toast,
        filters,
        filterButtonRef,
        setSearchQuery,
        setToast,
        setFilters,
        handleTabChange,
        handleToggleFilter,
        handleClearSearch,
        handleClearFilters
    } = useDashboardState()

    const filteredLinks = useFilteredLinks(links, searchQuery, filters)
    const filteredQrs = useFilteredQrs(qrs, searchQuery, filters)

    const tabs = [
        { id: "links", label: "Links", count: filteredLinks.length },
        { id: "qrs", label: "QR Codes", count: filteredQrs.length },
    ]

    const activeFilterCount = getActiveFilterCount(filters)
    const hasActiveFilters = activeFilterCount > 0

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0054A5]"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="px-8 py-4 bg-[#EF4444]/10 backdrop-blur-xl border border-[#EF4444]/30 rounded-2xl shadow">
                    <p className="text-red-600 font-semibold">Error: {error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-30 px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-6xl mx-auto">
                <DashboardHeader onLogout={handleLogout} />

                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                    <DashboardTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />

                    <DashboardSearch
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeTab={activeTab}
                        showFilterPopup={showFilterPopup}
                        onToggleFilter={handleToggleFilter}
                        filters={filters}
                        onFiltersChange={setFilters}
                        filterButtonRef={filterButtonRef}
                        activeFilterCount={activeFilterCount}
                    />
                </div>

                <div className="mb-20">
                    {activeTab === "links" && (
                        <Links 
                            links={filteredLinks} 
                            onShowToast={setToast}
                            searchQuery={searchQuery}
                            onClearSearch={handleClearSearch}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    )}
                    {activeTab === "qrs" && (
                        <QRs 
                            qrs={filteredQrs} 
                            onShowToast={setToast}
                            searchQuery={searchQuery}
                            onClearSearch={handleClearSearch}
                            hasActiveFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    )}
                </div>

                <Link href="/">
                    <button className="cursor-pointer fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#0054A5] to-[#003d7a] rounded-full flex items-center justify-center text-white hover:scale-110 transition-all">
                        <Plus className="w-6 h-6" />
                    </button>
                </Link>
            </div>
        </div>
    )
}

const DashboardPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0054A5]"></div>
                </div>
            </div>
        }>
            <DashboardContent />
        </Suspense>
    )
}

export default DashboardPage