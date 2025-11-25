"use client"

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateRangePickerProps {
    startDate: Date | null
    endDate: Date | null
    onStartDateChange: (date: Date) => void
    onEndDateChange: (date: Date) => void
    onClose?: () => void
    className?: string
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onClose,
    className = ''
}) => {
    const [selectingStart, setSelectingStart] = useState(!startDate || !!endDate)
    const [currentMonth, setCurrentMonth] = useState(startDate || new Date())
    const [hoverDay, setHoverDay] = useState<number | null>(null)

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        return { firstDay, daysInMonth }
    }

    const handleDateSelect = (day: number) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

        if (selectingStart) {
            onStartDateChange(selected)
            setSelectingStart(false)
        } else {
            if (startDate && selected < startDate) {
                onStartDateChange(selected)
                onEndDateChange(startDate)
            } else {
                onEndDateChange(selected)
            }
            onClose?.()
            setSelectingStart(true)
        }
    }

    const isHoverInRange = (day: number) => {
        if (!startDate || endDate || hoverDay === null) return false
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        const hovered = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), hoverDay)
        return date >= startDate && date <= hovered
    }

    const isDateInRange = (day: number) => {
        if (!startDate || !endDate) return false
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        return date >= startDate && date <= endDate
    }

    const isDateSelected = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        return (startDate && date.toDateString() === startDate.toDateString()) ||
            (endDate && date.toDateString() === endDate.toDateString())
    }

    const isDateDisabled = (day: number) => {
        if (!selectingStart && startDate) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            return date < startDate
        }
        return false
    }

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

    return (
        <div className={`w-80 bg-white border-2 border-white/50 rounded-2xl shadow-1 p-5 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() =>
                        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
                    }
                    className="p-2 hover:bg-[#0054A5]/10 rounded-lg transition-all"
                >
                    <ChevronLeft className="w-5 h-5 text-[#0054A5]" />
                </button>

                <span className="text-[#0054A5] font-bold text-lg">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>

                <button
                    onClick={() =>
                        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
                    }
                    className="p-2 hover:bg-[#0054A5]/10 rounded-lg transition-all"
                >
                    <ChevronRight className="w-5 h-5 text-[#0054A5]" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-[#0054A5] py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} />
                ))}

                {days.map((day) => {
                    const inRange = isDateInRange(day)
                    const hoverRange = isHoverInRange(day)
                    const selected = isDateSelected(day)
                    const disabled = isDateDisabled(day)

                    return (
                        <button
                            key={day}
                            onMouseEnter={() => setHoverDay(day)}
                            onMouseLeave={() => setHoverDay(null)}
                            onClick={() => !disabled && handleDateSelect(day)}
                            disabled={disabled}
                            className={`
                                aspect-square rounded-lg text-sm font-semibold transition-all duration-200
                                ${disabled ? 'text-gray-300 cursor-not-allowed opacity-40' :
                                    selected ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow'
                                        : inRange ? 'bg-blue-200 text-[#0054A5]'
                                            : hoverRange ? 'bg-blue-100 text-[#0054A5]'
                                                : 'hover:bg-[#0054A5]/10 text-[#64748B] hover:text-[#0054A5]'
                                }
                            `}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            <div className="mt-4 text-center text-xs text-[#64748B]">
                {selectingStart ? 'Select start date' : 'Select end date'}
            </div>
        </div>
    )
}

export default DateRangePicker