import { Request } from 'express'
import crypto from 'crypto'

interface AttemptData {
    attempts: number
    blockedUntil: number | null
    lastAttempt: number
}

interface BlockStatus {
    blocked: boolean
    blockedUntil?: number
    attempts?: number
}

interface IncrementResult {
    attempts: number
    blocked: boolean
    blockedUntil?: number
}

const attemptStore = new Map<string, AttemptData>()
const max_attempts = 5
const block_duration = 3 * 60 * 60 * 1000
const cleanup_duration = 24 * 60 * 60 * 1000 

// get ip address
export const getClientIP = (req: Request): string => {
    const xForwardedFor = req.headers['x-forwarded-for']
    const xRealIP = req.headers['x-real-ip']
    const cfConnectingIP = req.headers['cf-connecting-ip']
    
    if (typeof xForwardedFor === 'string') return xForwardedFor.split(',')[0].trim()
    if (typeof xRealIP === 'string') return xRealIP
    if (typeof cfConnectingIP === 'string') return cfConnectingIP
    
    return req.ip || req.socket.remoteAddress || ''
}

export const getClientId = (req: Request, customUrl: string): string => {
    const ip = getClientIP(req)
    return `${customUrl}_${ip}`
}

// create user hash
export const getUserIdentifier = (req: Request, simulatedIP?: string): string => {
    const ip = simulatedIP || getClientIP(req)
    const userAgent = req.get('user-agent') || ''
    return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex')
}

export const isBlocked = (clientId: string): BlockStatus => {
    const data = attemptStore.get(clientId)

    if (!data) return { blocked: false }

    if (data.blockedUntil && Date.now() >= data.blockedUntil) {
        attemptStore.delete(clientId)
        return { blocked: false }
    }

    if (data.blockedUntil && Date.now() < data.blockedUntil) {
        return {
            blocked: true,
            blockedUntil: data.blockedUntil,
            attempts: data.attempts
        }
    }

    return { blocked: false, attempts: data.attempts }
}

export const incrementAttempts = (clientId: string): IncrementResult => {
    const data = attemptStore.get(clientId) || { 
        attempts: 0, 
        blockedUntil: null, 
        lastAttempt: Date.now() 
    }

    data.attempts += 1
    data.lastAttempt = Date.now()

    if (data.attempts >= max_attempts) {
        data.blockedUntil = Date.now() + block_duration
        attemptStore.set(clientId, data)

        return {
            attempts: data.attempts,
            blocked: true,
            blockedUntil: data.blockedUntil
        }
    }

    attemptStore.set(clientId, data)
    return { attempts: data.attempts, blocked: false }
}

export const resetAttempts = (clientId: string): void => {
    attemptStore.delete(clientId)
}

export const cleanupExpiredBlocks = (): void => {
    const now = Date.now()
    for (const [key, value] of attemptStore.entries()) {
        if (
            (value.blockedUntil && now >= value.blockedUntil) ||
            (now - value.lastAttempt > cleanup_duration)
        ) {
            attemptStore.delete(key)
        }
    }
}