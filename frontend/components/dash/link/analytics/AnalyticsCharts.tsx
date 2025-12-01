"use client"

import Link from 'next/link'
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { TrendingUp, MapPin, Link2 } from 'lucide-react'
import { AnalyticsData, AnalyticsView, ChartType } from '@/types/analytics'

interface AnalyticsChartsProps {
    analytics: AnalyticsData
    view: AnalyticsView
    chartType: ChartType
    startDate: Date | null
    endDate: Date | null
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
    analytics,
    view,
    chartType,
    startDate,
    endDate
}) => {
    const filterByDateRange = (data: Record<string, { clicks: number, uniqueUsers: number }>) => {
        if (!startDate || !endDate) return data

        const filtered: Record<string, { clicks: number, uniqueUsers: number }> = {}

        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)

        Object.entries(data).forEach(([date, stats]) => {
            const d = new Date(date)
            if (d >= startDate && d <= endOfDay) {
                filtered[date] = stats
            }
        })
        return filtered
    }

    const filteredByDate = filterByDateRange(analytics.byDate)

    const dateData = filteredByDate && typeof filteredByDate === 'object'
        ? Object.entries(filteredByDate)
            .filter(([_, stats]) => (view === 'clicks' ? stats.clicks : stats.uniqueUsers) > 0)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, stats]) => ({
                date: new Date(date),
                value: view === 'clicks' ? stats.clicks : stats.uniqueUsers
            }))
        : []

    const cityData = analytics.byCity && typeof analytics.byCity === 'object'
        ? Object.entries(analytics.byCity)
            .filter(([_, stats]) => (view === 'clicks' ? stats.clicks : stats.uniqueUsers) > 0)
            .sort(([, a], [, b]) => {
                const aVal = view === 'clicks' ? a.clicks : a.uniqueUsers
                const bVal = view === 'clicks' ? b.clicks : b.uniqueUsers
                return bVal - aVal
            })
            .slice(0, 10)
            .map(([city, stats], index) => ({
                id: city,
                value: view === 'clicks' ? stats.clicks : stats.uniqueUsers,
                label: city,
                color: `hsl(${200 + index * 20}, 70%, 50%)`
            }))
        : []

    const countryData = analytics.byCountry && typeof analytics.byCountry === 'object'
        ? Object.entries(analytics.byCountry)
            .filter(([_, stats]) => (view === 'clicks' ? stats.clicks : stats.uniqueUsers) > 0)
            .sort(([, a], [, b]) => {
                const aVal = view === 'clicks' ? a.clicks : a.uniqueUsers
                const bVal = view === 'clicks' ? b.clicks : b.uniqueUsers
                return bVal - aVal
            })
            .map(([country, stats], index) => ({
                id: country,
                value: view === 'clicks' ? stats.clicks : stats.uniqueUsers,
                label: country,
                color: `hsl(${20 + index * 35}, 70%, 55%)`
            }))
        : []

    const referrerData = analytics.byReferrer && typeof analytics.byReferrer === 'object'
        ? Object.entries(analytics.byReferrer)
            .filter(([_, stats]) => (view === 'clicks' ? stats.clicks : stats.uniqueUsers) > 0)
            .sort(([, a], [, b]) => {
                const aVal = view === 'clicks' ? a.clicks : a.uniqueUsers
                const bVal = view === 'clicks' ? b.clicks : b.uniqueUsers
                return bVal - aVal
            })
            .slice(0, 10)
            .map(([referrer, stats]) => ({
                referrer,
                value: view === 'clicks' ? stats.clicks : stats.uniqueUsers
            }))
        : []

    const hasData = () => {
        if (chartType === 'time') return dateData.length > 0
        if (chartType === 'region') return cityData.length > 0 || countryData.length > 0
        if (chartType === 'referrer') return referrerData.length > 0
        return false
    }

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-7">
            {chartType === 'time' && dateData.length > 0 && (
                <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-[#0054A5] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{view === 'clicks' ? 'Clicks' : 'Unique Users'} Over Time</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <LineChart
                            xAxis={[{
                                dataKey: 'date',
                                scaleType: 'band',
                                valueFormatter: (date) => new Date(date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                })
                            }]}
                            series={[
                                {
                                    dataKey: 'value',
                                    label: view === 'clicks' ? 'Clicks' : 'Unique Users',
                                    color: view === 'clicks' ? '#0054A5' : '#10b981',
                                    curve: 'linear'
                                }
                            ]}
                            dataset={dateData}
                            height={300}
                            margin={{ top: 20 }}
                        />
                    </div>
                </div>
            )}

            {chartType === 'region' && (cityData.length > 0 || countryData.length > 0) && (
                <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-[#0054A5] mb-6 flex items-center gap-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Geographic Distribution</span>
                    </h3>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                        {countryData.length > 0 && (
                            <div className="order-2 lg:order-1 w-full lg:w-auto">
                                <h4 className="text-sm font-semibold text-[#64748B] mb-3 text-center lg:text-right">
                                    Countries
                                </h4>
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                                    {countryData.map((country, index) => (
                                        <div className="flex items-center gap-2 justify-center lg:justify-end"
                                            key={country.id}
                                        >
                                            <span className="text-xs sm:text-sm text-[#64748B] font-medium truncate max-w-[120px]">
                                                {country.label}
                                            </span>
                                            <div
                                                className="w-4 h-4 rounded-sm flex-shrink-0"
                                                style={{ backgroundColor: country.color }}
                                            />
                                            <span className="text-xs sm:text-sm font-bold text-[#0054A5] min-w-[30px] text-right">
                                                {country.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="order-1 lg:order-2 flex justify-center">
                            <PieChart
                                series={[
                                    {
                                        data: cityData,
                                        innerRadius: 0,
                                        outerRadius: 80,
                                        paddingAngle: 2,
                                        cornerRadius: 5,
                                        highlightScope: { fade: 'global', highlight: 'item' }
                                    },
                                    {
                                        data: countryData,
                                        innerRadius: 100,
                                        outerRadius: 140,
                                        paddingAngle: 2,
                                        cornerRadius: 5,
                                        highlightScope: { fade: 'global', highlight: 'item' }
                                    }
                                ]}
                                height={300}
                                margin={{ top: 20, bottom: 20 }}
                                sx={{
                                    '& .MuiChartsLegend-root': {
                                        display: 'none'
                                    }
                                }}
                            />
                        </div>

                        {cityData.length > 0 && (
                            <div className="order-3 w-full lg:w-auto">
                                <h4 className="text-sm font-semibold text-[#64748B] mb-3 text-center lg:text-left">
                                    Cities
                                </h4>
                                <div className="space-y-2 max-h-80 overflow-y-auto pl-2">
                                    {cityData.map((city, index) => (
                                        <div className="flex items-center gap-2 justify-center lg:justify-start"
                                            key={city.id}
                                        >
                                            <span className="text-xs sm:text-sm font-bold text-[#0054A5] min-w-[30px]">
                                                {city.value}
                                            </span>
                                            <div
                                                className="w-4 h-4 rounded-sm flex-shrink-0"
                                                style={{ backgroundColor: city.color }}
                                            />
                                            <span className="text-xs sm:text-sm text-[#64748B] font-medium truncate max-w-[120px]">
                                                {city.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#64748B]">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border-4 border-orange-400 bg-transparent"></div>
                            <span className="font-medium">Outer: Countries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                            <span className="font-medium">Inner: Cities</span>
                        </div>
                    </div>
                </div>
            )}

            {chartType === 'referrer' && referrerData.length > 0 && (
                <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-[#0054A5] mb-4 flex items-center gap-2">
                        <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Traffic Sources</span>
                    </h3>
                    <div className="overflow-x-auto">
                        <BarChart
                            xAxis={[{
                                dataKey: 'referrer',
                                scaleType: 'band'
                            }]}
                            series={[
                                {
                                    dataKey: 'value',
                                    label: view === 'clicks' ? 'Clicks' : 'Unique Users',
                                    color: '#8b5cf6'
                                }
                            ]}
                            dataset={referrerData}
                            height={350}
                            layout="vertical"
                            margin={{ top: 20 }}
                        />
                    </div>
                </div>
            )}

            {!hasData() && (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-[#0054A5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-[#0054A5]" />
                    </div>
                    <p className="text-[#64748B] font-medium text-base sm:text-lg">No data available yet</p>
                    <p className="text-[#64748B] text-xs sm:text-sm mt-2">Share your link to start collecting analytics!</p>
                </div>
            )}
        </div>
    )
}

export default AnalyticsCharts