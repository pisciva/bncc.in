import { useEffect, useRef } from 'react'

interface UseInfiniteScrollProps {
    onLoadMore: () => void
    hasMore: boolean
    loading?: boolean
    threshold?: number
}

export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading = false,
    threshold = 0.8
}: UseInfiniteScrollProps) {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!hasMore || loading) return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const target = entries[0]
                if (target.isIntersecting) {
                    onLoadMore()
                }
            },
            { threshold }
        )

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [hasMore, loading, onLoadMore, threshold])

    return sentinelRef
}