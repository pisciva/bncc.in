"use client"

import { ReactNode, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function Providers({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const token = searchParams.get("token")

        if (token) {
            localStorage.setItem("token", token)
            router.replace(pathname)
        }
    }, [searchParams, pathname, router])

    const routesWithLayout = ['/', '/dashboard', '/privacy-policy', '/terms-of-service']

    const shouldShowLayout = routesWithLayout.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    return (
        <AuthProvider>
            {shouldShowLayout && <Navbar />}
            <main className="min-h-screen">{children}</main>
            {shouldShowLayout && <Footer />}
        </AuthProvider>
    )
}