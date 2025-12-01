"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import DateRangePicker from '@/components/layout/DateRangePicker'

interface AnalyticsDateFilterProps {
    startDate: Date | null
    endDate: Date | null
    onStartDateChange: (date: Date | null) => void
    onEndDateChange: (date: Date | null) => void
}

const AnalyticsDateFilter: React.FC<AnalyticsDateFilterProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
}) => {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const datePickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!showDatePicker && startDate && !endDate) {
            onStartDateChange(null)
        }
    }, [showDatePicker])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (startDate && !endDate) {
            const timeoutId = setTimeout(() => {
                onStartDateChange(null)
            }, 10000)

            return () => clearTimeout(timeoutId)
        }
    }, [startDate, endDate, onStartDateChange])

    const clearDateRange = () => {
        onStartDateChange(null)
        onEndDateChange(null)
    }

    const formatDateRange = () => {
        if (!startDate) return 'Select date range'
        if (!endDate) return `${startDate.toLocaleDateString()} - ...`
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div ref={datePickerRef} className="relative">
                
                <button className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg h-12 bg-white/15 backdrop-blur-xl border transition-all duration-300 flex items-center justify-between cursor-pointer border-[#D3D3D3]"
                    onClick={() => {
                        if (startDate && endDate) {clearDateRange()}
                        setShowDatePicker(!showDatePicker)
                    }}
                >
                    <span className={`text-sm font-medium ${(!startDate || !endDate) ? 'text-gray-400' : 'text-[#0054A5]'}`}>
                        {formatDateRange()}
                    </span>

                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-[#0054A5]" />
                </button>

                {showDatePicker && (
                    <div className="absolute top-full mt-2 left-0 z-50">
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={(date) => onStartDateChange(date)}
                            onEndDateChange={(date) => onEndDateChange(date)}
                            onClose={() => setShowDatePicker(false)}
                        />
                    </div>
                )}
            </div>

            {(startDate || endDate) && (
                <button onClick={clearDateRange} className="cursor-pointer px-4 py-2 text-sm text-red-500 font-semibold hover:bg-red-50 border border-red-200 rounded-xl transition-all">
                    Clear
                </button>
            )}
        </div>
    )
}

export default AnalyticsDateFilter