import React from 'react'
import { ChevronDown } from 'lucide-react'

interface LoadMoreButtonProps {
    onLoadMore: () => void
    remainingCount: number
    loading?: boolean
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ 
    onLoadMore, 
    remainingCount, 
    loading = false 
}) => {
    return (
        <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#0054A5] to-[#2788CE] hover:from-[#003d7a] hover:to-[#1e6ba8] text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    <span>Load More ({remainingCount} remaining)</span>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                </>
            )}
        </button>
    )
}

export default LoadMoreButton