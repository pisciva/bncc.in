'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import Links from '@/components/dash/link/Link'
import QRs from '@/components/dash/qr/QR'
import Toast from '@/components/layout/Toast'
import DashboardHeader from '@/components/dash/layout/DashboardHeader'
import DashboardTabs from '@/components/dash/layout/DashboardTabs'
import DashboardSearch from '@/components/dash/layout/DashboardSearch'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useFilteredLinks, useFilteredQrs } from '@/hooks/useDashboardFilters'
import type { FilterState } from '@/types/filters'
import { getActiveFilterCount, handleLogout } from '@/utils/dashboardHelpers'
import { TabType } from '@/types/dashboard'

const DashboardPage = () => {
    const { links, qrs, loading, error } = useDashboardData()
    const [activeTab, setActiveTab] = useState<TabType>("links")
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilterPopup, setShowFilterPopup] = useState(false)
    const [toast, setToast] = useState<{ message: string; type?: "success" | "error" | "warning" } | null>(null)
    const [filters, setFilters] = useState<FilterState>({
        dateFilter: 'all',
        customDateRange: { start: null, end: null },
        status: [],
        access: [],
        showLogo: []
    })
    const filterButtonRef = useRef<HTMLDivElement>(null!)
    const searchParams = useSearchParams()
    const router = useRouter()
    const filteredLinks = useFilteredLinks(links, searchQuery, filters)
    const filteredQrs = useFilteredQrs(qrs, searchQuery, filters)

    const tabs = [
        { id: "links", label: "Links", count: filteredLinks.length },
        { id: "qrs", label: "QR Codes", count: filteredQrs.length },
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterButtonRef.current &&
                !filterButtonRef.current.contains(event.target as Node)
            ) {
                setShowFilterPopup(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const mode = searchParams.get('mode')
        if (mode === 'qr') {
            setActiveTab('qrs')
            router.replace('/dashboard', { scroll: false })
        } else if (mode === 'link') {
            setActiveTab('links')
            router.replace('/dashboard', { scroll: false })
        }
    }, [searchParams, router])

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setSearchQuery("")
    }

    const handleToggleFilter = () => {
        setShowFilterPopup(prev => !prev)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="px-8 py-4 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow">
                    <p className="text-[#0054A5] font-semibold">Loading...</p>
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
                        activeFilterCount={getActiveFilterCount(filters)}
                    />
                </div>

                <div className="mb-20">
                    {activeTab === "links" && <Links links={filteredLinks} onShowToast={setToast} />}
                    {activeTab === "qrs" && <QRs qrs={filteredQrs} onShowToast={setToast} />}
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

export default DashboardPage