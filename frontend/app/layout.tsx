import type { ReactNode } from "react"
import { Albert_Sans } from "next/font/google"
import Providers from "./providers"
import "@/app/globals.css"
import "@/components/auth/auth.css"
import "@/components/main/forms.css"

export const metadata = {
    title: "bncc.in",
    description: "BNCC Link Shortener",
    icons: {
        icon: [
            { url: "/favicon-light.ico", media: "(prefers-color-scheme: light)" },
            { url: "/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
        ],
        shortcut: "/favicon-light.ico",
        apple: "/icon-bncc3.png",
    },
}

const font = Albert_Sans({
    subsets: ["latin"],
    variable: "--font-albertsans",
})

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={font.className} suppressHydrationWarning>
            <body className="w-full bg-[#F8FAFC]" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
