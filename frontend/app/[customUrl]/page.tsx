"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Lock, AlertCircle, Clock } from 'lucide-react'
import StatusCard from '@/components/[customUrl]/StatusCard'
import CodeInput from '@/components/[customUrl]/CodeInput'
import Link from 'next/link'
import { fetchRedirect } from '@/lib/api'

function RedirectPageContent() {
    const params = useParams()
    const searchParams = useSearchParams()
    const router = useRouter()
    const customUrl = params.customUrl as string
    const providedCode = searchParams.get('code')
    const [status, setStatus] = useState<'loading' | 'expired' | 'protected' | 'not-found' | 'blocked'>('loading')
    const [code, setCode] = useState<string[]>(Array(6).fill(''))
    const [error, setError] = useState('')
    const [redirecting, setRedirecting] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const [blockUntil, setBlockUntil] = useState<number | null>(null)
    const [remainingTime, setRemainingTime] = useState('')
    const [linkData, setLinkData] = useState<{
        originalUrl: string
        requiresCode: boolean
        title?: string
        shortenLink?: string
    } | null>(null)

    const formatTime = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)
        return `${hours}h ${minutes}m ${seconds}s`
    }

    useEffect(() => {
        if (status !== 'blocked' || !blockUntil) return

        const interval = setInterval(() => {
            const diff = blockUntil - Date.now()
            if (diff <= 0) {
                window.location.reload()
            } else {
                setRemainingTime(formatTime(diff))
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [status, blockUntil])

    useEffect(() => {
        if (status === 'protected') document.getElementById('code-0')?.focus()
    }, [status])

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
                const response = await fetchRedirect(customUrl, providedCode || undefined)
                await handleResponse(response)
            } catch {
                setStatus('not-found')
            }
        }

        checkAndRedirect()
    }, [customUrl, providedCode])

    const handleSubmitCode = async () => {
        const fullCode = code.join('')

        if (fullCode.length !== 6) {
            setError('Please enter all 6 digits')
            return
        }

        setRedirecting(true)
        setError('')

        try {
            const response = await fetchRedirect(customUrl, fullCode)
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

    if (status === 'loading') {
        return (
            <StatusCard
                icon={<div className="w-16 h-16 border-4 border-[#0054A5]/30 border-t-[#0054A5] rounded-full animate-spin"></div>}
                iconBg="bg-transparent"
                title="Redirecting..."
                description="Please wait while we take you to your destination"
                showButton={false}
            />
        )
    }

    if (status === 'not-found') {
        return (
            <StatusCard
                icon={<AlertCircle className="w-10 h-10 text-red-500" />}
                iconBg="bg-red-100"
                title="Link Not Found"
                description="The shortened link you're looking for doesn't exist"
            />
        )
    }

    if (status === 'expired') {
        return (
            <StatusCard
                icon={<Clock className="w-10 h-10 text-orange-500" />}
                iconBg="bg-orange-100"
                title="Link Expired"
                description="This link has expired and is no longer available."
            />
        )
    }

    if (status === 'blocked') {
        return (
            <StatusCard
                icon={<AlertCircle className="w-10 h-10 text-red-500" />}
                iconBg="bg-red-100"
                title="Access Blocked"
                description="You've exceeded the maximum number of attempts (5)."
                showButton={true}
            >
                <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-xl p-4 mb-8">
                    <p className="text-orange-600 font-semibold text-lg mb-1">Time remaining:</p>
                    <p className="text-orange-600 text-2xl font-bold">{remainingTime}</p>
                </div>
            </StatusCard>
        )
    }

    if (status === 'protected') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
                <div className="max-w-lg bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-8 sm:p-10 relative">
                    <div className="absolute left-1/2 -top-9 transform -translate-x-1/2">
                        <div className="w-50 h-17 border-2 bg-[#F8FAFC] backdrop-blur-xl border-white/40 rounded-full shadow-2 flex items-center justify-center">
                            <img src="/logo-bnccin2.svg" className="w-32" alt="Logo" />
                        </div>
                    </div>
                    <div className="mt-8 mb-2 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-[#0054A5]" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0054A5] mb-3">Protected Link</h1>
                        {linkData?.shortenLink && (
                            <p className="py-2 px-5 inline-block max-w-[300px] lg:max-w-[400px] truncate overflow-hidden whitespace-nowrap bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-full border border-[#0054A5]/30 hover:bg-white/80 shadow-4 font-semibold mb-2">
                                {linkData.shortenLink.replace(/^https?:\/\//, "")}
                            </p>
                        )}
                        {attempts > 0 && (<p className="text-sm text-[#F59E0B] font-medium">Attempts used: {attempts}/5</p>)}
                    </div>
                    <div className="space-y-6">
                        <CodeInput
                            code={code}
                            setCode={setCode}
                            disabled={redirecting}
                            onSubmit={handleSubmitCode}
                        />
                        {error && (
                            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <button
                            onClick={handleSubmitCode}
                            disabled={redirecting || code.some(c => !c)}
                            className={`w-full h-12 sm:h-14 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${redirecting
                                ? 'bg-yellow-500/80 text-white cursor-not-allowed'
                                : code.some(c => !c)
                                    ? 'bg-gray-400/80 text-white cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white hover:shadow-3 cursor-pointer'}`}>
                            {redirecting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : ('Access Link')}
                        </button>
                        <p className="text-center text-xs sm:text-sm text-[#64748B] font-medium">Enter the 6-digit code provided by the link creator</p>
                    </div>
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-[#0054A5] font-semibold hover:underline inline-flex items-center gap-2 justify-center">
                            <img src="/images/back.svg" className='w-3' alt="" />
                            Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return null
}

export default function RedirectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="w-16 h-16 border-4 border-[#0054A5]/30 border-t-[#0054A5] rounded-full animate-spin"></div>
            </div>
        }>
            <RedirectPageContent />
        </Suspense>
    )
}