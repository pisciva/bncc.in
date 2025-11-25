'use client'

import { useState } from 'react'
import QRForm from '@/components/main/QRForm'
import ResultBox from '@/components/main/ResultBox'
import ShortenForm from '@/components/main/ShortenForm'
import ToggleButton from '@/components/main/ToggleButton'
import { FinishBanner, HeroTitle } from '@/components/layout/Banner'

export default function HomePage() {
    const [mode, setMode] = useState<'shorten' | 'qr'>('shorten')
    const [result, setResult] = useState<any>(null)

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 lg:px-4 pt-30 pb-20 lg:py-30">
            <FinishBanner />

            <div className="space-y-6 w-full flex flex-col items-center justify-center">
                {result ? (
                    <ResultBox result={result} onReset={() => setResult(null)} />
                ) : (
                    <div className="w-full max-w-2xl mx-auto mb-10 sm:mb-16 lg:mb-20">
                        <HeroTitle />

                        <div className="flex justify-center mb-6 sm:mb-8">
                            <ToggleButton mode={mode} setMode={setMode} />
                        </div>

                        {mode === 'qr' && <QRForm onSuccess={setResult} />}
                        {mode === 'shorten' && <ShortenForm onSuccess={setResult} />}
                    </div>
                )}
            </div>
        </main>
    )
}