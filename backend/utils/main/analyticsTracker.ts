import { Request } from 'express'
import { Analytics } from '../../models/analytics'
import { getClientIP, getUserIdentifier } from './rateLimitHelpers'
import axios from 'axios'

interface IPApiResponse {
    city?: string
    country?: string
    country_code?: string
    error?: boolean
    reason?: string
}

const ipCache = new Map<string, { data: IPApiResponse; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 

const getCountryName = (countryCode: string): string => {
    if (!countryCode || countryCode === 'XX') return 'Unknown'
    
    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
        return regionNames.of(countryCode) || countryCode
    } catch {
        return countryCode
    }
}

const getReferrerDomain = (refererHeader: string | undefined): string => {
    if (!refererHeader) return 'Direct'
    
    try {
        const url = new URL(refererHeader)
        const domain = url.hostname.replace('www.', '')
        
        const platformMap: Record<string, string> = {
            'instagram.com': 'Instagram',
            'facebook.com': 'Facebook',
            'fb.com': 'Facebook',
            'twitter.com': 'X (Twitter)',
            'x.com': 'X (Twitter)',
            'linkedin.com': 'LinkedIn',
            'wa.me': 'WhatsApp',
            'web.whatsapp.com': 'WhatsApp',
            'api.whatsapp.com': 'WhatsApp',
            't.me': 'Telegram',
            'telegram.me': 'Telegram',
            'tiktok.com': 'TikTok',
            'youtube.com': 'YouTube',
            'youtu.be': 'YouTube',
            'reddit.com': 'Reddit',
            'pinterest.com': 'Pinterest',
            'discord.com': 'Discord',
            'line.me': 'LINE',
            'google.com': 'Google Search',
            'bing.com': 'Bing Search',
            'yahoo.com': 'Yahoo Search',
            'localhost': 'localhost'
        }
        
        return platformMap[domain] || 'Other'
    } catch {
        return 'Direct'
    }
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
            city: data.city || 'Unknown',
            countryCode: data.country_code || 'XX',
            country: data.country || getCountryName(data.country_code || 'XX'),
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
                countryCode: 'XX',
                country: 'Unknown',
                usedIP
            }
        }

        ipCache.set(usedIP, {
            data,
            timestamp: Date.now()
        })

        return {
            city: data.city || 'Unknown',
            countryCode: data.country_code || 'XX',
            country: data.country || getCountryName(data.country_code || 'XX'),
            usedIP
        }
    } catch (error) {
        console.error(`Failed to get geo data for ${usedIP}:`, error)
        
        return {
            city: 'Unknown',
            countryCode: 'XX',
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
    countryCode: string, 
    country: string, 
    city: string, 
    isNewUser: boolean
): void => {
    const regionStats = analytics.byRegion.get(countryCode) || {
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
    
    analytics.byRegion.set(countryCode, regionStats)
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
        
        const referrer = getReferrerDomain(req.get('referer') || req.get('referrer'))

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
        updateRegionStats(analytics, geoData.countryCode, geoData.country, geoData.city, isNewUser)
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