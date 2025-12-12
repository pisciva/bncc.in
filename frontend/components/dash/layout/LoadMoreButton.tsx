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
            className="cursor-pointer w-full mt-6 py-4 bg-gradient-to-r from-[#0054A5] to-[#2788CE] hover:from-[#003d7a] hover:to-[#1e6ba8] text-white font-semibold rounded-xl transition-all duration-500 ease-out flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.005] active:scale-[0.99]"
            onClick={onLoadMore}
            disabled={loading}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    <span>Load More</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20">
                        {remainingCount}
                    </span>
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-300" />
                </>
            )}
        </button>
    )
}

export default LoadMoreButton