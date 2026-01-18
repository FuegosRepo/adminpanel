'use client'

import Script from 'next/script'
import { useState } from 'react'

// Mock Data sourced from real /orders page
const mockOrders = [
    { id: 'ORD-001', client: 'Wagner Maéva', email: 'maevawagner@hotmail.fr', phone: '0623339247', date: '26/03/2027', status: 'pending', avatar: 'WM' },
    { id: 'ORD-002', client: 'Kaim-xienglay Laomey', email: 'laomey96@gmail.com', phone: '0767587789', date: '03/04/2026', status: 'pending', avatar: 'KL' },
    { id: 'ORD-003', client: 'Enzo', email: 'enzojamal.tahirovski@outlook.com', phone: '-', date: '07/08/2026', status: 'sent', count: 1, avatar: 'E' },
    { id: 'ORD-004', client: 'Enzo', email: 'enzo-jamal.tahirovski@outlook.com', phone: '-', date: '06/08/2026', status: 'sent', count: 1, avatar: 'E' },
    { id: 'ORD-005', client: 'Rose Pebre', email: 'pebre.rose@outlook.fr', phone: '0668950459', date: '09/09/2026', status: 'sent', avatar: 'RP' },
    { id: 'ORD-006', client: 'Agostinelli maria vittoria', email: 'mariavittoriaagostinelli@gmail.com', phone: '0611088445', date: '10/09/2026', status: 'sent', avatar: 'AM' },
    { id: 'ORD-007', client: 'RIEFFEL Rémi', email: 'rieffelremi@hotmail.fr', phone: '0667489221', date: '22/09/2027', status: 'sent', avatar: 'RR' },
    { id: 'ORD-008', client: 'Ervann Roy', email: 'royervann@gmail.com', phone: '0675713228', date: '14/05/2027', status: 'sent', avatar: 'ER' },
    { id: 'ORD-009', client: 'Camille CASSAGNEAU', email: 'camillecassagneau.24@gmail.com', phone: '+33602174451', date: '11/06/2026', status: 'sent', avatar: 'CC' },
    { id: 'ORD-010', client: 'Barbara Battelli', email: 'b.battelli@hotmail.fr', phone: '0685301818', date: '01/10/2026', status: 'rejected', count: 1, avatar: 'BB' },
]

