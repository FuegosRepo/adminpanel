'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import Header from '@/components/Header/Header'
import styles from './layout.module.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={styles.layout}>
            <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
            <div className={`${styles.mainContent} ${isCollapsed ? styles.collapsed : ''}`}>
                <Header />
                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    )
}
