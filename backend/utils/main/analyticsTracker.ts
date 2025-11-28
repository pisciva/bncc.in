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

// ==========================================
// IMPROVED REFERRER DETECTION SYSTEM
// ==========================================

const getReferrerDomain = (req: Request): string => {
    // Priority 1: Check URL parameters (untuk tracking manual)
    const urlParams = ['ref', 'utm_source', 'source', 'from']
    for (const param of urlParams) {
        const value = req.query[param] as string
        if (value) {
            return normalizeReferrer(value)
        }
    }

    // Priority 2: Detect from User-Agent (in-app browsers)
    const userAgent = req.get('user-agent') || ''
    const appSource = detectAppFromUserAgent(userAgent)
    if (appSource !== 'Unknown') {
        return appSource
    }

    // Priority 3: Parse standard referrer header
    const refererHeader = req.get('referer') || req.get('referrer')
    if (refererHeader) {
        return parseReferrerUrl(refererHeader)
    }

    // Priority 4: Check custom headers
    const customHeaders = [
        req.get('x-referrer'),
        req.get('x-source'),
        req.get('x-forwarded-from')
    ]
    
    for (const header of customHeaders) {
        if (header) {
            return normalizeReferrer(header)
        }
    }

    // Default: Direct traffic
    return 'Direct'
}

// Deteksi platform dari User-Agent string
const detectAppFromUserAgent = (userAgent: string): string => {
    const ua = userAgent.toLowerCase()

    // Instagram in-app browser
    if (ua.includes('instagram')) return 'Instagram'
    
    // Facebook in-app browser (FBAN = Facebook App, FBAV = Facebook App Version)
    if (ua.includes('fban') || ua.includes('fbav') || ua.includes('fb_iab') || ua.includes('[fb')) {
        return 'Facebook'
    }
    
    // WhatsApp in-app browser
    if (ua.includes('whatsapp')) return 'WhatsApp'
    
    // TikTok in-app browser
    if (ua.includes('tiktok') || ua.includes('musical_ly') || ua.includes('bytedance')) {
        return 'TikTok'
    }
    
    // Twitter/X in-app browser
    if (ua.includes('twitter')) return 'X (Twitter)'
    
    // LinkedIn in-app browser
    if (ua.includes('linkedin')) return 'LinkedIn'
    
    // Telegram in-app browser
    if (ua.includes('telegram')) return 'Telegram'
    
    // LINE in-app browser
    if (ua.includes('line/')) return 'LINE'
    
    // Discord in-app browser
    if (ua.includes('discord')) return 'Discord'
    
    // Snapchat in-app browser
    if (ua.includes('snapchat')) return 'Snapchat'
    
    // Pinterest in-app browser
    if (ua.includes('pinterest')) return 'Pinterest'
    
    // Reddit in-app browser
    if (ua.includes('reddit')) return 'Reddit'
    
    // YouTube app
    if (ua.includes('youtube')) return 'YouTube'
    
    // WeChat in-app browser
    if (ua.includes('micromessenger')) return 'WeChat'
    
    // Threads app (Barcelona is internal codename)
    if (ua.includes('barcelona')) return 'Threads'
    
    // Slack in-app browser
    if (ua.includes('slack')) return 'Slack'

    return 'Unknown'
}

