import { useState, useMemo } from 'react'

interface UsePaginationProps<T> {
    items: T[]
    itemsPerPage?: number
}

export function usePagination<T>({ items, itemsPerPage = 20 }: UsePaginationProps<T>) {
    const [displayedCount, setDisplayedCount] = useState(itemsPerPage)

    const visibleItems = useMemo(
        () => items.slice(0, displayedCount),
        [items, displayedCount]
    )

    const hasMore = displayedCount < items.length
    const remainingCount = items.length - displayedCount

    const loadMore = () => {
        setDisplayedCount(prev => Math.min(prev + itemsPerPage, items.length))
    }

    const reset = () => {
        setDisplayedCount(itemsPerPage)
    }

    return {
        visibleItems,
        hasMore,
        remainingCount,
        loadMore,
        reset,
        displayedCount,
        totalCount: items.length
    }
}