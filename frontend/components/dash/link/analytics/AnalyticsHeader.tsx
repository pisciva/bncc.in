"use client"

import React from 'react'
import { TrendingUp, X, RefreshCw } from 'lucide-react'

interface AnalyticsHeaderProps {
    onClose: () => void
    onRefresh?: () => void
    refreshing?: boolean
    isError?: boolean
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ onClose, onRefresh, refreshing = false, isError = false }) => {
    return (
        <div className="rounded-t-2xl bg-gradient-to-r from-[#0054A5] to-[#003d7a] px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Link Analytics
            </div>
            <div className="flex items-center gap-2">
                {!isError && onRefresh && (
                    <button className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onRefresh}
                        disabled={refreshing}
                        title="Refresh analytics"
                    >
                        <RefreshCw className={`w-5 h-5 cursor-pointer ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                )}
                <button className="text-white hover:bg-white/20 rounded-full p-1 transition-all duration-300"
                    onClick={onClose}
                >
                    <X className="w-5 h-5 cursor-pointer" />
                </button>
            </div>
        </div>
    )
}

export default AnalyticsHeader