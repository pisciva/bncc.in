'use client'

import { toPng } from 'html-to-image'
import { useAuth } from '@/context/AuthContext'
import { IconEdit, IconKey, IconCopy } from '@/components/layout/Icon'
import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import Toast from '@/components/layout/Toast'
import BNCCLogo from '@/components/layout/BNCCLogo'
import LockPopup from '@/components/main/comp/lockPopup'
import DownloadQR from '@/components/main/comp/DownloadQR'
import { fireLuxuryConfetti } from '@/utils/confetti'
import Link from 'next/link'

type ResultBoxProps = { result: any; onReset: () => void }

export default function ResultBox({ result, onReset }: ResultBoxProps) {
    const { user } = useAuth()
    const [shake, setShake] = useState(false)
    const [popup, setPopup] = useState(false)
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'warning' } | null>(null)
    const qrRef = useRef<HTMLDivElement | null>(null)
    const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const { type, shortenLink, formData } = result
    const { originalUrl, customUrl, expirationDate, qr, code, title } = formData || {}

    const handleCopyPasscode = () => {
        if (code) {
            navigator.clipboard.writeText(code)
                .then(() => setToast({ message: 'Passcode copied!', type: 'success' }))
                .catch(() => setToast({ message: "Couldn't copy passcode!", type: 'error' }))
        }
    }

    const handleCopyLink = () => {
        const linkToCopy = `https://bncc.in/${shortenLink}`

        navigator.clipboard.writeText(linkToCopy)
            .then(() => setToast({ message: 'Link grabbed! Go paste it!', type: 'success' }))
            .catch(() => setToast({ message: "Uh-oh! Couldn't grab the link!", type: 'error' }))
    }

    const handleCopyQR = async () => {
        try {
            if (!qrRef.current) return

            const dataUrl = await toPng(qrRef.current, { pixelRatio: 5 })

            if (navigator.clipboard && ClipboardItem && typeof ClipboardItem === 'function') {
                try {
                    const res = await fetch(dataUrl)
                    const blob = await res.blob()
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                    setToast({ message: 'QR grabbed! Go paste it!', type: 'success' })
                    return
                } catch (clipboardErr) {
                    console.warn('Clipboard API failed, falling back to download:', clipboardErr)
                }
            }

            const link = document.createElement('a')
            link.download = `${customUrl || title || 'qr-code'}.png`
            link.href = dataUrl
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            setToast({ message: 'QR downloaded! (Copy not supported on this device)', type: 'success' })
        } catch (err) {
            setToast({ message: "Uh-oh! Couldn't grab the QR!", type: 'error' })
        }
    }

    const triggerPopup = () => {
        setShake(true)
        setPopup(true)
        setTimeout(() => setShake(false), 500)

        if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current)
        popupTimeoutRef.current = setTimeout(() => setPopup(false), 7000)
    }

    useEffect(() => {
        if (containerRef.current) {
            const elementTop = containerRef.current.offsetTop
            const elementHeight = containerRef.current.offsetHeight
            const windowHeight = window.innerHeight
            const scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2)

            window.scrollTo({
                top: scrollTo,
                behavior: 'smooth'
            })
        }

        fireLuxuryConfetti({
            duration: 1500,
            particleCount: 50,
            colors: ['#0054A5', '#2788CE', '#FFD700', '#FF6B9D', '#00D4FF', '#B794F6']
        })

        return () => {
            if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current)
        }
    }, [])

    const qrValue_link = `https://bncc.in/${customUrl}`
    const qrValue_qr = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`
    const size = qr?.size || 150

    return (
        <>
            <div ref={containerRef} className="w-full max-w-2xl mx-auto rounded-3xl p-4 lg:p-8 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-1 text-center">
                {type === 'shorten' && (
                    <>
                        <div className={`md:flex text-[#64748B] font-medium mb-6 ${expirationDate ? 'justify-between' : 'justify-center'}`}>
                            <h1 className='text-base'>Here's your result!</h1>
                            {expirationDate && (
                                <h1 className='text-base text-[#10B981]'>
                                    Valid until {' '}
                                    {new Date(expirationDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </h1>
                            )}
                        </div>

                        {qr && (
                            <div className='w-full flex items-center justify-center mb-6'>
                                <div className='rounded-3xl overflow-hidden shadow-2'>
                                    <div ref={qrRef} className="relative bg-white backdrop-blur-xl flex items-center justify-center p-5 transition-all duration-300 hover:shadow-9"
                                        style={{ width: size + 40, height: size + 40 }}
                                    >
                                        {qrValue_link ? (
                                            <div className="relative" style={{ width: size, height: size }}>
                                                <QRCode value={qrValue_link || ""} size={size} fgColor={qr.color || "#000"} className="w-full h-full" />

                                                {qr.logo && (
                                                    <div className="bottom-0 right-0 absolute bg-white rounded-tl-sm"
                                                        style={{
                                                            paddingLeft: size * 0.015,
                                                            paddingTop: size * 0.02,
                                                        }}
                                                    >
                                                        <BNCCLogo color={qr.color || "#000"} width={Math.floor(size / 3)} />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm text-center">Enter custom link <br /> to preview QR</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='w-full flex flex-row items-center justify-center mb-5 gap-0'>
                            <div className='bg-white/50 backdrop-blur-lg border border-[#0054A5]/30 h-12 flex items-center px-4 lg:px-6 rounded-l-xl rounded-tr-none w-auto shadow-6 overflow-hidden'>
                                <p className="text-lg sm:text-2xl font-semibold text-[#0054A5] truncate ">{"bncc.in/" + customUrl}</p>
                            </div>
                            <button onClick={handleCopyLink} title="Copy link" className='bg-gradient-to-br from-[#0054A5] to-[#003d7a] hover:from-[#06387E] hover:to-[#002952] h-12 flex items-center justify-center px-3 lg:px-4 rounded-r-xl rounded-bl-none cursor-pointer transition-all duration-300 shadow-25 hover:shadow-25 w-auto'>
                                <IconCopy color="white" width={20} />
                            </button>
                        </div>

                        {code && (
                            <div className='w-full flex items-center justify-center mb-5'>
                                <div className="bg-white/40 backdrop-blur-lg px-4 py-2.5 rounded-full border border-white/60 shadow-7 flex items-center gap-3">
                                    <p className="font-medium text-[#64748B] flex items-center gap-2 text-sm">
                                        <IconKey color='#64748B' width={17} /> Passcode: <span className="font-bold text-[#0054A5]">{code}</span>
                                    </p>
                                    <button onClick={handleCopyPasscode} className="p-1.5 bg-[#0054A5]/10 hover:bg-[#0054A5]/20 rounded-full transition-all duration-300 cursor-pointer" title="Copy passcode">
                                        <IconCopy color='#0054A5' width={14} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className='w-full flex items-center justify-center'>
                            <div className='flex flex-wrap gap-2 justify-center'>
                                {qr && (
                                    <div className="flex gap-2">
                                        <DownloadQR qrRef={qrRef} name={customUrl} />
                                        <button onClick={handleCopyQR} title="Copy QR" className="flex px-3 py-2 bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-xl border border-[#0054A5]/30 hover:bg-white/80 hover:border-[#0054A5]/50 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-6 hover:shadow-16">
                                            Copy QR
                                            <IconCopy color='#0054A5' width={16} />
                                        </button>
                                    </div>
                                )}
                                {user ? (
                                    <Link href={`/dashboard`}>
                                        <button title="Edit link" className="flex px-3 py-2 bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-xl border border-[#0054A5]/30 hover:bg-white/80 hover:border-[#0054A5]/50 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-6 hover:shadow-16">
                                            Edit link <IconEdit color='#0054A5' width={19} />
                                        </button>
                                    </Link>
                                ) : (
                                    <div className="relative">
                                        <button onClick={triggerPopup} className={`flex px-3 py-2 bg-gray-200/60 backdrop-blur-lg text-[#64748B] rounded-xl border border-gray-300/40 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-27 ${shake ? 'animate-shake' : ''}`}>
                                            Edit link <IconEdit color="#64748B" width={19} />
                                        </button>

                                        <LockPopup show={popup} className="resultbox-position" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {type === 'qr' && qr && (
                    <div className="flex flex-col justify-start items-center gap-5">
                        <h1 className='text-[#64748B] font-medium text-base'>Here's your result!</h1>
                        <div className='rounded-3xl overflow-hidden shadow-2'>
                            <div ref={qrRef} className="relative bg-white backdrop-blur-xl flex items-center justify-center p-5 transition-all duration-300 hover:shadow-9"
                                style={{ width: size + 40, height: size + 40 }}
                            >
                                {qrValue_qr ? (
                                    <div className="relative" style={{ width: size, height: size }}>
                                        <QRCode value={qrValue_qr || ""} size={size} fgColor={qr.color || "#000"} className="w-full h-full" />

                                        {qr.logo && (
                                            <div
                                                className="bottom-0 right-0 absolute bg-white rounded-tl-md"
                                                style={{
                                                    paddingLeft: size * 0.035,
                                                    paddingTop: size * 0.04
                                                }}
                                            >
                                                <BNCCLogo color={qr.color || "#000"} width={Math.floor(size / 3)} />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm text-center">
                                        Enter custom link <br /> to preview QR
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <DownloadQR qrRef={qrRef} name={title} />
                            <button
                                onClick={handleCopyQR}
                                className="flex px-3 py-2 bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-xl border border-[#0054A5]/30 hover:bg-white/80 hover:border-[#0054A5]/50 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-6 hover:shadow-16"
                            >
                                Copy QR <IconCopy color='#0054A5' width={16} />
                            </button>
                            {user ? (
                                <Link href={`/dashboard?mode=qr`}>
                                    <button className="flex px-3 py-2 bg-white/60 backdrop-blur-lg text-[#0054A5] rounded-xl border border-[#0054A5]/30 hover:bg-white/80 hover:border-[#0054A5]/50 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-6 hover:shadow-16">
                                        Edit QR <IconEdit color='#0054A5' width={19} />
                                    </button>
                                </Link>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={triggerPopup}
                                        className={`flex px-3 py-2 bg-gray-200/60 backdrop-blur-lg text-[#64748B] rounded-xl border border-gray-300/40 text-sm font-medium cursor-pointer gap-2 transition-all duration-300 shadow-27 ${shake ? 'animate-shake' : ''}`}>
                                        Edit QR <IconEdit color="#64748B" width={19} />
                                    </button>

                                    <LockPopup show={popup} className="!top-[50%]" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-6 mt-4 lg:mt-8">
                <div className="group bg-gradient-to-br from-white/40 to-white/20 px-8 py-4 rounded-2xl border border-white/60 shadow-2 hover:shadow-9 transition-all duration-300">
                    <p className='text-[#0054A5] font-medium gap-2 flex flex-wrap items-center justify-center text-sm sm:text-base'>
                        Ready to create a new one?
                        <span onClick={onReset} className='inline-flex items-center gap-1.5 text-[#2788CE] font-bold underline underline-offset-4 cursor-pointer hover:text-[#06387E] transition-all duration-300 hover:gap-2'>
                            Click Here
                        </span>
                    </p>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    )
}