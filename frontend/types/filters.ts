export interface FilterState {
    dateFilter: 'all' | 'last7days' | 'last30days'
    customDateRange: { start: Date | null; end: Date | null }
    status: ('active' | 'inactive')[]
    access: ('public' | 'private')[]
    showLogo: boolean[]
}
