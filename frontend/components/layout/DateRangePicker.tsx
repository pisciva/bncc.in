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
        const y = date.getFullYear()
        const m = date.getMonth()
        return {
            firstDay: new Date(y, m, 1).getDay(),
            daysInMonth: new Date(y, m + 1, 0).getDate()
        }
    }

    /**
     * LOGIC BARU (NO DISABLE)
     * - Klik 1 → start
     * - Klik 2 → end
     * - Jika klik < start → auto-swap → start = klik, end = start sebelumnya
     * - Jika range sudah lengkap dan klik lagi:
     *      - klik < start → start = klik
     *      - klik > end → end = klik
     *      - klik antara → start = klik
     */
    const handleDateSelect = (day: number) => {
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

        // Jika belum ada start → set start
        if (!startDate) {
            onStartDateChange(selected)
            return
        }

        // Jika belum ada end → pilih end (dengan auto-swap)
        if (startDate && !endDate) {
            if (selected < startDate) {
                onStartDateChange(selected)
                onEndDateChange(startDate)
            } else {
                onEndDateChange(selected)
            }
            return
        }

        // RANGE SUDAH LENGKAP → tentukan mana yang lebih dekat ke tanggal yang dipilih
        if (startDate && endDate) {
            const distToStart = Math.abs(selected.getTime() - startDate.getTime())
            const distToEnd = Math.abs(selected.getTime() - endDate.getTime())

            if (distToStart < distToEnd) {
                // Lebih dekat ke start → ubah start
                if (selected <= endDate) {
                    onStartDateChange(selected)
                } else {
                    // Kalau klik di luar range kanan → jadikan end baru
                    onEndDateChange(selected)
                }
            } else {
                // Lebih dekat ke end → ubah end
                if (selected >= startDate) {
                    onEndDateChange(selected)
                } else {
                    // Kalau klik di luar range kiri → jadikan start baru
                    onStartDateChange(selected)
                }
            }
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
        return (
            (startDate && date.toDateString() === startDate.toDateString()) ||
            (endDate && date.toDateString() === endDate.toDateString())
        )
    }

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDay })

    return (
        <div className={`w-80 bg-white border-2 border-white/50 rounded-2xl shadow-1 p-5 ${className}`}>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className="p-2 hover:bg-[#0054A5]/10 rounded-lg transition-all"
                >
                    <ChevronLeft className="w-5 h-5 text-[#0054A5]" />
                </button>

                <span className="text-[#0054A5] font-bold text-lg">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>

                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className="p-2 hover:bg-[#0054A5]/10 rounded-lg transition-all"
                >
                    <ChevronRight className="w-5 h-5 text-[#0054A5]" />
                </button>
            </div>

            {/* DAYS HEADER */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="text-center text-xs font-bold text-[#0054A5] py-2">
                        {d}
                    </div>
                ))}
            </div>

            {/* CALENDAR GRID */}
            <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, idx) => <div key={idx} />)}

                {days.map((day) => {
                    const inRange = isDateInRange(day)
                    const hoverRange = isHoverInRange(day)
                    const selected = isDateSelected(day)

                    return (
                        <button
                            key={day}
                            onMouseEnter={() => setHoverDay(day)}
                            onMouseLeave={() => setHoverDay(null)}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                aspect-square rounded-lg text-sm font-semibold transition-all
                                ${selected
                                    ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow'
                                    : inRange
                                        ? 'bg-blue-200 text-[#0054A5]'
                                        : hoverRange
                                            ? 'bg-blue-100 text-[#0054A5]'
                                            : 'hover:bg-[#0054A5]/10 text-[#64748B] hover:text-[#0054A5]'
                                }
                            `}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>

            {endDate && (
                <button
                    onClick={onClose}
                    className="cursor-pointer mt-4 w-full py-2 bg-[#0054A5] text-white rounded-lg font-semibold hover:bg-[#003d7a] transition-all"
                >
                    Apply
                </button>
            )}
        </div>
    )
}

export default DateRangePicker
