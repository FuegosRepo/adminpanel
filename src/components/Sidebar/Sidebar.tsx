'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, DollarSign, BarChart3, Calendar, Bell, Euro, FileText, Calculator, Flame } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar"

const links = [
    { href: '/orders', label: 'Pedidos', icon: List },
    { href: '/payments', label: 'Pagos', icon: DollarSign },
    { href: '/reports', label: 'Reportes', icon: BarChart3 },
    { href: '/calendar', label: 'Calendario', icon: Calendar },
    { href: '/reminders', label: 'Recordatorios', icon: Bell },
    { href: '/prices', label: 'Precios', icon: Euro },
    { href: '/budgets', label: 'Presupuestos', icon: FileText },
    { href: '/calculator', label: 'Calculadora', icon: Calculator }
]

export default function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader className="p-4 border-b lg:h-[111px] justify-center">
                <div className="flex items-center gap-2 px-1 justify-between w-full">
                    <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                        <Flame className="h-6 w-6 text-primary shrink-0" />
                        <span className="font-bold text-lg group-data-[collapsible=icon]:hidden truncate">Fuegos Admin</span>
                    </div>
                    <SidebarTrigger className="hidden lg:flex" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((link) => {
                                const isActive = pathname.startsWith(link.href)
                                return (
                                    <SidebarMenuItem key={link.href}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={link.label}>
                                            <Link href={link.href}>
                                                <link.icon />
                                                <span>{link.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
