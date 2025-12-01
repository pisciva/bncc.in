import { Analytics } from '../../models/analytics'
import { Link } from '../../models/link'

interface StatsData {
    clicks: number
    uniqueUsers: number
}

interface RegionStats {
    countries: Record<string, StatsData>
    cities: Record<string, StatsData>
}

interface AnalyticsData {
    linkId: string
    totalClicks: number
    uniqueUsers: number
    byDate: Record<string, StatsData>
    byCity: Record<string, StatsData>
    byCountry: Record<string, StatsData>
    byReferrer: Record<string, StatsData>
}

export const getUserId = (user: any): string | null => {
    if (!user) return null
    return user.userId || user.id || user._doc?.userId || user._doc?.id || null
}

export const verifyLinkOwnership = async (
    linkId: string, 
    userId: string
): Promise<any> => {
    try {
        const link = await Link.findOne({ _id: linkId, userId }).lean()
        return link
    } catch (error) {
        return null
    }
}

export const getOrCreateAnalytics = async (linkId: string): Promise<any> => {
    let analytics = await Analytics.findOne({ linkId })
    if (!analytics) {
        analytics = await Analytics.create({
            linkId,
            totalClicks: 0,
            uniqueUsers: [],
            byDate: new Map(),
            byRegion: new Map(),
            byReferrer: new Map()
        })
    }
    return analytics
}

const mapToObject = (map: any): Record<string, any> => {
    if (!map) return {}
    if (typeof map === 'object' && !(map instanceof Map)) return map
    if (map instanceof Map) {
        const obj: Record<string, any> = {}
        map.forEach((value: any, key: string) => {
            obj[key] = value
        })
        return obj
    }
    
    return {}
}

const processDateStats = (byDate: any): Record<string, StatsData> => {
    const dateObj = mapToObject(byDate)
    const result: Record<string, StatsData> = {}

    for (const [date, stats] of Object.entries(dateObj)) {
        const typedStats = stats as any
        result[date] = {
            clicks: typedStats.clicks || 0,
            uniqueUsers: typedStats.uniqueUsers || 0
        }
    }
    
    return result
}

const processRegionStats = (byRegion: any): RegionStats => {
    const regionObj = mapToObject(byRegion)
    const countries: Record<string, StatsData> = {}
    const cities: Record<string, StatsData> = {}
    
    for (const [countryCode, stats] of Object.entries(regionObj)) {
        const typedStats = stats as any
        const countryName = typedStats.country || countryCode
        
        countries[countryName] = {
            clicks: typedStats.clicks || 0,
            uniqueUsers: typedStats.uniqueUsers || 0
        }
        
        const citiesMap = mapToObject(typedStats.cities)
        for (const [city, cityStats] of Object.entries(citiesMap)) {
            const typedCityStats = cityStats as any
            cities[city] = {
                clicks: typedCityStats.clicks || 0,
                uniqueUsers: typedCityStats.uniqueUsers || 0
            }
        }
    }
    
    return { countries, cities }
}

const processReferrerStats = (byReferrer: any): Record<string, StatsData> => {
    const referrerObj = mapToObject(byReferrer)
    const result: Record<string, StatsData> = {}
    
    for (const [referrer, stats] of Object.entries(referrerObj)) {
        const typedStats = stats as any
        result[referrer] = {
            clicks: typedStats.clicks || 0,
            uniqueUsers: typedStats.uniqueUsers || 0
        }
    }
    
    return result
}

export const transformAnalyticsData = (analytics: any): AnalyticsData => {
    const analyticsObj = analytics.toObject ? analytics.toObject() : analytics
    const byDate = processDateStats(analyticsObj.byDate)
    const { countries, cities } = processRegionStats(analyticsObj.byRegion)
    const byReferrer = processReferrerStats(analyticsObj.byReferrer)
    
    return {
        linkId: String(analyticsObj.linkId),
        totalClicks: analyticsObj.totalClicks || 0,
        uniqueUsers: analyticsObj.uniqueUsers?.length || 0,
        byDate,
        byCity: cities,
        byCountry: countries,
        byReferrer
    }
}