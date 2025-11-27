import { Request } from 'express'
import { Analytics } from '../../models/analytics'
import geoip from 'geoip-lite'
import { getClientIP, getUserIdentifier } from './rateLimitHelpers'

// convert negara code ke nama negara
const getCountryName = (countryCode: string): string => {
    if (!countryCode || countryCode === 'XX') return 'Unknown'
    
    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
        return regionNames.of(countryCode) || countryCode
    } catch {
        return countryCode
    }
}

// penamaan platform
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

// klo localhost
const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' || ip === '127.0.0.1' || ip?.startsWith('::ffff:127') || ip === 'unknown'
}

// geo lokasi data
const getGeoData = (ip: string) => {
    let usedIP = ip

    if (isLocalhostIP(ip) && process.env.NODE_ENV === 'development') {
        // usedIP = '91.160.93.4' // Prancis
        usedIP = '217.13.124.105' // Spanyol
        // usedIP = '63.116.61.253' // USA
        // usedIP = '116.50.29.50' // Indonesia
        // usedIP = '101.191.135.146' // Australia
    }
    
    const geo = geoip.lookup(usedIP)
    
    return {
        city: geo?.city || 'Unknown',
        countryCode: geo?.country || 'XX',
        country: getCountryName(geo?.country || 'XX'),
        usedIP
    }
}

// update date statistics
const updateDateStats = (analytics: any, today: string, isNewUser: boolean): void => {
    const dateStats = analytics.byDate.get(today) || { clicks: 0, uniqueUsers: 0 }
    dateStats.clicks += 1
    if (isNewUser) {
        dateStats.uniqueUsers += 1
    }
    analytics.byDate.set(today, dateStats)
}

// update region statistics
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

// update referrer statistics
const updateReferrerStats = (analytics: any, referrer: string, isNewUser: boolean): void => {
    const referrerStats = analytics.byReferrer.get(referrer) || { clicks: 0, uniqueUsers: 0 }
    referrerStats.clicks += 1
    if (isNewUser) {
        referrerStats.uniqueUsers += 1
    }
    analytics.byReferrer.set(referrer, referrerStats)
}


// analytics for link click
export const trackAnalytics = async (req: Request, linkId: string | unknown): Promise<void> => {
    try {
        const linkIdString = String(linkId)
        const today = new Date().toISOString().split('T')[0]
        
        const ip = getClientIP(req)
        const geoData = getGeoData(ip)
        
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