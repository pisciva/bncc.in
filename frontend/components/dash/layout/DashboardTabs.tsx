'use client'

import React from 'react'
import { TabType, Tab } from '@/types/dashboard'

interface DashboardTabsProps {
    tabs: Tab[]
    activeTab: TabType
    onTabChange: (tab: TabType) => void
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
    tabs,
    activeTab,
    onTabChange
}) => {
    return (
        <div className="relative inline-flex w-full lg:w-80 rounded-full bg-white/15 backdrop-blur-xl border border-[#D3D3D3] p-1">
            <div className={`absolute top-1 bottom-1 transition-all duration-300 ease-in-out bg-gradient-to-br from-[#0054A5] to-[#003d7a] rounded-full ${activeTab === "links" ? "left-1 w-[calc(50%-0.25rem)]" : "left-[calc(50%+0.125rem)] w-[calc(50%-0.25rem)]"}`} />

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as TabType)}
                    className={`z-10 flex-1 py-2.5 font-semibold text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all ${activeTab === tab.id ? "text-white" : "text-[#0054A5]"}`}
                >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-white/20" : "bg-[#0054A5]/10"}`}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    )
}

export default DashboardTabs