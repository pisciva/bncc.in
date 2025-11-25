export interface AnalyticsData {
    totalClicks: number
    uniqueUsers: number
    byDate: Record<string, { clicks: number, uniqueUsers: number }>
    byCity: Record<string, { clicks: number, uniqueUsers: number }>
    byCountry: Record<string, { clicks: number, uniqueUsers: number }>
    byReferrer: Record<string, { clicks: number, uniqueUsers: number }>
}

export type AnalyticsView = 'clicks' | 'users'
export type ChartType = 'time' | 'region' | 'referrer'