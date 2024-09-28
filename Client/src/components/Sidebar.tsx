'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { FileText, CheckSquare, Settings, Home, Package2 } from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()

    const isDocumentPage = pathname.startsWith('/documents/')
    const showDocumentsLink = !isDocumentPage

    return (
        <div className="w-64 bg-gray-100 p-4 flex flex-col h-full">
            <div className="flex items-center mb-6">
                <Package2 className="h-6 w-6 mr-2"/>
                <span className="text-xl font-semibold">Notion-Like</span>
            </div>
            <nav className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4"/> Home
                    </Link>
                </Button>
                {showDocumentsLink && (
                    <Button asChild variant="ghost"
                            className={`w-full justify-start ${pathname === '/documents' ? 'bg-gray-200' : ''}`}>
                        <Link href="/documents">
                            <FileText className="mr-2 h-4 w-4"/> Documents
                        </Link>
                    </Button>
                )}
                <Button asChild variant="ghost"
                        className={`w-full justify-start ${pathname === '/todos' ? 'bg-gray-200' : ''}`}>
                    <Link href="/todos">
                        <CheckSquare className="mr-2 h-4 w-4"/> Todos
                    </Link>
                </Button>
                <Button asChild variant="ghost"
                        className={`w-full justify-start ${pathname === '/settings' ? 'bg-gray-200' : ''}`}>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4"/> Settings
                    </Link>
                </Button>
            </nav>
        </div>
    )
}