import React from 'react'

interface StatusCardProps {
    icon: React.ReactNode
    iconBg: string
    title: string
    description: string
    showButton?: boolean
    buttonText?: string
    buttonHref?: string
    children?: React.ReactNode
}

export default function StatusCard({
    icon,
    iconBg,
    title,
    description,
    showButton = true,
    buttonText = "Go to Homepage",
    buttonHref = "/",
    children
}: StatusCardProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
            <div className="w-full max-w-lg bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-8 sm:p-10 relative">
                <div className="absolute left-1/2 -top-9 transform -translate-x-1/2">
                    <div className="w-50 h-17 border-2 bg-[#F8FAFC] backdrop-blur-xl border-white/40 rounded-full shadow-2 flex items-center justify-center">
                        <img src="/logo-bnccin2.svg" className="w-32" alt="Logo" />
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <div className={`w-20 h-20 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>{icon}</div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0054A5] mb-3">{title}</h1>
                    <p className="text-sm sm:text-base text-[#64748B] font-medium mb-8">{description}</p>
                    {children}
                    {showButton && (
                        <a href={buttonHref} className="inline-block w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white font-semibold text-base rounded-xl hover:shadow-3 transition-all duration-300">
                            {buttonText}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}