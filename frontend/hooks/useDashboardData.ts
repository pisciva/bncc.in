import { useState, useEffect } from 'react'
import { LinkType } from '@/types/link'
import { QRType } from '@/types/qr'

export const useDashboardData = () => {
    const [links, setLinks] = useState<LinkType[]>([])
    const [qrs, setQrs] = useState<QRType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Unauthorized: No token found")
                    setLoading(false)
                    return
                }

                const [resLinks, resQR] = await Promise.all([
                    fetch("http://localhost:5000/api/links", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:5000/api/qrs", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])

                if (!resLinks.ok) throw new Error(`Links fetch error ${resLinks.status}`)
                if (!resQR.ok) throw new Error(`QR fetch error ${resQR.status}`)

                setLinks(await resLinks.json())
                setQrs(await resQR.json())
            } catch (err: any) {
                setError(err.message || "Failed to fetch data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { links, qrs, loading, error }
}