'use client'

import React from 'react'

type FormInputProps = {
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label?: string
    error?: boolean
    errorMessage?: string
    prefix?: string
    className?: string
    maxLength?: number
}

export default function FormInput({
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    error,
    errorMessage,
    prefix,
    className,
    maxLength
}: FormInputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="font-semibold text-sm lg:text-base text-[#0054A5] block mb-2">
                    {label}
                </label>
            )}

            <div className="flex items-center space-x-2">
                {prefix && (
                    <span className="py-2.5 bg-white/10 backdrop-blur-xl  text-[#64748B] font-semibold ">
                        {prefix}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`h-11 lg:h-14 flex-1 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-xl prefix border transition-all duration-300 shadow-5 text-[#0054A5] font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:shadow-30 focus:scale-[1.005] ${error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-[#D3D3D3] focus:border-[#0054A5]/30'} ${value ? 'bg-white/15' : ''} ${className || ''}`}
                />
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 mt-2 ml-1 animate-slideDown">{errorMessage}</p>
            )}
        </div>
    )
}