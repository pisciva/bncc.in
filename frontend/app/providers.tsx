"use client"

import { ReactNode, Suspense, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AuthProvider } from "@/context/AuthContext"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

function TokenHandler() {
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

    return null
}

export default function Providers({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    const routesWithLayout = ['/', '/dashboard', '/privacy-policy', '/terms-of-service']

    const shouldShowLayout = routesWithLayout.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    return (
        <AuthProvider>
            <Suspense fallback={null}>
                <TokenHandler />
            </Suspense>
            {shouldShowLayout && <Navbar />}
            <main className="min-h-screen">{children}</main>
            {shouldShowLayout && <Footer />}
        </AuthProvider>
    )
}