'use client'

import React, { useRef, useEffect } from 'react'

type ProtectedCodeProps = {
    code: string[]
    setCode: React.Dispatch<React.SetStateAction<string[]>>
    errorMessage?: string
}

export default function ProtectedCode({
    code,
    setCode,
    errorMessage = '',
}: ProtectedCodeProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (code.every(digit => digit === '')) {
            setTimeout(() => inputRefs.current[0]?.focus(), 100)
        }
    }, [code])

    const handleCodeChange = (val: string, idx: number) => {
        if (!/^\d?$/.test(val)) return
        const newCode = [...code]
        newCode[idx] = val
        setCode(newCode)

        if (val && idx < code.length - 1) {
            inputRefs.current[idx + 1]?.focus()
        }
    }

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace' && !code[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus()
        }
    }

    return (
        <div className="flex flex-col">
            <label className="italic text-sm text-[#64748B] font-medium mb-3">
                Protect your link with a PIN
            </label>

            <div className="flex justify-between gap-1">
                {code.map((digit, idx) => (
                    <input
                        key={idx}
                        ref={(el) => { inputRefs.current[idx] = el }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(e.target.value, idx)}
                        onKeyDown={(e) => handleBackspace(e, idx)}
                        className={`w-12 h-12 lg:w-14 lg:h-14 text-center text-lg font-semibold text-[#0054A5] bg-white/10 backdrop-blur-xl  border transition-all duration-300 rounded-xl shadow-5 focus:scale-105 focus:shadow-6 focus:outline-none
                            ${errorMessage 
                                ? 'border-red-500/50 focus:border-red-500' 
                                : digit 
                                    ? 'border-[#0054A5]/30 bg-white/15' 
                                    : 'border-[#D3D3D3] focus:border-[#0054A5]/30'
                            }
                            ${digit ? 'animate-pop' : ''}
                        `}
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                ))}
            </div>

            {errorMessage && (
                <p className="text-red-500 text-sm mt-2 animate-slideDown">{errorMessage}</p>
            )}
        </div>
    )
}