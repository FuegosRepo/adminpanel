'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, DollarSign, BarChart3, Calendar, Bell, Euro, FileText, Calculator, ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './Sidebar.module.css'

interface SidebarProps {
    isCollapsed: boolean
    onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

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

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.sidebarHeader}>
                {!isCollapsed && (
                    <div className={styles.logo}>
                        <h2>Fuegos Admin</h2>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={styles.toggleBtn}
                    title={isCollapsed ? "Expandir" : "Colapsar"}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className={styles.nav}>
                {links.map(link => {
                    const IconComponent = link.icon
                    const isActive = pathname.startsWith(link.href)

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${isActive ? styles.active : ''}`}
                            title={isCollapsed ? link.label : undefined}
                        >
                            <IconComponent size={20} />
                            {!isCollapsed && <span>{link.label}</span>}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
