'use client'

import React from 'react'

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
        </div>
    )
}

export default DashboardHeader