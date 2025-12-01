'use client'

import React, { useState, useRef, useEffect } from 'react'
import { formatDuration } from '@/utils/formatDuration'
import { Calendar, ChevronDown } from 'lucide-react'

type ExpirationDateProps = {
    expirationDate: string
    setExpirationDate: (value: string) => void
    errorMessage?: string
}

export default function ExpirationDate({
    expirationDate,
    setExpirationDate,
    errorMessage = '',
}: ExpirationDateProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        expirationDate ? new Date(expirationDate) : null
    )
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [showMonthPicker, setShowMonthPicker] = useState(false)
    const [showYearPicker, setShowYearPicker] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const minDate = new Date(Date.now() + 864e5)
    minDate.setHours(0, 0, 0, 0)

    const currentYear = new Date().getFullYear()
    const currentMonthNum = new Date().getMonth()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setShowMonthPicker(false)
                setShowYearPicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        return { firstDay, daysInMonth }
    }

    const handleDateSelect = (day: number) => {
        const d = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
        )

        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')

        const formatted = `${yyyy}-${mm}-${dd}`

        setSelectedDate(d)
        setExpirationDate(formatted)
        setIsOpen(false)
    }

    const handleMonthChange = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1))
    }

    const handleMonthSelect = (monthIndex: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1))
        setShowMonthPicker(false)
    }

    const handleYearSelect = (year: number) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
        setShowYearPicker(false)
    }

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        date.setHours(0, 0, 0, 0)
        const compareMinDate = new Date(minDate)
        compareMinDate.setHours(0, 0, 0, 0)
        return date < compareMinDate
    }

    const isToday = (day: number) => {
        const today = new Date()
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        )
    }

    const isSelected = (day: number) => {
        if (!selectedDate) return false
        return (
            day === selectedDate.getDate() &&
            currentMonth.getMonth() === selectedDate.getMonth() &&
            currentMonth.getFullYear() === selectedDate.getFullYear()
        )
    }

    const formatDisplayDate = () => {
        if (!selectedDate) return 'Select date'
        return selectedDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const years = Array.from({ length: 30 }, (_, i) => currentYear + i)

    const isMonthDisabled = (monthIndex: number) => {
        if (currentMonth.getFullYear() === currentYear) {
            return monthIndex < currentMonthNum
        }
        return false
    }

    return (
        <div className="flex flex-col">
            <label className="italic text-xs sm:text-sm text-[#64748B] font-medium mb-3">
                Auto-disable your link at a set time.
            </label>

            <div className="flex flex-col lg:flex-row lg:items-center w-full gap-3 lg:gap-4">
                <div ref={containerRef} className="relative w-full lg:w-80">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg h-12 bg-white/15 backdrop-blur-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${errorMessage
                            ? 'border-red-500/50 hover:border-red-500' : 'border-[#D3D3D3]'}`}
                    >
                        <span className={`text-sm font-medium ${selectedDate ? 'text-[#0054A5]' : 'text-gray-400'}`}>
                            {formatDisplayDate()}
                        </span>
                        <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-[#0054A5]" />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full mt-2 left-0 right-0 lg:left-0 lg:right-auto z-50 lg:w-80 bg-white border-2 border-white/30 rounded-2xl shadow-1 p-3 sm:p-4 animate-fadeIn">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleMonthChange(-1)}
                                    className="cursor-pointer p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
                                >
                                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#0054A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-2">
                                    <button className="cursor-pointer py-1 hover:bg-white/20 rounded-lg transition-all duration-300 flex items-center gap-1"
                                        type="button"
                                        onClick={() => {
                                            setShowMonthPicker(!showMonthPicker)
                                            setShowYearPicker(false)
                                        }}
                                    >
                                        <span className="text-[#0054A5] font-bold text-sm sm:text-base">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                                        </span>
                                    </button>

                                    <button className="cursor-pointer py-1 hover:bg-white/20 rounded-lg transition-all duration-300 flex items-center gap-1"
                                        type="button"
                                        onClick={() => {
                                            setShowYearPicker(!showYearPicker)
                                            setShowMonthPicker(false)
                                        }}
                                    >
                                        <span className="text-[#0054A5] font-bold text-sm sm:text-base">
                                            {currentMonth.getFullYear()}
                                        </span>
                                    </button>
                                </div>

                                <button className="cursor-pointer p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all duration-300"
                                    type="button"
                                    onClick={() => handleMonthChange(1)}
                                >
                                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[#0054A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {showMonthPicker && (
                                <div className="grid grid-cols-3 gap-2 mb-3 animate-fadeIn">
                                    {months.map((month, index) => {
                                        const disabled = isMonthDisabled(index)
                                        return (
                                            <button
                                                key={month}
                                                type="button"
                                                onClick={() => !disabled && handleMonthSelect(index)}
                                                disabled={disabled}
                                                className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${disabled
                                                    ? 'text-gray-400 cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/30'}
                                                    ${currentMonth.getMonth() === index ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow-26' : 'text-[#0054A5]'}`}
                                            >
                                                {month.slice(0, 3)}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {showYearPicker && (
                                <div className="year-scroll grid grid-cols-3 gap-2 mb-3 max-h-48 overflow-y-auto animate-fadeIn">
                                    {years.map((year) => (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => handleYearSelect(year)}
                                            className={`px-2 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer hover:bg-white/30
                                                ${currentMonth.getFullYear() === year ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow-26' : 'text-[#0054A5]'}`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!showMonthPicker && !showYearPicker && (
                                <>
                                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                            <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-[#0054A5] py-1 sm:py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                                        {emptyDays.map((_, index) => (
                                            <div key={`empty-${index}`} />
                                        ))}
                                        {days.map((day) => {
                                            const disabled = isDateDisabled(day)
                                            const today = isToday(day)
                                            const selected = isSelected(day)

                                            return (
                                                <button
                                                    type="button"
                                                    key={day}
                                                    onClick={() => !disabled && handleDateSelect(day)}
                                                    disabled={disabled}
                                                    className={`aspect-square rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${disabled
                                                        ? 'text-gray-400 cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-white/30 hover:scale-110'} ${selected
                                                            ? 'bg-gradient-to-br from-[#0054A5] to-[#003d7a] text-white shadow-26 scale-105' : today
                                                                ? 'bg-white/20 text-[#0054A5] font-bold border border-[#0054A5]/30' : 'text-[#0054A5]'
                                                        }
                                                    `}
                                                >
                                                    {day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {formatDuration(expirationDate) && !errorMessage && (
                    <div className="relative px-4 sm:px-5 py-2 sm:py-2.5 bg-white/15 backdrop-blur-xl border border-white/30 rounded-full shadow-7 animate-slideIn">
                        <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-white/30"></div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-[1px] w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[9px] border-r-white/15"></div>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-[#10B981] italic flex items-center gap-2 justify-center lg:justify-start">
                            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDuration(expirationDate)}
                        </p>
                    </div>
                )}
            </div>

            {errorMessage && (
                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-slideDown">{errorMessage}</p>
            )}
        </div>
    )
}