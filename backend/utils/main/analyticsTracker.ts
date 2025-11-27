import { Request } from 'express'
import { Analytics } from '../../models/analytics'
import { getClientIP, getUserIdentifier } from './rateLimitHelpers'
import axios from 'axios'

interface IPApiResponse {
    region?: string
    country?: string
    country_name?: string
    error?: boolean
    reason?: string
}

interface ReferrerInfo {
    source: string
    medium?: string
    campaign?: string
    rawDomain?: string
}

const ipCache = new Map<string, { data: IPApiResponse; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000

const platformPatterns: Array<{ pattern: RegExp; name: string }> = [
    { pattern: /instagram\.com$/i, name: 'Instagram' },
    { pattern: /facebook\.com$/i, name: 'Facebook' },
    { pattern: /fb\.com$/i, name: 'Facebook' },
    { pattern: /twitter\.com$/i, name: 'X (Twitter)' },
    { pattern: /x\.com$/i, name: 'X (Twitter)' },
    { pattern: /linkedin\.com$/i, name: 'LinkedIn' },
    { pattern: /whatsapp\.com$/i, name: 'WhatsApp' },
    { pattern: /wa\.me$/i, name: 'WhatsApp' },
    { pattern: /t\.me$/i, name: 'Telegram' },
    { pattern: /telegram\.(me|org)$/i, name: 'Telegram' },
    { pattern: /tiktok\.com$/i, name: 'TikTok' },
    { pattern: /youtube\.com$/i, name: 'YouTube' },
    { pattern: /youtu\.be$/i, name: 'YouTube' },
    { pattern: /reddit\.com$/i, name: 'Reddit' },
    { pattern: /pinterest\.com$/i, name: 'Pinterest' },
    { pattern: /discord\.(com|gg)$/i, name: 'Discord' },
    { pattern: /line\.me$/i, name: 'LINE' },
    { pattern: /google\.(com|co\.\w+)$/i, name: 'Google Search' },
    { pattern: /bing\.com$/i, name: 'Bing Search' },
    { pattern: /yahoo\.com$/i, name: 'Yahoo Search' },
    { pattern: /duckduckgo\.com$/i, name: 'DuckDuckGo' },
    { pattern: /baidu\.com$/i, name: 'Baidu' },
    { pattern: /yandex\.(ru|com)$/i, name: 'Yandex' },
    { pattern: /localhost$/i, name: 'localhost' },
]

const getBaseDomain = (hostname: string): string => {
    const parts = hostname.split('.')
    if (parts.length >= 2) {
        return parts.slice(-2).join('.')
    }
    return hostname
}

const detectPlatform = (hostname: string): string | null => {
    const cleanHostname = hostname.replace(/^www\./, '')
    const baseDomain = getBaseDomain(cleanHostname)
    
    for (const { pattern, name } of platformPatterns) {
        if (pattern.test(baseDomain) || pattern.test(cleanHostname)) {
            return name
        }
    }
    
    return null
}

const isSearchEngine = (platformName: string | null): boolean => {
    if (!platformName) return false
    const searchEngines = ['Google Search', 'Bing Search', 'Yahoo Search', 'DuckDuckGo', 'Baidu', 'Yandex']
    return searchEngines.includes(platformName)
}

const getReferrerInfo = (req: Request): ReferrerInfo => {
    const utmSource = req.query.utm_source as string
    const utmMedium = req.query.utm_medium as string
    const utmCampaign = req.query.utm_campaign as string
    
    if (utmSource) {
        return {
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign
        }
    }
    
    const refererHeader = req.get('referer') || req.get('referrer')
    
    if (!refererHeader) {
        return { source: 'Direct' }
    }
    
    try {
        const url = new URL(refererHeader)
        const hostname = url.hostname.replace(/^www\./, '')
        const platform = detectPlatform(hostname)
        
        if (platform) {
            return {
                source: platform,
                medium: isSearchEngine(platform) ? 'organic' : 'referral',
                rawDomain: hostname
            }
        }
        
        const baseDomain = getBaseDomain(hostname)
        return {
            source: baseDomain,
            medium: 'referral',
            rawDomain: hostname
        }
        
    } catch {
        return { source: 'Direct' }
    }
}

const getDetailedReferrer = (req: Request): string => {
    const info = getReferrerInfo(req)
    
    if (info.campaign) {
        return `${info.source} (${info.campaign})`
    }
    
    if (info.medium && info.medium !== 'referral') {
        return `${info.source} (${info.medium})`
    }
    
    return info.source
}

const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' || ip === '127.0.0.1' || ip?.startsWith('::ffff:127') || ip === 'unknown'
}

