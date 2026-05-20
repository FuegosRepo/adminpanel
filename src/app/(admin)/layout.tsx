'use client'

import AppSidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1 w-full min-w-0 max-w-full min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
