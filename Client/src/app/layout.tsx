import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import ClientWrapper from '@/components/ClientWrapper'

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
    title: "Notion Clone",
    description: "A Notion-like application with document management and todo lists",
    icons: {
        icon: './favicon.ico',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
            <link rel="icon" href="./favicon.ico" sizes="any" />
        </head>
        <body className="bg-background text-foreground antialiased">
        <ClientWrapper>
            {children}
        </ClientWrapper>
        </body>
        </html>
    )
}