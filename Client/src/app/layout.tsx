import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import ClientWrapper from '@/components/ClientWrapper'
import { Sidebar } from '@/components/Sidebar'

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
})

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
})

export const metadata: Metadata = {
    title: "Notion-Like",
    description: "A Notion-like application with document management and todo lists",
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
            <body className="bg-background text-foreground antialiased">
                <ClientWrapper>
                    <div className="flex h-screen">
                        <main className="flex-1 overflow-auto">
                            {children}
                        </main>
                    </div>
                </ClientWrapper>
            </body>
        </html>
    )
}