'use client'

import Script from 'next/script'
import { useState } from 'react'

// Mock Data sourced from real /orders page (Same as V2)
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

export default function OrdersV3() {
    const [filter, setFilter] = useState('all')

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
         /* NO custom CSS variables here, just raw Tailwind classes for "Pure Tailwind" look */
         body {
             background-color: #f3f4f6; /* gray-100 */
         }
      `}</style>
            <Script src="https://cdn.tailwindcss.com?plugins=forms" strategy="afterInteractive" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
                <div className="flex min-h-screen">

                    {/* Sidebar - Traditional Dashboard Style (Dark Blue?) or simple White */}
                    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
                        <div className="h-16 flex items-center px-6 border-b border-gray-100">
                            <span className="text-xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                                Fuegos
                            </span>
                        </div>

                        <nav className="flex-1 p-4 space-y-1">
                            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                                <span className="material-symbols-outlined font-normal">shopping_basket</span>
                                Pedidos
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-gray-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
                                <span className="material-symbols-outlined font-normal">dashboard</span>
                                Dashboard
                            </a>
                            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-gray-50 hover:text-slate-900 rounded-lg font-medium transition-colors">
                                <span className="material-symbols-outlined font-normal">description</span>
                                Presupuestos
                            </a>
                        </nav>

                        <div className="p-4 border-t border-gray-100">
                            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 text-sm font-medium hover:text-slate-900">
                                <span className="material-symbols-outlined font-normal text-lg">settings</span>
                                Configuración
                            </a>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        {/* Top Navigation / Header */}
                        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                            <h1 className="text-xl font-bold text-slate-800">Pedidos</h1>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm shadow-indigo-200 transition-all">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Nuevo Pedido
                                </button>
                            </div>
                        </header>

                        <div className="p-8 max-w-7xl mx-auto space-y-8">

                            {/* Stats - Colorful Cards style */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Pedidos Actuales</p>
                                        <h3 className="text-3xl font-bold text-slate-900">82</h3>
                                    </div>
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                        <span className="material-symbols-outlined block text-2xl">package_2</span>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-1">Devis Externos</p>
                                        <h3 className="text-3xl font-bold text-slate-900">462</h3>
                                    </div>
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <span className="material-symbols-outlined block text-2xl">folder_open</span>
                                    </div>
                                </div>
                            </div>

                            {/* Filters & Table Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                                {/* Filters Bar */}
                                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
                                    <div className="relative w-full md:w-96">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                        <input
                                            type="text"
                                            placeholder="Buscar pedido..."
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <select
                                            className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                        >
                                            <option value="all">Todos</option>
                                            <option value="pending">Pendientes</option>
                                            <option value="sent">Enviados</option>
                                        </select>
                                        <input type="date" className="p-2 bg-white border border-gray-200 rounded-lg text-sm text-slate-500" />
                                    </div>
                                </div>

                                {/* Traditional Data Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                                <th className="px-6 py-4">Cliente</th>
                                                <th className="px-6 py-4">Contacto</th>
                                                <th className="px-6 py-4">Fecha Evento</th>
                                                <th className="px-6 py-4 text-center">Estado</th>
                                                <th className="px-6 py-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredOrders.map(order => (
                                                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-6 py-4 align-middle">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm
                                                        ${['WM', 'KL'].includes(order.avatar) ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-slate-400 to-slate-500'}
                                                     `}>
                                                                {order.avatar}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{order.client}</p>
                                                                {/* @ts-ignore */}
                                                                {order.count && <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-full font-bold uppercase tracking-wide">Count: {order.count}</span>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-sm text-slate-600">
                                                        <div className="flex flex-col">
                                                            <span>{order.email}</span>
                                                            <span className="text-slate-400">{order.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-sm font-medium text-slate-700">
                                                        {order.date}
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-center">
                                                        {order.status === 'pending' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                                                                Pendiente
                                                            </span>
                                                        )}
                                                        {order.status === 'sent' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                                                Enviado
                                                            </span>
                                                        )}
                                                        {order.status === 'rejected' && (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                                                Rechazado
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 align-middle text-right">
                                                        <button className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-all">
                                                            <span className="material-symbols-outlined text-xl">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination Simple */}
                                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Mostrando 1-10 de 82</span>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-slate-600 hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
                                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-slate-600 hover:bg-gray-50">Siguiente</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
