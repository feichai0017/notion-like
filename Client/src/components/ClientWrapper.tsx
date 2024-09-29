'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isEditingDocument = pathname.startsWith('/documents/') && pathname !== '/documents'
    const showSidebar = pathname !== '/' && !isEditingDocument

    return (
        <div className="flex h-screen">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 overflow-auto ${isEditingDocument ? 'w-full' : ''}`}>
                {children}
            </main>
        </div>
    )
}