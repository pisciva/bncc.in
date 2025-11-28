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

const ipCache = new Map<string, { data: IPApiResponse; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000

const ID_POPULAR_SOURCES: Record<string, string> = {
    instagram: 'Instagram',
    facebook: 'Facebook',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    tiktok: 'TikTok',
    twitter: 'X',
    x: 'X',
    youtube: 'YouTube',
    line: 'LINE',
    google: 'Google',
    gmail: 'Gmail'
}

const detectUserAgentSource = (userAgent: string): string => {
    const ua = userAgent.toLowerCase()
    if (ua.includes('instagram')) return 'Instagram'
    if (ua.includes('fban') || ua.includes('fbav') || ua.includes('facebook')) return 'Facebook'
    if (ua.includes('whatsapp')) return 'WhatsApp'
    if (ua.includes('telegram')) return 'Telegram'
    if (ua.includes('tiktok') || ua.includes('musical_ly')) return 'TikTok'
    if (ua.includes('twitter')) return 'X'
    if (ua.includes('youtube')) return 'YouTube'
    if (ua.includes('line')) return 'LINE'
    if (ua.includes('google')) return 'Google'
    if (ua.includes('gmail')) return 'Gmail'
    return 'Other'
}

const normalize = (val: string): string => {
    const v = val.toLowerCase().trim()
    return ID_POPULAR_SOURCES[v] || 'Other'
}

const parseReferrer = (ref: string): string => {
    try {
        const hostname = new URL(ref).hostname.replace(/^www\./, '').toLowerCase()

        const domainMap: Record<string, string> = {
            'instagram.com': 'Instagram',
            'facebook.com': 'Facebook',
            'fb.com': 'Facebook',
            'l.facebook.com': 'Facebook',
            'wa.me': 'WhatsApp',
            'web.whatsapp.com': 'WhatsApp',
            'api.whatsapp.com': 'WhatsApp',
            't.me': 'Telegram',
            'telegram.me': 'Telegram',
            'tiktok.com': 'TikTok',
            'vm.tiktok.com': 'TikTok',
            'twitter.com': 'X',
            'x.com': 'X',
            't.co': 'X',
            'youtube.com': 'YouTube',
            'youtu.be': 'YouTube',
            'line.me': 'LINE',
            'google.com': 'Google',
            'google.co.id': 'Google',
            'mail.google.com': 'Gmail'
        }

        if (domainMap[hostname]) return domainMap[hostname]

        return 'Other'
    } catch {
        return 'Other'
    }
}

const getReferrerSource = (req: Request): string => {
    const param = req.query['ref'] || req.query['source'] || req.query['utm_source']
    if (typeof param === 'string') return normalize(param)

    const uaSource = detectUserAgentSource(req.get('user-agent') || '')
    if (uaSource !== 'Other') return uaSource

    const header = req.get('referer') || req.get('referrer')
    if (header) return parseReferrer(header)

    return 'Other'
}

const isLocalhostIP = (ip: string): boolean => {
    return ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127') || ip === 'unknown'
}

const getGeoData = async (ip: string) => {
    let usedIP = ip
    if (isLocalhostIP(ip) && process.env.NODE_ENV === 'development') {
        usedIP = '217.13.124.105'
    }

    const cached = ipCache.get(usedIP)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return {
            city: cached.data.region || 'Unknown',
            country: cached.data.country_name || 'Unknown',
            usedIP
        }
    }

    try {
        const response = await axios.get<IPApiResponse>(`https://ipapi.co/${usedIP}/json/`, { timeout: 3000 })
        const data = response.data

        ipCache.set(usedIP, { data, timestamp: Date.now() })

        return {
            city: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            usedIP
        }
    } catch {
        return {
            city: 'Unknown',
            country: 'Unknown',
            usedIP
        }
    }
}

const updateDateStats = (analytics: any, today: string, isNewUser: boolean): void => {
    const dateStats = analytics.byDate.get(today) || { clicks: 0, uniqueUsers: 0 }
    dateStats.clicks++
    if (isNewUser) dateStats.uniqueUsers++
    analytics.byDate.set(today, dateStats)
}

const updateRegionStats = (analytics: any, country: string, city: string, isNewUser: boolean): void => {
    const regionStats = analytics.byRegion.get(country) || {
        country,
        clicks: 0,
        uniqueUsers: 0,
        cities: new Map()
    }

    regionStats.clicks++
    if (isNewUser) regionStats.uniqueUsers++

    const cityStats = regionStats.cities.get(city) || { clicks: 0, uniqueUsers: 0 }
    cityStats.clicks++
    if (isNewUser) cityStats.uniqueUsers++
    regionStats.cities.set(city, cityStats)

    analytics.byRegion.set(country, regionStats)
}

const updateReferrerStats = (analytics: any, referrer: string, isNewUser: boolean): void => {
    const stats = analytics.byReferrer.get(referrer) || { clicks: 0, uniqueUsers: 0 }
    stats.clicks++
    if (isNewUser) stats.uniqueUsers++
    analytics.byReferrer.set(referrer, stats)
}

export const trackAnalytics = async (req: Request, linkId: string | unknown): Promise<void> => {
    const linkIdString = String(linkId)
    const today = new Date().toISOString().split('T')[0]

    const ip = getClientIP(req)
    const geo = await getGeoData(ip)
    const userIdentifier = getUserIdentifier(req)
    const referrer = getReferrerSource(req)

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

    analytics.totalClicks++
    if (isNewUser) analytics.uniqueUsers.push(userIdentifier)

    updateDateStats(analytics, today, isNewUser)
    updateRegionStats(analytics, geo.country, geo.city, isNewUser)
    updateReferrerStats(analytics, referrer, isNewUser)

    await analytics.save()
}

export const clearIPCache = (): void => {
    ipCache.clear()
}
