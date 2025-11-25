'use client'

import React from 'react'
import { LogOut } from 'lucide-react'

interface DashboardHeaderProps {
    onLogout: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
    return (
        <div className="flex items-center justify-between gap-4 sm:gap-0 mb-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#0054A5] mb-1">My Dashboard</h1>
                <p className="text-sm text-[#64748B]">Manage your links and QR codes</p>
            </div>

            <button onClick={onLogout} className="cursor-pointer min-h-11 lg:min-h-0 px-5 py-2 bg-white/15 backdrop-blur-xl border border-[#D3D3D3] rounded-full shadow-5 hover:shadow-7 transition-all duration-300 flex items-center gap-2 text-[#0054A5] font-semibold hover:border-[#0054A5]/30">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
    )
}

export default DashboardHeader