const getGeoData = async (ip: string) => {
    let usedIP = ip

    if (isLocalhostIP(ip) && process.env.NODE_ENV === 'development') {
        usedIP = '217.13.124.105'
    }
    
    const cached = ipCache.get(usedIP)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        const { data } = cached
        return {
            city: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            usedIP
        }
    }

    try {
        const response = await axios.get<IPApiResponse>(
            `https://ipapi.co/${usedIP}/json/`,
            { 
                timeout: 3000,
                headers: {
                    'User-Agent': 'axios/1.0'
                }
            }
        )

        const data = response.data

        if (data.error) {
            console.warn(`IP API error for ${usedIP}:`, data.reason)
            return {
                city: 'Unknown',
                country: 'Unknown',
                usedIP
            }
        }

        ipCache.set(usedIP, {
            data,
            timestamp: Date.now()
        })

        return {
            city: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            usedIP
        }
    } catch (error) {
        console.error(`Failed to get geo data for ${usedIP}:`, error)
        
        return {
            city: 'Unknown',
            country: 'Unknown',
            usedIP
        }
    }
}

const updateDateStats = (analytics: any, today: string, isNewUser: boolean): void => {
    const dateStats = analytics.byDate.get(today) || { clicks: 0, uniqueUsers: 0 }
    dateStats.clicks += 1
    if (isNewUser) {
        dateStats.uniqueUsers += 1
    }
    analytics.byDate.set(today, dateStats)
}

const updateRegionStats = (
    analytics: any, 
    country: string, 
    city: string, 
    isNewUser: boolean
): void => {
    const regionStats = analytics.byRegion.get(country) || {
        country,
        clicks: 0,
        uniqueUsers: 0,
        cities: new Map()
    }
    
    regionStats.clicks += 1
    if (isNewUser) {
        regionStats.uniqueUsers += 1
    }

    const cityStats = regionStats.cities.get(city) || { clicks: 0, uniqueUsers: 0 }
    cityStats.clicks += 1
    if (isNewUser) {
        cityStats.uniqueUsers += 1
    }
    regionStats.cities.set(city, cityStats)
    
    analytics.byRegion.set(country, regionStats)
}

const updateReferrerStats = (analytics: any, referrer: string, isNewUser: boolean): void => {
    const referrerStats = analytics.byReferrer.get(referrer) || { clicks: 0, uniqueUsers: 0 }
    referrerStats.clicks += 1
    if (isNewUser) {
        referrerStats.uniqueUsers += 1
    }
    analytics.byReferrer.set(referrer, referrerStats)
}

export const trackAnalytics = async (req: Request, linkId: string | unknown): Promise<void> => {
    try {
        const linkIdString = String(linkId)
        const today = new Date().toISOString().split('T')[0]
        
        const ip = getClientIP(req)
        const geoData = await getGeoData(ip)
        
        const userIdentifier = getUserIdentifier(
            req, 
            isLocalhostIP(ip) && process.env.NODE_ENV === 'development' ? geoData.usedIP : undefined
        )
        
        const referrer = getDetailedReferrer(req)

        let analytics = await Analytics.findOne({ linkId: linkIdString })
        
        if (!analytics) {
            analytics = await Analytics.create({
                linkId: linkIdString,
                totalClicks: 0,
                uniqueUsers: [],
                byDate: new Map(),
                byRegion: new Map(),
                byReferrer: new Map()
            })
        }

        const isNewUser = !analytics.uniqueUsers.includes(userIdentifier)
        
        analytics.totalClicks += 1
        if (isNewUser) analytics.uniqueUsers.push(userIdentifier)

        updateDateStats(analytics, today, isNewUser)
        updateRegionStats(analytics, geoData.country, geoData.city, isNewUser)
        updateReferrerStats(analytics, referrer, isNewUser)

        await analytics.save()
    } catch (error) {
        throw error
    }
}

export const clearIPCache = (): void => {
    ipCache.clear()
    console.log('IP cache cleared')
}