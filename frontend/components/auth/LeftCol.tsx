'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

type FloatingBoxProps = {
    className: string
    barClass: string
    barPositions: number[]
}

const FloatingBox: React.FC<FloatingBoxProps> = ({
    className,
    barClass,
    barPositions,
}) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY

        const moveX = -(deltaX / width) * 30
        const moveY = -(deltaY / height) * 30

        setOffset({ x: moveX, y: moveY })
    }

    const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: "transform 0.2s ease-out",
            }}
            className={className}
        >
            {barPositions.map((top, i) => (
                <div
                    key={i}
                    className={`absolute rounded-md z-4 ${barClass}`}
                    style={{ top: `${top}%` }}
                />
            ))}
        </div>
    )
}

export default function LeftCol() {
    return (
        <div className="hidden lg:flex relative w-full h-full bg-gradient-to-b from-[#2474C0] to-[#033B8F] rounded-3xl overflow-hidden mx-auto justify-center items-center">
            <Link
                href="/"
                className="absolute inline-flex items-center gap-2 mb-6 px-4 py-2 top-10 left-10 bg-white transition-all duration-300 backdrop-blur-xl rounded-full text-[#0054A5] font-semibold cursor-pointer z-999"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="container w-full mx-auto relative h-full">
                <FloatingBox
                    className="absolute rounded-2xl font-semibold text-white flex items-center z-3 justify-center gradient-blur-box"
                    barClass="blur-bar"
                    barPositions={[31, 51, 71]}
                />

                <FloatingBox
                    className="absolute rounded-2xl font-semibold text-white flex items-center z-3 justify-center gradient-blur-box2"
                    barClass="blur-bar2"
                    barPositions={[25, 45, 65]}
                />

                <div className="absolute bg-[#D7E0E8] rounded-xl blue-box z-5">
                    <img src="/icon-link.svg" alt="" className="z-5 icon-link" />
                </div>

                <div className="absolute bg-[#D7E0E8] rounded-xl blue-box2 z-5">
                    <img src="/icon-qr.svg" alt="" className="z-5 icon-qr" />
                </div>

                <img src="/icon-cursor.svg" alt="" className="z-5 absolute icon-cursor" />

                <div className="absolute rounded-full px-[10.85px] z-5 pt-[5.74px] pb-[5.74px] font-bold text-white z-10 cursor-default flex items-center tremble justify-center bncc-box">
                    <img src="/logo-bnccin2-white.svg" className='w-30' alt="" />
                </div>
            </div>
        </div>
    )
}
