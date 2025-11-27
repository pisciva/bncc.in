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

const getReferrerDomain = (refererHeader: string | undefined): string => {
    if (!refererHeader) return 'Direct'
    
    try {
        const url = new URL(refererHeader)
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
        
        const socialMediaPatterns = [
            { pattern: /instagram\.com/, name: 'Instagram' },
            { pattern: /^(facebook\.com|fb\.com|fb\.me|m\.facebook\.com)/, name: 'Facebook' },
            { pattern: /^(twitter\.com|x\.com|t\.co|mobile\.twitter\.com)/, name: 'X (Twitter)' },
            { pattern: /linkedin\.com/, name: 'LinkedIn' },
            { pattern: /^(wa\.me|web\.whatsapp\.com|api\.whatsapp\.com|chat\.whatsapp\.com)/, name: 'WhatsApp' },
            { pattern: /^(t\.me|telegram\.me|telegram\.org|web\.telegram\.org)/, name: 'Telegram' },
            { pattern: /tiktok\.com/, name: 'TikTok' },
            { pattern: /^(youtube\.com|youtu\.be|m\.youtube\.com|music\.youtube\.com)/, name: 'YouTube' },
            { pattern: /reddit\.com/, name: 'Reddit' },
            { pattern: /pinterest\.com/, name: 'Pinterest' },
            { pattern: /^(discord\.com|discord\.gg|discordapp\.com)/, name: 'Discord' },
            { pattern: /^(line\.me|line\.naver\.jp)/, name: 'LINE' },
            { pattern: /snapchat\.com/, name: 'Snapchat' },
            { pattern: /twitch\.tv/, name: 'Twitch' },
            { pattern: /tumblr\.com/, name: 'Tumblr' },
            { pattern: /vk\.com/, name: 'VK' },
            { pattern: /weibo\.com/, name: 'Weibo' },
            { pattern: /wechat\.com/, name: 'WeChat' },
            { pattern: /qzone\.qq\.com/, name: 'Qzone' },
            { pattern: /threads\.net/, name: 'Threads' },
            { pattern: /medium\.com/, name: 'Medium' },
            { pattern: /quora\.com/, name: 'Quora' },
            { pattern: /slack\.com/, name: 'Slack' },
            { pattern: /whatsapp\.com/, name: 'WhatsApp' }
        ]
        
        for (const { pattern, name } of socialMediaPatterns) {
            if (pattern.test(hostname)) return name
        }
        
        const searchEnginePatterns = [
            { pattern: /^(google\.|www\.google\.)/, name: 'Google Search' },
            { pattern: /bing\.com/, name: 'Bing Search' },
            { pattern: /yahoo\.com/, name: 'Yahoo Search' },
            { pattern: /duckduckgo\.com/, name: 'DuckDuckGo' },
            { pattern: /baidu\.com/, name: 'Baidu' },
            { pattern: /yandex\./, name: 'Yandex' },
            { pattern: /ask\.com/, name: 'Ask.com' },
            { pattern: /aol\.com/, name: 'AOL Search' },
            { pattern: /ecosia\.org/, name: 'Ecosia' }
        ]
        
        for (const { pattern, name } of searchEnginePatterns) {
            if (pattern.test(hostname)) return name
        }
        
        const emailPatterns = [
            { pattern: /^(mail\.|outlook\.|gmail\.)/, name: 'Email' },
            { pattern: /webmail\./, name: 'Email' }
        ]
        
        for (const { pattern, name } of emailPatterns) {
            if (pattern.test(hostname)) return name
        }
        
        if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
            return 'localhost'
        }
        
        if (url.searchParams.has('utm_source')) {
            const utmSource = url.searchParams.get('utm_source')
            if (utmSource) return `UTM: ${utmSource}`
        }
        
        return hostname
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