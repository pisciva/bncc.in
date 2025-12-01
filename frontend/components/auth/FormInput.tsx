'use client'

import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

type InputFieldProps = {
    label?: string
    type?: string
    placeholder?: string
    icon?: string
    maxLength?: number
    showPasswordToggle?: boolean
    showPassword?: boolean
    setShowPassword?: (v: boolean) => void
    error?: string
    register: any
    name: string
    rules?: object
}

export const InputField = ({
    label,
    type = 'text',
    placeholder,
    icon,
    maxLength,
    showPasswordToggle = false,
    showPassword,
    setShowPassword,
    error,
    register,
    name,
    rules,
}: InputFieldProps) => {
    const inputProps = register(name, rules)
    const hasValue = inputProps.value && inputProps.value.length > 0

    return (
        <div className={`w-full mt-2 ${error ? 'mt-2' : 'mt-4'}`}>
            {label && (
                <label className="font-semibold text-sm lg:text-base text-[#0054A5] block mb-2">{label}</label>
            )}

            <div className="relative">
                {icon && (
                    <img src={icon} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 z-10" alt="" />
                )}

                <input
                    type={type === 'password' && showPasswordToggle ? showPassword ? 'text' : 'password' : type}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    {...inputProps}
                    className={`w-full h-12 lg:h-14 rounded-lg ${icon ? 'pl-12 lg:pl-14' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} bg-white/10 backdrop-blur-xl border transition-all duration-300 shadow-5 text-[#0054A5] font-medium text-md lg:text-base placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:shadow-6 focus:scale-[1.005]
                        ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[#D3D3D3] focus:border-[#0054A5]/30'} ${hasValue ? 'bg-white/15' : ''}`}
                />

                {showPasswordToggle && setShowPassword && (
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#64748B] hover:text-[#0054A5] transition-colors z-10"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {error && (
                <p className="lg:mb-2 text-xs sm:text-sm text-red-500 mt-1 ml-1 animate-slideDown">{error}</p>
            )}
        </div>
    )
}