// Parse URL dari referrer header
const parseReferrerUrl = (refererHeader: string): string => {
    try {
        const url = new URL(refererHeader)
        const domain = url.hostname.replace(/^www\./, '').toLowerCase()
        
        const platformMap: Record<string, string> = {
            // Social Media - Main domains
            'instagram.com': 'Instagram',
            'l.instagram.com': 'Instagram',
            'facebook.com': 'Facebook',
            'fb.com': 'Facebook',
            'm.facebook.com': 'Facebook',
            'l.facebook.com': 'Facebook',
            'lm.facebook.com': 'Facebook',
            'fb.me': 'Facebook',
            'twitter.com': 'X (Twitter)',
            'x.com': 'X (Twitter)',
            't.co': 'X (Twitter)',
            'mobile.twitter.com': 'X (Twitter)',
            'linkedin.com': 'LinkedIn',
            'lnkd.in': 'LinkedIn',
            'tiktok.com': 'TikTok',
            'vt.tiktok.com': 'TikTok',
            'vm.tiktok.com': 'TikTok',
            'm.tiktok.com': 'TikTok',
            'youtube.com': 'YouTube',
            'youtu.be': 'YouTube',
            'm.youtube.com': 'YouTube',
            'reddit.com': 'Reddit',
            'redd.it': 'Reddit',
            'old.reddit.com': 'Reddit',
            'pinterest.com': 'Pinterest',
            'pin.it': 'Pinterest',
            'snapchat.com': 'Snapchat',
            'threads.net': 'Threads',
            
            // Messaging Apps
            'wa.me': 'WhatsApp',
            'chat.whatsapp.com': 'WhatsApp',
            'web.whatsapp.com': 'WhatsApp',
            'api.whatsapp.com': 'WhatsApp',
            't.me': 'Telegram',
            'telegram.me': 'Telegram',
            'telegram.org': 'Telegram',
            'web.telegram.org': 'Telegram',
            'discord.com': 'Discord',
            'discord.gg': 'Discord',
            'line.me': 'LINE',
            'liff.line.me': 'LINE',
            'web.wechat.com': 'WeChat',
            'slack.com': 'Slack',
            
            // Search Engines
            'google.com': 'Google',
            'google.co.id': 'Google',
            'google.co.uk': 'Google',
            'bing.com': 'Bing',
            'yahoo.com': 'Yahoo',
            'duckduckgo.com': 'DuckDuckGo',
            'baidu.com': 'Baidu',
            'yandex.com': 'Yandex',
            'yandex.ru': 'Yandex',
            
            // Email Clients
            'mail.google.com': 'Gmail',
            'outlook.live.com': 'Outlook',
            'outlook.office365.com': 'Outlook',
            'outlook.office.com': 'Outlook',
            'mail.yahoo.com': 'Yahoo Mail',
            
            // Development
            'localhost': 'Localhost',
            '127.0.0.1': 'Localhost'
        }
        
        // Check exact domain match
        if (platformMap[domain]) {
            return platformMap[domain]
        }
        
        // Check partial matches for subdomains
        for (const [key, value] of Object.entries(platformMap)) {
            if (domain.includes(key) || domain.endsWith(key)) {
                return value
            }
        }
        
        // Extract main domain name if not in map
        const domainParts = domain.split('.')
        const mainDomain = domainParts.length > 1 
            ? domainParts[domainParts.length - 2] 
            : domainParts[0]
        
        return capitalizeFirstLetter(mainDomain)
    } catch {
        return 'Direct'
    }
}

// Normalize referrer dari parameter atau custom input
const normalizeReferrer = (source: string): string => {
    const normalized = source.toLowerCase().trim()
    
    const sourceMap: Record<string, string> = {
        // Social Media shortcuts
        'ig': 'Instagram',
        'instagram': 'Instagram',
        'insta': 'Instagram',
        'fb': 'Facebook',
        'facebook': 'Facebook',
        'twitter': 'X (Twitter)',
        'x': 'X (Twitter)',
        'linkedin': 'LinkedIn',
        'li': 'LinkedIn',
        'tiktok': 'TikTok',
        'tt': 'TikTok',
        'youtube': 'YouTube',
        'yt': 'YouTube',
        'reddit': 'Reddit',
        'pinterest': 'Pinterest',
        'snapchat': 'Snapchat',
        'snap': 'Snapchat',
        'threads': 'Threads',
        
        // Messaging shortcuts
        'wa': 'WhatsApp',
        'whatsapp': 'WhatsApp',
        'telegram': 'Telegram',
        'tg': 'Telegram',
        'discord': 'Discord',
        'line': 'LINE',
        'wechat': 'WeChat',
        'slack': 'Slack',
        
        // Other sources
        'email': 'Email',
        'gmail': 'Gmail',
        'sms': 'SMS',
        'qr': 'QR Code',
        'qrcode': 'QR Code',
        'direct': 'Direct',
        'organic': 'Direct',
        'none': 'Direct',
        
        // Search engines
        'google': 'Google',
        'bing': 'Bing',
        'yahoo': 'Yahoo',
        'duckduckgo': 'DuckDuckGo'
    }
    
    return sourceMap[normalized] || capitalizeFirstLetter(source)
}

// Helper: Capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// ==========================================
// GEOLOCATION FUNCTIONS
// ==========================================

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

// ==========================================
// ANALYTICS UPDATE FUNCTIONS
// ==========================================

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

// ==========================================
// MAIN ANALYTICS TRACKING FUNCTION
// ==========================================

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
        
        // GUNAKAN FUNGSI BARU - kirim req object langsung
        const referrer = getReferrerDomain(req)

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