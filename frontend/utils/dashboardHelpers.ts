import { FilterState } from '@/types/filters'

export const getActiveFilterCount = (filters: FilterState): number => {
    let count = 0
    if (filters.dateFilter !== 'all') count++
    if (filters.customDateRange.start || filters.customDateRange.end) count++
    if (filters.status.length > 0) count++
    if (filters.access.length > 0) count++
    return count
}

export const handleLogout = (): void => {
    localStorage.removeItem("token")
    window.location.href = "/login"
}       