export default function OrdersV2() {
    const [filter, setFilter] = useState('all')

    // Simple filter logic for demo
    const filteredOrders = filter === 'all'
        ? mockOrders
        : mockOrders.filter(o => {
            if (filter === 'pending') return o.status === 'pending';
            if (filter === 'sent') return o.status === 'sent';
            if (filter === 'rejected') return o.status === 'rejected';
            return true;
        })

    return (
        <>
            <style jsx global>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 240 10% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 240 10% 3.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 240 10% 3.9%;
          --primary: 21 100% 60%; 
          --primary-foreground: 0 0% 98%;
          --secondary: 240 4.8% 95.9%;
          --secondary-foreground: 240 5.9% 10%;
          --muted: 240 4.8% 95.9%;
          --muted-foreground: 240 3.8% 46.1%;
          --accent: 240 4.8% 95.9%;
          --accent-foreground: 240 5.9% 10%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 5.9% 90%;
          --input: 240 5.9% 90%;
          --ring: 21 100% 60%;
          --radius: 0.5rem;
        }
        .dark {
          --background: 240 10% 3.9%;
          --foreground: 0 0% 98%;
          --card: 240 10% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 21 100% 60%;
          --primary-foreground: 240 5.9% 10%;
          --secondary: 240 3.7% 15.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 3.7% 15.9%;
          --muted-foreground: 240 5% 64.9%;
          --accent: 240 3.7% 15.9%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 3.7% 15.9%;
          --input: 240 3.7% 15.9%;
          --ring: 21 100% 60%;
        }
        body {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
      `}</style>
            <Script
                src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    if (window.tailwind) {
                        // @ts-ignore
                        window.tailwind.config = {
                            darkMode: "class",
                            theme: {
                                extend: {
                                    colors: {
                                        border: "hsl(var(--border))",
                                        input: "hsl(var(--input))",
                                        ring: "hsl(var(--ring))",
                                        background: "hsl(var(--background))",
                                        foreground: "hsl(var(--foreground))",
                                        primary: {
                                            DEFAULT: "hsl(var(--primary))",
                                            foreground: "hsl(var(--primary-foreground))",
                                        },
                                        secondary: {
                                            DEFAULT: "hsl(var(--secondary))",
                                            foreground: "hsl(var(--secondary-foreground))",
                                        },
                                        destructive: {
                                            DEFAULT: "hsl(var(--destructive))",
                                            foreground: "hsl(var(--destructive-foreground))",
                                        },
                                        muted: {
                                            DEFAULT: "hsl(var(--muted))",
                                            foreground: "hsl(var(--muted-foreground))",
                                        },
                                        accent: {
                                            DEFAULT: "hsl(var(--accent))",
                                            foreground: "hsl(var(--accent-foreground))",
                                        },
                                        popover: {
                                            DEFAULT: "hsl(var(--popover))",
                                            foreground: "hsl(var(--popover-foreground))",
                                        },
                                        card: {
                                            DEFAULT: "hsl(var(--card))",
                                            foreground: "hsl(var(--card-foreground))",
                                        },
                                    },
                                    borderRadius: {
                                        lg: "var(--radius)",
                                        md: "calc(var(--radius) - 2px)",
                                        sm: "calc(var(--radius) - 4px)",
                                    },
                                    fontFamily: {
                                        sans: ["Inter", "sans-serif"],
                                        display: ["Montserrat", "sans-serif"],
                                    },
                                },
                            },
                        }
                    }
                }}
            />

            {/* Google Fonts loaded via layout or we can add here if missing in layout */}
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="min-h-screen bg-background font-sans antialiased">
                <div className="flex min-h-screen">
                    {/* 01. Sidebar using kit styles */}
                    <aside className="w-24 lg:w-72 border-r bg-card flex flex-col items-center py-6 h-screen sticky top-0 z-20">
                        <div className="mb-8 w-full flex justify-center lg:justify-start lg:px-6 items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary-foreground text-lg">local_fire_department</span>
                            </div>
                            <span className="font-display font-bold text-xl hidden lg:block tracking-tight">Fuegos</span>
                        </div>

                        <nav className="flex-1 w-full flex flex-col gap-1 px-3">
                            <a href="#" className="flex items-center h-10 px-3 rounded-md bg-secondary text-secondary-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">shopping_basket</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Pedidos</span>
                            </a>

                            <a href="#" className="flex items-center h-10 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">dashboard</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Dashboard</span>
                            </a>
                            <a href="#" className="flex items-center h-10 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">description</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Presupuestos</span>
                            </a>
                            <a href="#" className="flex items-center h-10 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">payments</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Pagos</span>
                            </a>
                        </nav>

                        <div className="mt-auto w-full px-3 pt-4 border-t hidden lg:block space-y-2">
                            <button className="flex items-center w-full h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors px-3 text-sm font-medium">
                                <span className="material-symbols-outlined text-lg mr-3">settings</span>
                                Configuración
                            </button>
                            <button
                                className="flex items-center w-full h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors px-3 text-sm font-medium"
                                onClick={() => document.documentElement.classList.toggle('dark')}
                            >
                                <span className="material-symbols-outlined text-lg mr-3">dark_mode</span>
                                Tema
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
                        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="text-3xl font-bold font-display tracking-tight text-foreground mb-1">Pedidos</h1>
                                <p className="text-muted-foreground text-sm">
                                    Gestiona y administra las solicitudes entrantes.
                                </p>
                            </div>
                            <button className="bg-primary hover:opacity-90 text-primary-foreground shadow h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                Nuevo Pedido
                            </button>
                        </header>

                        {/* 03. Actual Stats from PROD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
                                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Pedidos Actuales</h3>
                                    <span className="material-symbols-outlined text-muted-foreground text-lg">package_2</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-4xl font-bold font-display">82</div>
                                </div>
                                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/10 to-transparent"></div>
                            </div>

                            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
                                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Devis Externos</h3>
                                    <span className="material-symbols-outlined text-muted-foreground text-lg">folder_open</span>
                                </div>
                                <div className="mt-2">
                                    <div className="text-4xl font-bold font-display">462</div>
                                </div>
                                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
                            </div>
                        </div>

                        {/* 04. Updated Filters (Search + Date + Status) */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="relative w-full">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">search</span>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Buscar por nombre, email..."
                                    type="text"
                                />
                            </div>

                            {/* Bottom Row: Filters */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Status Select Mock */}
                                <div className="relative">
                                    <select
                                        className="h-10 w-40 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="pending">Pendiente</option>
                                        <option value="sent">Enviado</option>
                                        <option value="rejected">Rechazado</option>
                                    </select>
                                </div>

                                {/* Date Inputs */}
                                <input type="date" className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                                <input type="date" className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />

                                {/* Clear Button */}
                                <button
                                    className="h-10 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium transition-colors ml-auto"
                                    onClick={() => setFilter('all')}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        {/* 05. Table (Shadcn Table) */}
                        <div className="rounded-md border bg-card mb-4">
                            <div className="p-4 border-b">
                                <h3 className="text-sm font-medium text-muted-foreground">{filteredOrders.length} resultados</h3>
                            </div>
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm text-left">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Cliente</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contacto</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha Evento</th>
                                            <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Estado</th>
                                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                                order.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                                                                    order.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                        'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {order.avatar}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-foreground">{order.client}</span>
                                                            {/* @ts-ignore */}
                                                            {order.count && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 rounded-full w-fit mt-0.5 border border-slate-200 dark:border-slate-700">{order.count}</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm">{order.email}</span>
                                                        <span className="text-xs text-muted-foreground">{order.phone}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-base text-muted-foreground">calendar_today</span>
                                                        {order.date}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-center">
                                                    {order.status === 'pending' && (
                                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900 dark:text-amber-100">
                                                            Pendiente
                                                        </div>
                                                    )}
                                                    {order.status === 'sent' && (
                                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-100">
                                                            Enviado
                                                        </div>
                                                    )}
                                                    {order.status === 'rejected' && (
                                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/40 dark:text-white">
                                                            Rechazado
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <button className="ghost h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground rounded-md inline-flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <span className="text-sm text-muted-foreground mr-4">Página 1 de 9</span>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                                Anterior
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                                Siguiente
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
