"use client"

import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Lock, AlertCircle, Clock } from 'lucide-react'
import StatusCard from '@/components/[customUrl]/StatusCard'
import CodeInput from '@/components/[customUrl]/CodeInput'
import Link from 'next/link'
import { useRedirectLogic } from '@/hooks/useRedirectLogic'
import { useBlockTimer } from '@/hooks/useBlockTimer'

function RedirectPageContent() {
    const params = useParams()
    const searchParams = useSearchParams()
    const customUrl = params.customUrl as string
    const providedCode = searchParams.get('code')

    const {
        status,
        code,
        setCode,
        error,
        redirecting,
        attempts,
        blockUntil,
        linkData,
        handleSubmitCode
    } = useRedirectLogic(customUrl, providedCode)

    const remainingTime = useBlockTimer(blockUntil, status === 'blocked')

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
                <div className="bg-orange-50/80 backdrop-blur-sm border border-orange-200 rounded-xl p-4">
                    <p className="text-orange-600 font-semibold text-lg mb-1">Time remaining:</p>
                    <p className="text-orange-600 text-2xl font-bold">{remainingTime}</p>
                </div>

                <div className='text-xs sm:text-sm text-[#64748B] mt-4 mb-8'>
                    This block applies to your connection and affects other devices on the same network.
                </div>
            </StatusCard>
        )
    }

    if (status === 'protected') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
                <div className="max-w-lg bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-1 p-6 sm:p-10 relative">
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
                            disabled={redirecting || code.some((c: string) => !c)}
                            className={`w-full h-12 sm:h-14 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${redirecting
                                ? 'bg-yellow-500/80 text-white cursor-not-allowed'
                                : code.some((c: string) => !c)
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