'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserCircle2, Menu, X, LayoutList, LogOut, ChevronDown, House, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const getFirstName = (name: string) => name.split(' ')[0]

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false)
        }

        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isDropdownOpen])

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
                                    <div className="relative" ref={dropdownRef}>
                                        <button className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer"
                                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                                        >
                                            <UserCircle2 className="w-5 h-5" />
                                            <span>{getFirstName(user.fullName)}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl shadow-xl border border-white/50 rounded-2xl overflow-hidden animate-fadeIn">
                                                <div>
                                                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-[#0054A5] hover:bg-[#0054A5]/10 transition cursor-pointer text-left"
                                                        onClick={() => {
                                                            router.push('/dashboard')
                                                            setIsDropdownOpen(false)
                                                        }}>
                                                        <LayoutList className="w-4 h-4" />
                                                        <span className="font-medium">Dashboard</span>
                                                    </button>

                                                    <div className="border-t border-gray-200"></div>

                                                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-[#EF4444] hover:bg-red-50 transition cursor-pointer text-left"
                                                        onClick={handleLogout}>
                                                        <LogOut className="w-4 h-4 hidden lg:block" />
                                                        <span className="font-medium">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/login" className="hover:font-semibold transition cursor-pointer">Sign In</Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <nav className="lg:hidden fixed top-5 left-5 right-5 z-50 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-none">
                    <div className="pointer-events-auto relative bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full px-4 sm:px-6 py-3 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0054A5]/0 via-[#2788CE]/20 to-[#0054A5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-flow"></div>

                        <Link href="/">
                            <img src="/logo-bnccin.svg" alt="BNCC Logo" width={70} className="object-contain relative z-10" />
                        </Link>
                    </div>

                    <div className="pointer-events-auto bg-white/20 backdrop-blur-xl shadow-23 border border-white/18 rounded-full">
                        <button className="text-[#0054A5] p-3 sm:p-4 hover:bg-white/10 rounded-full transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? (
                                <X className="w-4 h-4" />
                            ) : (
                                <Menu className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="pointer-events-auto mt-3 bg-white/25 backdrop-blur-xl shadow-23 border-2 border-white/30 rounded-3xl px-6 py-4 animate-fadeIn">
                        <div className="flex flex-col space-y-4 font-medium text-[#0054A5]">
                            <Link href="/" className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer py-2 text-left border-b border-white/20" onClick={() => setIsMenuOpen(false)}>
                                <House className="w-5 h-5" />
                                <span>Home</span>
                            </Link>

                            {!loading && (
                                user ? (
                                    <>
                                        <button className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer py-2 text-left border-b border-white/20"
                                            onClick={() => {
                                                router.push('/dashboard')
                                                setIsMenuOpen(false)
                                            }}>
                                            <LayoutList className="w-5 h-5" />
                                            <span>Dashboard</span>
                                        </button>

                                        <button className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer py-2 text-left text-[#EF4444]"
                                            onClick={handleLogout}>
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/login" className="flex items-center space-x-2 hover:font-semibold transition cursor-pointer py-2 text-left"
                                        onClick={() => setIsMenuOpen(false)}>
                                        <LogIn className="w-5 h-5 lg:hidden" />
                                        <span>Sign In</span>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    )
}