import { useMemo } from 'react'
import { LinkType } from '@/types/link'
import { QRType } from '@/types/qr'
import { FilterState } from '@/types/filters'

export const useFilteredLinks = (
    links: LinkType[],
    searchQuery: string,
    filters: FilterState
) => {
    return useMemo(() => {
        let result = links
        const now = new Date()

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            result = result.filter((link) => {
                const matchName = link.title?.toLowerCase().includes(query) ?? false
                const shortenCode = link.shortenLink?.split('/').pop()?.toLowerCase() ?? ''
                const matchShorten = (link.shortenLink?.toLowerCase().includes(query) ?? false) || shortenCode.includes(query)
                const matchOriginal = link.originalUrl?.toLowerCase().includes(query) ?? false
                return matchName || matchShorten || matchOriginal
            })
        }

        result = result.filter((link) => {
            let valid: boolean = true

            if (filters.dateFilter === 'last7days') {
                const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                valid = valid && new Date(link.createdAt) >= last7Days
            } else if (filters.dateFilter === 'last30days') {
                const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                valid = valid && new Date(link.createdAt) >= last30Days
            }

            if (filters.customDateRange.start) {
                const startDate = new Date(filters.customDateRange.start)
                valid = valid && new Date(link.createdAt) >= startDate
            }

            if (filters.customDateRange.end) {
                const endDate = new Date(filters.customDateRange.end)
                endDate.setHours(23, 59, 59, 999)
                valid = valid && new Date(link.createdAt) <= endDate
            }

            if (filters.status.length > 0) {
                const hasExpire = !!link.expirationDate
                const expireDate = hasExpire ? new Date(link.expirationDate) : null
                const isActive = hasExpire ? (expireDate! >= now) : true
                const isInactive = hasExpire ? (expireDate! < now) : false

                valid =
                    valid &&
                    ((filters.status.includes("active") && isActive) ||
                        (filters.status.includes("inactive") && isInactive))
            }

            if (filters.access.length > 0) {
                const linkAccess: 'public' | 'private' = link.code ? 'private' : 'public'
                valid = valid && filters.access.includes(linkAccess)
            }

            return valid
        })

        return result
    }, [links, searchQuery, filters])
}

export const useFilteredQrs = (
    qrs: QRType[],
    searchQuery: string,
    filters: FilterState
) => {
    return useMemo(() => {
        let result = qrs
        const now = new Date()

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            result = result.filter((qr) => {
                const matchName = qr.title?.toLowerCase().includes(query)
                const matchOriginal = qr.originalUrl?.toLowerCase().includes(query)
                return matchName || matchOriginal
            })
        }

        if (filters.dateFilter === 'last7days') {
            const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            result = result.filter(qr => new Date(qr.createdAt) >= last7Days)
        } else if (filters.dateFilter === 'last30days') {
            const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            result = result.filter(qr => new Date(qr.createdAt) >= last30Days)
        }

        if (filters.customDateRange.start) {
            const startDate = new Date(filters.customDateRange.start)
            result = result.filter(qr => new Date(qr.createdAt) >= startDate)
        }

        if (filters.customDateRange.end) {
            const endDate = new Date(filters.customDateRange.end)
            endDate.setHours(23, 59, 59, 999)
            result = result.filter(qr => new Date(qr.createdAt) <= endDate)
        }

        if (filters.showLogo && filters.showLogo.length > 0) {
            result = result.filter(qr => filters.showLogo.includes(qr.showLogo))
        }

        return result
    }, [qrs, searchQuery, filters])
}