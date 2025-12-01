"use client"

import React, { useRef, useState, useEffect } from 'react'
import DateRangePicker from '@/components/layout/DateRangePicker'
import { Calendar } from 'lucide-react'

interface FilterState {
    dateFilter: 'all' | 'last7days' | 'last30days'
    customDateRange: {
        start: Date | null
        end: Date | null
    }
    status: ('active' | 'inactive')[]
    access: ('public' | 'private')[]
    showLogo: boolean[]
}

interface FilterPopupProps {
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    onClose: () => void
    className?: string
    type: 'links' | 'qrs'
}

const FilterPopup: React.FC<FilterPopupProps> = ({
    filters,
    onFiltersChange,
    onClose,
    className = '',
    type
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const datePickerRef = useRef<HTMLDivElement>(null)
    const { start, end } = filters.customDateRange

    useEffect(() => {
        if (!showDatePicker && start && !end) {
            updateDateRange(null, null)
        }
    }, [showDatePicker])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
                setShowDatePicker(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (start && !end) {
            const id = setTimeout(() => updateDateRange(null, null), 10000)
            return () => clearTimeout(id)
        }
    }, [start, end])

    const updateDateRange = (startDate: Date | null, endDate: Date | null) => {
        onFiltersChange({
            ...filters,
            dateFilter: 'all',
            customDateRange: { start: startDate, end: endDate },
            showLogo: filters.showLogo ?? []
        })
    }

    const clearDateRange = () => updateDateRange(null, null)
    const toggleDatePicker = () => {
        if (start && end) clearDateRange()
        setShowDatePicker(!showDatePicker)
    }
    const formatDate = () => {
        if (!start) return "Select date range"
        if (!end) return `${start.toLocaleDateString()} - ...`
        return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    }

    const handleDateFilterChange = (value: 'all' | 'last7days' | 'last30days') => {
        onFiltersChange({
            ...filters,
            dateFilter: value,
            customDateRange: { start: null, end: null },
            showLogo: filters.showLogo ?? []
        })
    }

    const handleStatusToggle = (status: 'active' | 'inactive') => {
        onFiltersChange({
            ...filters,
            status: filters.status[0] === status ? [] : [status],
            showLogo: filters.showLogo ?? []
        })
    }

    const handleAccessToggle = (accessType: 'public' | 'private') => {
        onFiltersChange({
            ...filters,
            access: filters.access[0] === accessType ? [] : [accessType],
            showLogo: filters.showLogo ?? []
        })
    }

    const handleShowLogoToggle = (value: boolean) => {
        onFiltersChange({
            ...filters,
            showLogo: filters.showLogo[0] === value ? [] : [value]
        })
    }

    const resetFilters = () => {
        onFiltersChange({
            dateFilter: 'all',
            customDateRange: { start: null, end: null },
            status: [],
            access: [],
            showLogo: []
        })
    }

    return (
        <div className={`absolute top-full mt-2 right-0 z-50 min-w-90 bg-white/95 backdrop-blur-xl border border-[#D3D3D3] rounded-2xl shadow-1 p-6 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#0054A5]">Filter Options</h3>
                <button onClick={resetFilters} className="cursor-pointer text-sm text-[#64748B] hover:text-[#0054A5] font-medium transition-colors">
                    Reset All
                </button>
            </div>

            <div className="space-y-6 max-h-[70vh] pr-2">
                <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-3">Filter by Created Date</label>
                    <div className="flex flex-wrap gap-2">
                        {['last7days', 'last30days'].map((typeBtn) => (
                            <button
                                key={typeBtn}
                                onClick={() => handleDateFilterChange(typeBtn as any)}
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
                                    ${filters.dateFilter === typeBtn ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow-md' : 'bg-gray-100 text-[#0054A5] hover:bg-gray-200'}`}>
                                {typeBtn === "last7days" ? "Last 7 Days" : "Last 30 Days"}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#0F172A] mb-3">Custom Create Date Range</label>
                    <div ref={datePickerRef} className="relative">
                        <button onClick={toggleDatePicker} className="w-full cursor-pointer px-4 py-2 bg-white border border-[#D3D3D3] rounded-lg text-left text-[#0054A5] font-medium hover:border-[#0054A5] transition-all flex items-center justify-between">
                            <span className={!start || !end ? "text-gray-400" : "text-[#0054A5]"}>{formatDate()}</span>
                            <Calendar className="w-4 h-4 text-[#0054A5]" />
                        </button>

                        {showDatePicker && (
                            <div className="absolute top-full mt-2 left-0 z-[60]">
                                <DateRangePicker
                                    startDate={start}
                                    endDate={end}
                                    onStartDateChange={(date) => updateDateRange(date, end)}
                                    onEndDateChange={(date) => updateDateRange(start, date)}
                                    onClose={() => setShowDatePicker(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {type === 'links' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-3">Filter by Status</label>
                            <div className="flex flex-wrap gap-2">
                                {['active', 'inactive'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusToggle(s as any)}
                                        className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
                                            ${filters.status.includes(s as any) ? 'bg-[#0054A5] text-white shadow-md' : 'bg-gray-100 text-[#0054A5] hover:bg-gray-200'}`}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-3">Filter by Access</label>
                            <div className="flex flex-wrap gap-2">
                                {['public', 'private'].map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => handleAccessToggle(a as any)}
                                        className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
                                            ${filters.access.includes(a as any) ? 'bg-[#0054A5] text-white shadow-md' : 'bg-gray-100 text-[#0054A5] hover:bg-gray-200'}`}>
                                        {a.charAt(0).toUpperCase() + a.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {type === 'qrs' && (
                    <div>
                        <label className="block text-sm font-semibold text-[#0F172A] mb-3">Filter by Show Logo</label>
                        <div className="flex flex-wrap gap-2">
                            {[true, false].map((val) => (
                                <button
                                    key={val.toString()}
                                    onClick={() => handleShowLogoToggle(val)}
                                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
                                        ${filters.showLogo.includes(val) ? 'bg-[#0054A5] text-white shadow-md' : 'bg-gray-100 text-[#0054A5] hover:bg-gray-200'}`}>
                                    {val ? "Show Logo" : "Hide Logo"}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default FilterPopup
