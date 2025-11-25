"use client"

import React, { useState, useEffect } from 'react'
import AnalyticsHeader from './analytics/AnalyticsHeader'
import AnalyticsStats from './analytics/AnalyticsStats'
import AnalyticsChartSelector from './analytics/AnalyticsChartSelector'
import AnalyticsDateFilter from './analytics/AnalyticsDateFilter'
import AnalyticsCharts from './analytics/AnalyticsCharts'
import { AnalyticsData, AnalyticsView, ChartType } from '@/types/analytics'
import { LinkCard } from "./LinkItem"

interface LinkAnalyticsModeProps {
    link: LinkCard
    linkId: string
    token: string | null
    onClose: () => void
}

const LinkAnalyticsMode: React.FC<LinkAnalyticsModeProps> = ({ link, linkId, token, onClose }) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [view, setView] = useState<AnalyticsView>('clicks')
    const [chartType, setChartType] = useState<ChartType>('time')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    useEffect(() => {
        fetchAnalytics()
    }, [linkId])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/analytics/${linkId}`, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` })
                }
            })

            if (!res.ok) throw new Error('Failed to fetch analytics')

            const data = await res.json()
            setAnalytics(data.analytics)
            setLoading(false)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
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
                <AnalyticsHeader onClose={onClose} isError />
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
            <AnalyticsHeader onClose={onClose} />

            <div className="p-3 sm:p-5 space-y-6">
                <AnalyticsStats 
                    link={link}
                    analytics={analytics}
                    view={view}
                    onViewChange={setView}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6">
                    <div className="lg:col-span-3 sm:space-y-4">
                        <div className="rounded-xl  pt-4 sm:pt-6 lg:pt-0">
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
            </div>
        </div>
    )
}

export default LinkAnalyticsMode