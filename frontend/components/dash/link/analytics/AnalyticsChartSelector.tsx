import React from 'react'
import { ChartType } from '@/types/analytics'

interface AnalyticsChartSelectorProps {
    chartType: ChartType
    onChartTypeChange: (type: ChartType) => void
}

const AnalyticsChartSelector: React.FC<AnalyticsChartSelectorProps> = ({
    chartType,
    onChartTypeChange
}) => {
    return (
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <button
                onClick={() => onChartTypeChange('time')}
                className={`relative cursor-pointer border-black/10 border px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 flex items-center gap-3 flex-shrink-0 min-w-[140px] lg:min-w-0 lg:w-full
                    ${chartType === 'time' ? 'bg-white/50 text-[#0054A5]' : 'bg-transparent text-[#64748B] hover:bg-white/20 hover:text-[#0054A5]'}`}
            >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-gradient-to-b from-[#0054A5] to-[#003d7a] transition-all duration-300 ease-out ${chartType === 'time' ? 'opacity-100 scale-100' : 'opacity-0 scale-y-0'}`} />

                <span className={`text-xl transition-transform duration-300 ${chartType === 'time' ? 'scale-110' : 'scale-100'}`}>
                    📅
                </span>
                <div className="flex-1">
                    <div className="text-sm font-semibold">Time Range</div>
                    <div className="text-xs opacity-70">Clicks over time</div>
                </div>

                {chartType === 'time' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/5 to-transparent rounded-lg -z-10 animate-pulse-slow" />
                )}
            </button>

            <button
                onClick={() => onChartTypeChange('region')}
                className={`relative cursor-pointer border-black/10 border px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 flex items-center gap-3 flex-shrink-0 min-w-[140px] lg:min-w-0 lg:w-full
                    ${chartType === 'region' ? 'bg-white/50 text-[#0054A5]' : 'bg-transparent text-[#64748B] hover:bg-white/20 hover:text-[#0054A5]'}`}
            >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-gradient-to-b from-[#0054A5] to-[#003d7a] transition-all duration-300 ease-out ${chartType === 'region' ? 'opacity-100 scale-100' : 'opacity-0 scale-y-0'}`} />

                <span className={`text-xl transition-transform duration-300 ${chartType === 'region' ? 'scale-110' : 'scale-100'}`}>
                    🌍
                </span>
                <div className="flex-1">
                    <div className="text-sm font-semibold">Region</div>
                    <div className="text-xs opacity-70">Geographic data</div>
                </div>

                {chartType === 'region' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/5 to-transparent rounded-lg -z-10 animate-pulse-slow" />
                )}
            </button>

            <button
                onClick={() => onChartTypeChange('referrer')}
                className={`relative cursor-pointer border-black/10 border px-4 py-3 rounded-lg text-left font-medium transition-all duration-300 flex items-center gap-3 flex-shrink-0 min-w-[140px] lg:min-w-0 lg:w-full
                    ${chartType === 'referrer' ? 'bg-white/50 text-[#0054A5]' : 'bg-transparent text-[#64748B] hover:bg-white/20 hover:text-[#0054A5]'}`}
            >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-gradient-to-b from-[#0054A5] to-[#003d7a] transition-all duration-300 ease-out ${chartType === 'referrer' ? 'opacity-100 scale-100' : 'opacity-0 scale-y-0'}`} />

                <span className={`text-xl transition-transform duration-300 ${chartType === 'referrer' ? 'scale-110' : 'scale-100'}`}>
                    🔗
                </span>
                <div className="flex-1">
                    <div className="text-sm font-semibold">Referrer</div>
                    <div className="text-xs opacity-70">Traffic sources</div>
                </div>

                {chartType === 'referrer' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/5 to-transparent rounded-lg -z-10 animate-pulse-slow" />
                )}
            </button>
        </div>
    )
}

export default AnalyticsChartSelector