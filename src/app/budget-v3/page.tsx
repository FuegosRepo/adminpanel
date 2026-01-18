'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function BudgetV3() {
    return (
        <>
            <style jsx global>{`
         body { background-color: #f8fafc; } /* slate-50 */
      `}</style>
            <Script src="https://cdn.tailwindcss.com?plugins=forms" strategy="afterInteractive" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="min-h-screen font-sans text-slate-800 pb-20">

                {/* Top Navbar Simple */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3">
                        <a href="/orders-v3" className="text-slate-500 hover:text-indigo-600 flex items-center">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </a>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">Wagner Maéva</h1>
                            <span className="text-xs text-slate-500">Editando presupuesto v9</span>
                        </div>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase tracking-wide ml-2">Pending Review</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="text-slate-500 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">save</span>
                            Guardar Cambios
                        </button>
                    </div>
                </nav>

                <main className="max-w-6xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Content (Form) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Section 1: Client Info */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-500">person</span>
                                    Información del Cliente
                                </h2>
                                <button className="text-indigo-600 text-sm font-medium hover:underline">Editar</button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                                    <input type="text" value="Wagner Maéva" className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" readOnly />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</label>
                                    <input type="text" value="maevawagner@hotmail.fr" className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" readOnly />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Dirección</label>
                                    <input type="text" value="76 chemin des puverels 06580 Pégomas" className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" readOnly />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Menu */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-500">restaurant_menu</span>
                                    Configuración del Menú
                                </h2>
                            </div>

                            {/* Key Metrics Bar within Menu */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                                <div className="p-4 text-center">
                                    <span className="block text-2xl font-bold text-slate-900">€42</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase">Precio/Persona</span>
                                </div>
                                <div className="p-4 text-center">
                                    <span className="block text-2xl font-bold text-slate-900">50</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase">Invitados</span>
                                </div>
                                <div className="p-4 text-center">
                                    <span className="block text-2xl font-bold text-slate-900">10%</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase">TVA</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Entradas Group */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-l-4 border-indigo-500 pl-2">Entradas</h3>
                                        <button className="text-xs text-indigo-600 font-semibold flex items-center hover:bg-indigo-50 px-2 py-1 rounded">
                                            <span className="material-symbols-outlined text-sm mr-1">add</span> Agregar
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors group">
                                            <span className="text-sm font-medium text-slate-700">Brochettes de jambon ibérique</span>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                        </li>
                                        <li className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors group">
                                            <span className="text-sm font-medium text-slate-700">Miniburger maison au brasero</span>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Carnes Group */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-l-4 border-orange-500 pl-2">Carnes</h3>
                                        <button className="text-xs text-indigo-600 font-semibold flex items-center hover:bg-indigo-50 px-2 py-1 rounded">
                                            <span className="material-symbols-outlined text-sm mr-1">add</span> Agregar
                                        </button>
                                    </div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-orange-300 transition-colors group">
                                            <span className="text-sm font-medium text-slate-700">Côte de bœuf ou Tomahawk</span>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                        </li>
                                        <li className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-orange-300 transition-colors group">
                                            <span className="text-sm font-medium text-slate-700">Magret de Canard</span>
                                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-500">Subtotal Menú</span>
                                <span className="text-lg font-bold text-slate-800">2310.00 € <span className="text-xs font-normal text-slate-400 ml-1">(TTC)</span></span>
                            </div>
                        </section>

                        {/* Section 3: Material - Simple List */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
                            <h2 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <span className="material-symbols-outlined text-blue-500">chair</span>
                                Material y Equipamiento
                            </h2>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded">
                                        <span className="material-symbols-outlined text-lg">weekend</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-800">Material de Evento</h4>
                                        <p className="text-xs text-slate-500">Mesas, sillas, carpas...</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-700">€850.00</span>
                            </div>
                            <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">add_circle</span> Agregar otro servicio
                            </button>
                        </section>

                    </div>

                    {/* Right Sidebar (Totals & Sticky) */}
                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500">receipt_long</span>
                                Resumen Final
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total HT</span>
                                    <span className="font-medium text-slate-900">3324.30 €</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Total TVA (mix)</span>
                                    <span className="font-medium text-slate-900">454.86 €</span>
                                </div>
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-slate-700">Total a Pagar</span>
                                    <span className="text-3xl font-black text-indigo-600 tracking-tight">3779.16 €</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-lg shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                    Descargar PDF
                                </button>
                                <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">send</span>
                                    Enviar por Email
                                </button>
                            </div>
                        </div>

                        {/* Notes Input Simple */}
                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
                            <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined">sticky_note_2</span>
                                Notas del Presupuesto
                            </h4>
                            <p className="text-xs text-amber-700 mb-3">Estas notas aparecerán visiblemente en el PDF final.</p>
                            <textarea
                                className="w-full bg-white border border-amber-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[100px]"
                                placeholder="Escribe aquí las notas..."
                            ></textarea>
                        </div>

                    </div>

                </main>
            </div>
        </>
    )
}
