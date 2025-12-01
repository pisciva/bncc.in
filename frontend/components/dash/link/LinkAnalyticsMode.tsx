'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import AnalyticsHeader from './analytics/AnalyticsHeader'
import AnalyticsStats from './analytics/AnalyticsStats'
import AnalyticsChartSelector from './analytics/AnalyticsChartSelector'
import AnalyticsDateFilter from './analytics/AnalyticsDateFilter'
import AnalyticsCharts from './analytics/AnalyticsCharts'
import { AnalyticsData, AnalyticsView, ChartType } from '@/types/analytics'
import { LinkCard } from "./LinkItem"
import { API_URL } from '@/lib/api'
import { Monitor } from 'lucide-react'

interface LinkAnalyticsModeProps {
    link: LinkCard
    linkId: string
    token: string | null
    onClose: () => void
}

const LinkAnalyticsMode: React.FC<LinkAnalyticsModeProps> = ({ link, linkId, token, onClose }) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState('')
    const [view, setView] = useState<AnalyticsView>('clicks')
    const [chartType, setChartType] = useState<ChartType>('time')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    useEffect(() => {
        fetchAnalytics()
    }, [linkId])

    const fetchAnalytics = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            const res = await fetch(`${API_URL}/api/analytics/${linkId}`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            })

            if (!res.ok) throw new Error('Failed to fetch analytics')

            const data = await res.json()
            setAnalytics(data.analytics)
            setError('')
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Unknown error occurred")
            }
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        fetchAnalytics(true)
    }

    if (loading) {
        return (
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0054A5]"></div>
                </div>
                <p className="text-center mt-4 text-[#64748B] font-medium">Loading analytics...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7">
                <AnalyticsHeader onClose={onClose} onRefresh={handleRefresh} refreshing={refreshing} isError />
                <div className="p-6">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#0054A5] to-[#003d7a] rounded-full text-white font-semibold hover:shadow-3 transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!analytics) return null

    return (
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-7">
            <AnalyticsHeader onClose={onClose} onRefresh={handleRefresh} refreshing={refreshing} />

            <div className="p-3 sm:p-5 space-y-3 lg:space-y-6">
                <AnalyticsStats
                    link={link}
                    analytics={analytics}
                    view={view}
                    onViewChange={setView}
                />

                <div className="hidden lg:grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6">
                    <div className="lg:col-span-3 sm:space-y-4">
                        <div className="rounded-xl pt-4 sm:pt-6 lg:pt-0">
                            <h3 className="text-sm font-bold text-[#0054A5] mb-3 uppercase tracking-wide">Chart Type</h3>
                            <AnalyticsChartSelector
                                chartType={chartType}
                                onChartTypeChange={setChartType}
                            />
                        </div>

                        {chartType === 'time' && (
                            <div className="rounded-xl pt-4 sm:pt-0 lg:pt-4 pb-2">
                                <h3 className="text-sm font-bold text-[#0054A5] mb-3 uppercase tracking-wide">Date Range</h3>
                                <AnalyticsDateFilter
                                    startDate={startDate}
                                    endDate={endDate}
                                    onStartDateChange={setStartDate}
                                    onEndDateChange={setEndDate}
                                />
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-9">
                        <AnalyticsCharts
                            analytics={analytics}
                            view={view}
                            chartType={chartType}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                </div>

                <div className="lg:hidden">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-dashed border-blue-200">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#0054A5]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Monitor className="w-5 h-5 text-[#0054A5]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                    Charts available on desktop
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Use a computer or laptop for detailed charts and visualizations
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinkAnalyticsMode