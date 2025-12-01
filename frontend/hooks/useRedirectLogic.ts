import { useState, useEffect } from 'react'
import { redirect } from '@/lib/api'

interface LinkData {
    originalUrl: string
    requiresCode: boolean
    title?: string
    shortenLink?: string
}

type Status = 'loading' | 'expired' | 'protected' | 'not-found' | 'blocked'

export const useRedirectLogic = (customUrl: string, providedCode: string | null) => {
    const [status, setStatus] = useState<Status>('loading')
    const [code, setCode] = useState<string[]>(Array(6).fill(''))
    const [error, setError] = useState('')
    const [redirecting, setRedirecting] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const [blockUntil, setBlockUntil] = useState<number | null>(null)
    const [linkData, setLinkData] = useState<LinkData | null>(null)

    const fixUrl = (url: string) => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) return 'https://' + url
        return url
    }

    const handleResponse = async (response: Response) => {
        const data = await response.json()

        if (!response.ok) {
            const statusHandlers: Record<number, () => void> = {
                404: () => setStatus('not-found'),
                410: () => setStatus('expired'),
                429: () => {
                    setStatus('blocked')
                    setBlockUntil(data.blockedUntil)
                    setAttempts(data.attempts || 5)
                },
                401: () => {
                    setStatus('protected')
                    setAttempts(data.attempts || 0)
                    setLinkData({
                        originalUrl: '',
                        requiresCode: true,
                        title: data.title,
                        shortenLink: data.shortenLink
                    })
                }
            }

            const handler = statusHandlers[response.status]
            if (handler) handler()
            return
        }

        if (data.redirect) {
            window.location.href = fixUrl(data.originalUrl)
        }
    }

    useEffect(() => {
        const checkAndRedirect = async () => {
            try {
                const response = await redirect.check(customUrl, providedCode || undefined)
                await handleResponse(response)
            } catch {
                setStatus('not-found')
            }
        }

        checkAndRedirect()
    }, [customUrl, providedCode])

    useEffect(() => {
        if (status === 'protected') document.getElementById('code-0')?.focus()
    }, [status])

    const handleSubmitCode = async () => {
        const fullCode = code.join('')

        if (fullCode.length !== 6) {
            setError('Please enter all 6 digits')
            return
        }

        setRedirecting(true)
        setError('')

        try {
            const response = await redirect.check(customUrl, fullCode)
            const data = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    setStatus('blocked')
                    setBlockUntil(data.blockedUntil)
                    setAttempts(data.attempts || 5)
                    setRedirecting(false)
                    return
                }

                if (response.status === 401) {
                    setAttempts(data.attempts || 0)
                    const attemptsLeft = data.attemptsLeft || (5 - (data.attempts || 0))
                    setError(`Incorrect code. ${attemptsLeft} attempts remaining.`)
                    setCode(Array(6).fill(''))
                    setRedirecting(false)
                    setTimeout(() => document.getElementById('code-0')?.focus(), 100)
                    return
                }
            }

            if (data.redirect) window.location.href = fixUrl(data.originalUrl)
        } catch {
            setError('Something went wrong. Please try again.')
            setCode(Array(6).fill(''))
            setRedirecting(false)
            setTimeout(() => document.getElementById('code-0')?.focus(), 100)
        }
    }

    return {
        status,
        code,
        setCode,
        error,
        redirecting,
        attempts,
        blockUntil,
        linkData,
        handleSubmitCode
    }
}