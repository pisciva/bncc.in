'use client'

import React from 'react'

export const FinishBanner: React.FC = () => {
    return (
        <div className="flex items-center justify-center mb-4 sm:mb-5 gap-2 sm:gap-3 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border-[1.5px] border-[#0054A5] bg-[#F1F5F9] box-shadow">
            <img src="/flash.svg" alt="" className="w-2.5 sm:w-3 drop-shadow-blue" />
            <div className="text-xs sm:text-sm font-medium text-[#06387E] text-shadow-blue">
                Finish in a secs!
            </div>
        </div>
    )
}

export const HeroTitle: React.FC = () => {
    return (
        <div className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-5 lg:mb-6 text-center px-2">
            <h1 className="text-[#06387E] text-shadow">Connect Everything</h1>
            <h1 className="text-[#0054A5] text-shadow">Fast and Easy.</h1>
        </div>
    )
}
