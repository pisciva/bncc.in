import React from 'react'

interface CodeInputProps {
    code: string[]
    setCode: (code: string[]) => void
    disabled: boolean
    onSubmit: () => void
}

export default function CodeInput({ code, setCode, disabled, onSubmit }: CodeInputProps) {
    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value
        setCode(newCode)

        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus()
        }
    }

    React.useEffect(() => {
        if (code.every(c => c !== '') && !disabled) {
            onSubmit()
        }
    }, [code])

    return (
        <div className="flex gap-2 sm:gap-3 justify-center">
            {code.map((digit, index) => (
                <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    className="w-11 h-11 sm:w-15 sm:h-15 text-center text-lg md:text-2xl font-bold rounded-xl bg-white/10 backdrop-blur-xl border border-[#D3D3D3] shadow-5 text-[#0054A5] focus:outline-none focus:border-[#0054A5]/30 focus:shadow-6 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
            ))}
        </div>
    )
}