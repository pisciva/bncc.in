'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MapPin, Mail, Phone, Globe } from "lucide-react";

export default function Footer() {
    const images = [
        "/images/footer/image01.png",
        "/images/footer/image02.png",
        "/images/footer/image03.png",
        "/images/footer/image04.png",
        "/images/footer/image05.png",
        "/images/footer/image06.png",
        "/images/footer/image07.png",
    ]

    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 3000)

        return () => clearInterval(timer)
    }, [])

    const developers = [
        {
            name: "Akbar Zaidan Rohman",
            role: "Full Stack Developer",
            position: "FILE Manager | BNCC KMG 36",
            image: "/images/footer/photo-akbar.png",
            linkedin: "https://www.linkedin.com/in/akbar-zaidan-rohman/",
            instagram: "https://instagram.com/akbrzr"
        }, {
            name: "Tasya Pandya Latifa",
            role: "UI/UX Designer",
            position: "PR Manager | BNCC KMG 36",
            image: "/images/footer/photo-tasya.png",
            linkedin: "https://id.linkedin.com/in/tasyapandya",
            instagram: "https://instagram.com/tasyapndya"
        }
    ]

    return (
        <div className="px-8 sm:px-16 text-[#0054A5] bg-[#F2F5F9] py-8 shadow-22">
            <div className='flex flex-col lg:flex-row gap-2 lg:gap-8 lg:gap-0 items-center lg:items-start text-center lg:text-left'>
                <div className='hidden lg:flex lg:w-1/3 flex-col pr-10'>
                    <img src="/logo-bnccin2.svg" width={200} alt="" />

                    <div className="mt-4 w-full h-32 rounded-xl overflow-hidden bg-white">
                        <div
                            className="w-full h-full transition-all duration-700"
                            style={{
                                backgroundImage: `url(${images[index]})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    </div>
                </div>

                <div className='lg:hidden mb-6'>
                    <img src="/logo-bnccin2.svg" width={150} className="w-36 sm:w-44" alt="" />
                </div>

                <div className='lg:w-1/3 lg:pl-10 xl:pl-15'>
                    <div className='mb-5'>
                        <h1 className='font-bold text-lg lg:mb-2 text-center lg:text-left'>
                            About Us
                        </h1>
                        <h2 className='font-medium text-sm lg:text-justify lg:max-w-150'>
                            Established in 1989, Bina Nusantara Computer Club is the oldest computer-based organization at BINUS University. We are a close-knit family of exceptional individuals who are passionately into technology and a commitment to professionalism.
                        </h2>
                    </div>


                    <div className='lg:mb-0 flex flex-col'>
                        <h1 className='font-bold text-lg lg:mb-2'>Legal</h1>
                        <Link href="/terms-of-service" className='font-medium text-sm hover:underline'>Terms of Service</Link>
                        <Link href="/privacy-policy" className='font-medium text-sm hover:underline'>Privacy Policy</Link>
                    </div>
                </div>

                <div className='hidden lg:block lg:w-1/3 lg:pl-15 xl:pl-40'>
                    <div className='mb-8 lg:mb-10'>
                        <h1 className='font-bold text-lg mb-2'>Contact Information</h1>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-start gap-3'>
                                <MapPin className='mt-1 w-5'/>
                                <Link
                                    href="https://maps.app.goo.gl/NBkrqkRB4n34YSzt5"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <h2 className='font-medium text-sm hover:underline'>Jalan Rawa Belong No.51A,<br />Kec. Palmerah, Kota Jakarta Barat.</h2>
                                </Link>
                            </div>
                            <div className='flex items-start gap-3'>
                                <Mail className='w-5'/>
                                <Link href="mailto:info@bncc.net">
                                    <h2 className="font-medium text-sm hover:underline">pr@bncc.net</h2>
                                </Link>

                            </div>
                            <div className='flex items-start gap-3'>
                                <Phone className='w-5'/>
                                <Link
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <h2 className="font-medium text-sm text-[#0054A5] cursor-pointer hover:underline">+62 822 9946 1218 <span className=''>(Arie)</span></h2>
                                </Link>

                            </div>
                            <div className='flex items-start gap-3'>
                                <Globe className='w-5'/>
                                <Link
                                    href="https://www.bncc.net"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <h2 className='font-medium text-sm hover:underline'>www.bncc.net</h2>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row lg:justify-between mt-8 lg:mt-10 gap-6 lg:items-end relative'>
                <div className='flex gap-4 sm:gap-6 justify-center lg:justify-end order-2 lg:order-3 lg:mb-4'>
                    <Link href="https://instagram.com/bnccbinus" target="_blank" rel="noopener noreferrer">
                        <img src="/images/footer/icon-ig.svg" width={30} className='cursor-pointer w-6 sm:w-7 lg:w-[25px]' alt="" />
                    </Link>
                    <Link href="https://www.linkedin.com/company/bnccbinus" target="_blank" rel="noopener noreferrer">
                        <img src="/images/footer/icon-linkedin.svg" width={30} className='cursor-pointer w-6 sm:w-7 lg:w-[25px]' alt="" />
                    </Link>
                    <Link href="https://www.facebook.com/bina.nusantara.computer.club" target="_blank" rel="noopener noreferrer">
                        <img src="/images/footer/icon-fb.svg" width={30} className='cursor-pointer w-6 sm:w-7 lg:w-[25px]' alt="" />
                    </Link>
                    <Link href="https://x.com/BNCC_Binus" target="_blank" rel="noopener noreferrer">
                        <img src="/images/footer/icon-x.svg" width={30} className='cursor-pointer w-6 sm:w-7 lg:w-[25px]' alt="" />
                    </Link>
                    <Link href="https://www.tiktok.com/@bnccbinus" target="_blank" rel="noopener noreferrer">
                        <img src="/images/footer/icon-tiktok.svg" width={27} className='cursor-pointer w-5 sm:w-6 lg:w-[22px]' alt="" />
                    </Link>
                </div>

                {/* Bagian ini tolong jangan dihapus yaa hehehe, thankyouu so much */}
                <div className="hidden lg:block relative order-1 lg:order-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    <button className='bg-gradient-to-r from-[#0054A5] to-[#003d7a] text-white flex items-center gap-2 px-5 py-2 rounded-t-2xl cursor-pointer transition-all hover:bg-[#003d7a]'>
                        <svg
                            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className='font-medium text-sm'>Created by</span>
                    </button>

                    <div
                        className={`
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-0
                            bg-white rounded-2xl shadow-2xl border border-gray-200
                            transition-all duration-500 ease-in-out
                            ${isHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'}
                        `}
                        style={{ width: '500px' }}
                    >
                        <div className="p-4">
                            <div className="flex gap-6 items-end justify-end">
                                {developers.map((dev, idx) => (
                                    <div key={idx} className="flex-1">
                                        <h3 className="text-[#0054A5] font-semibold text-sm mb-3">
                                            {dev.role}
                                        </h3>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                                                <img
                                                    src={dev.image}
                                                    alt={dev.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement!.innerHTML = `
                                                            <div class="w-full h-full flex items-center justify-center bg-[#0054A5] text-white text-2xl font-bold">
                                                                ${dev.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            </div>

                                            <h4 className="text-[#0054A5] font-bold text-center text-sm mb-1">{dev.name}</h4>
                                            <p className="text-[#0054A5] text-xs text-center font-medium mb-3">{dev.position}</p>

                                            <div className="flex justify-center gap-3">
                                                <Link
                                                    href={dev.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#0054A5] to-[#0066CC] hover:shadow-sm hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 group/link overflow-hidden"
                                                >
                                                    <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={dev.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:shadow-sm hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 group/link overflow-hidden"
                                                >
                                                    <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='font-medium text-xs sm:text-sm text-center lg:text-left order-3 lg:order-1 lg:mb-4'>
                    Copyright 2025 bncc.in | All Rights Reserved
                </div>
            </div>

            <hr className='hidden lg:block lg:mb-2 bg-[#0054A5]' />
        </div>
    )
}