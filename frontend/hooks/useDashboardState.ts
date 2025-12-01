import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { FilterState } from '@/types/filters'
import { TabType } from '@/types/dashboard'

export const useDashboardState = () => {
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

    const handleClearSearch = () => {
        setSearchQuery("")
    }

    const handleClearFilters = () => {
        setFilters({
            dateFilter: 'all',
            customDateRange: { start: null, end: null },
            status: [],
            access: [],
            showLogo: []
        })
    }

    return {
        activeTab,
        searchQuery,
        showFilterPopup,
        toast,
        filters,
        filterButtonRef,
        setActiveTab,
        setSearchQuery,
        setShowFilterPopup,
        setToast,
        setFilters,
        handleTabChange,
        handleToggleFilter,
        handleClearSearch,
        handleClearFilters
    }
}