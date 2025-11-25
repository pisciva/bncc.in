'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserCircle2, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const getFirstName = (name: string) => name.split(' ')[0]

    return (
        <>
            <nav className="hidden lg:block fixed top-10 inset-x-20 z-50 pointer-events-none">
                <div className="flex items-center justify-between">
                    <Link href="/" className='pointer-events-auto'>
                        <div className="relative bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full px-6 py-3 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/0 via-[#2788CE]/20 to-[#0054A5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-flow"></div>
                            
                            <img src="/logo-bnccin.svg" alt="BNCC Logo" width={100} className="object-contain relative z-10" />
                        </div>
                    </Link>

                    <div className="pointer-events-auto bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full px-8 py-3">
                        <div className="flex space-x-10 font-medium text-[#0054A5] items-center">
                            <Link href="/" className="hover:font-semibold transition">Home</Link>

                            {!loading && (
                                user ? (
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer"
                                    >
                                        <UserCircle2 className="w-5 h-5" />
                                        <span>{getFirstName(user.fullName)}</span>
                                    </button>
                                ) : (
                                    <Link href="/login" className="hover:font-semibold transition cursor-pointer">Sign In</Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="lg:hidden fixed top-5 left-5 right-5 z-50 pointer-events-auto">
                <div className="flex items-center justify-between">
                    <div className="relative bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full px-4 sm:px-6 py-3 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/0 via-[#2788CE]/20 to-[#0054A5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-flow"></div>
                        
                        <Link href="/">
                            <img src="/logo-bnccin.svg" alt="BNCC Logo" width={80} className="object-contain relative z-10"/>
                        </Link>
                    </div>

                    <div className="bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[#0054A5] p-3 sm:p-4 hover:bg-white/10 rounded-full transition"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="mt-3 bg-white/25 backdrop-blur-xl shadow-23 border-2 border-white/30 rounded-3xl px-6 py-4 animate-fadeIn">
                        <div className="flex flex-col space-y-4 font-medium text-[#0054A5]">
                            <Link href="/" className="hover:font-semibold transition py-2 border-b border-white/20" onClick={() => setIsMenuOpen(false)}>
                                Home
                            </Link>

                            {!loading && (
                                user ? (
                                    <button
                                        onClick={() => {
                                            router.push('/dashboard')
                                            setIsMenuOpen(false)
                                        }}
                                        className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer py-2 text-left"
                                    >
                                        <UserCircle2 className="w-5 h-5" />
                                        <span>{getFirstName(user.fullName)}</span>
                                    </button>
                                ) : (
                                    <Link href="/login" className="hover:font-semibold transition cursor-pointer py-2" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}