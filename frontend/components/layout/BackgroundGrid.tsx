'use client'

import React, { useEffect, useState } from 'react'

const PALETTE = [
    '#CDE3F5',
    '#CCE3F8',
    '#E9F2F8',
    '#D2E6F7',
    '#D6EAFB',
    '#96C4E7',
    '#57A5DD',
]

type Props = {
    tileSize?: number
    gap?: number
    highlight?: string
}

export default function BackgroundGrid({
    tileSize = 72,
    gap = 2,
    highlight = '#2788CE',
}: Props) {
    const [cols, setCols] = useState(0)
    const [rows, setRows] = useState(0)
    const [tiles, setTiles] = useState<string[]>([])
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    useEffect(() => {
        function buildGrid() {
            const w = window.innerWidth
            const h = window.innerHeight
            const c = Math.max(1, Math.floor(w / (tileSize + gap)))
            const r = Math.max(1, Math.floor(h / (tileSize + gap)))
            setCols(c)
            setRows(r)
            const count = c * r
            const t = Array.from({ length: count }).map(
                () => PALETTE[Math.floor(Math.random() * PALETTE.length)]
            )
            setTiles(t)
        }

        buildGrid()
        window.addEventListener('resize', buildGrid)
        return () => window.removeEventListener('resize', buildGrid)
    }, [tileSize, gap])

    const tileStyle = (idx: number, baseColor: string) => {
        if (hoverIndex === null) {
            return {
                background: baseColor,
                opacity: 1,
                transform: 'none',
            } as React.CSSProperties
        }
        const hr = Math.floor(hoverIndex / cols)
        const hc = hoverIndex % cols
        const r = Math.floor(idx / cols)
        const c = idx % cols
        const dist = Math.hypot(hr - r, hc - c)
        const decay = 0.12
        const opacity = Math.max(0.12, 1 - dist * decay)
        const isHovered = idx === hoverIndex
        return {
            background: isHovered ? highlight : baseColor,
            opacity: isHovered ? 1 : opacity,
            transform: isHovered ? 'scale(1.03)' : 'none',
            boxShadow: isHovered ? '0 8px 28px rgba(39,136,206,0.16)' : 'none',
        } as React.CSSProperties
    }

    return (
        <div
            aria-hidden
            className="bg-grid absolute inset-0 -z-10"
            style={{
                pointerEvents: 'none',
            }}
        >
            <div
                className="tiles"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols || 1}, ${tileSize}px)`,
                    gridAutoRows: `${tileSize}px`,
                    gap: `${gap}px`,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignContent: 'start',
                    padding: `${gap}px`,
                    pointerEvents: 'auto',
                }}
            >
                {tiles.map((color, i) => (
                    <div
                        key={i}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        style={{
                            width: tileSize,
                            height: tileSize,
                            borderRadius: 6,
                            border: '1px solid rgba(15,23,42,0.03)',
                            transition:
                                'background-color 260ms ease, opacity 260ms ease, transform 260ms ease, box-shadow 260ms ease',
                            ...tileStyle(i, color),
                            pointerEvents: 'auto',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
