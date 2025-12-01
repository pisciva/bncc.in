"use client"

import React from 'react'
import { TrendingUp, Users } from 'lucide-react'
import { AnalyticsData, AnalyticsView } from '@/types/analytics'
import { LinkCard } from "../LinkItem"

interface AnalyticsStatsProps {
    analytics: AnalyticsData
    view: AnalyticsView
    onViewChange: (view: AnalyticsView) => void
    link: LinkCard
}

const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({ analytics, view, onViewChange, link }) => {
    return (
        <div className="flex w-full flex-col lg:flex-row gap-2 lg:gap-4">
            <div className="lg:w-1/2 flex items-center">
                <div className="text-lg md:text-3xl font-medium text-[#64748B] truncate">
                    <span className="text-[#0054A5] font-semibold">
                        bncc.in/{link.customUrl}
                    </span>
                </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4">
                <button
                    onClick={() => onViewChange('clicks')}
                    className={`group cursor-pointer py-2 pl-2 sm:pl-4 pr-4 sm:pr-6 rounded-xl transition-all duration-200 hover:scale-[1.01] ${view === 'clicks'
                        ? 'border-[#0054A5] border-2 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-6' : 'border-black/20 border-1 bg-white/10 hover:border-[#0054A5]/50 hover:bg-white/20 hover:shadow-6'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg transition-all duration-300 ${view === 'clicks'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-18' : 'bg-blue-500/80 group-hover:bg-blue-500'}`}>
                            <TrendingUp className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <div className="text-xl sm:text-2xl font-bold text-[#0054A5]">{analytics.totalClicks}</div>
                            <div className="text-[10px] sm:text-xs text-[#64748B] font-medium">Total Clicks</div>
                        </div>
                        {view === 'clicks' && <div className="w-2 h-2 rounded-full bg-[#0054A5] animate-pulse" />}
                    </div>
                </button>

                <button
                    onClick={() => onViewChange('users')}
                    className={`group cursor-pointer py-2 pl-2 sm:pl-4 pr-4 sm:pr-6 rounded-xl transition-all duration-300 hover:scale-[1.01] ${view === 'users'
                        ? 'border-[#10B981] border-2 bg-gradient-to-br from-green-50 to-green-100/50 shadow-19' : 'border-black/20 border-1 bg-white/10 hover:border-[#10B981]/50 hover:bg-white/20 hover:shadow-20'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg transition-all duration-300 ${view === 'users'
                            ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-20' : 'bg-green-500/80 group-hover:bg-green-500'}`}>
                            <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="text-left flex-1">
                            <div className="text-xl sm:text-2xl font-bold text-[#10B981]">{analytics.uniqueUsers}</div>
                            <div className="text-[10px] sm:text-xs text-[#64748B] font-medium">Unique Users</div>
                        </div>
                        {view === 'users' && <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default AnalyticsStats
