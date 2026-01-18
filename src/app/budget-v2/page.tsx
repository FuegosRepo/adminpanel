'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function BudgetV2() {
    // Toggle simulation
    const [activeTab, setActiveTab] = useState('menu')

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
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <div className="min-h-screen bg-background font-sans antialiased text-foreground">
                <div className="flex min-h-screen">

                    {/* 01. Sidebar using kit styles (Reused) */}
                    <aside className="w-20 lg:w-64 border-r bg-card hidden md:flex flex-col items-center py-6 h-screen sticky top-0 z-20">
                        <div className="mb-8 w-full flex justify-center lg:justify-start lg:px-6 items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary-foreground text-lg">local_fire_department</span>
                            </div>
                            <span className="font-display font-bold text-xl hidden lg:block tracking-tight">Fuegos</span>
                        </div>

                        <nav className="flex-1 w-full flex flex-col gap-1 px-3">
                            <a href="#" className="flex items-center h-10 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">shopping_basket</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Pedidos</span>
                            </a>
                            <a href="#" className="flex items-center h-10 px-3 rounded-md bg-secondary text-secondary-foreground transition-colors group/item">
                                <span className="material-symbols-outlined text-xl shrink-0">description</span>
                                <span className="ml-3 text-sm font-medium hidden lg:block">Presupuestos</span>
                            </a>
                            {/* ... other links */}
                        </nav>
                    </aside>

                    {/* Main Content: Budget Editor */}
                    <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto bg-muted/10">

                        {/* Header */}
                        <header className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                    WM
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-2xl font-bold font-display tracking-tight">Wagner Maéva</h1>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80">
                                            pending_review
                                        </span>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            v9
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">calendar_today</span> 27/03/2027</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">mail</span> maevawagner@hotmail.fr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-10 w-10">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                                <button className="bg-primary hover:opacity-90 text-primary-foreground shadow h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    Guardar
                                </button>
                            </div>
                        </header>

                        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Editor Forms */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* 1. Client Info Accordion-style Card */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg leading-none tracking-tight flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">person</span>
                                                Información del Cliente
                                            </h3>
                                            <span className="material-symbols-outlined text-muted-foreground transition-transform">expand_less</span>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre</label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value="Wagner Maéva" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none">Email</label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value="maevawagner@hotmail.fr" readOnly />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium leading-none">Dirección</label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value="76 chemin des puverels 06580 Pégomas" readOnly />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Tipo Evento</label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                                    <option>Mariage</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none">Tipo Menú</label>
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                                                    <option>Dîner</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Menu Section */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-lg leading-none tracking-tight flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                                                Menú
                                            </h3>
                                            <span className="material-symbols-outlined text-muted-foreground">expand_less</span>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0 space-y-6">
                                        {/* Global Menu Stats */}
                                        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg border">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground uppercase">Precio/Persona</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold">€42</span>
                                                    <button className="text-muted-foreground hover:text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground uppercase">Invitados</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold">50</span>
                                                    <button className="text-muted-foreground hover:text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground uppercase">TVA</label>
                                                <span className="text-lg font-bold">10%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-b pb-2">
                                            <h4 className="font-medium text-sm text-foreground">Selección de Platos</h4>
                                            <button className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-base">menu_book</span> Abrir Catálogo
                                            </button>
                                        </div>

                                        {/* Entradas */}
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Entradas</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 group">
                                                    <div className="flex-1 h-10 px-3 rounded-md border bg-background flex items-center text-sm shadow-sm group-hover:border-primary/50 transition-colors">
                                                        Brochettes de jambon ibérique
                                                    </div>
                                                    <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 group">
                                                    <div className="flex-1 h-10 px-3 rounded-md border bg-background flex items-center text-sm shadow-sm group-hover:border-primary/50 transition-colors">
                                                        Miniburger maison au brasero
                                                    </div>
                                                    <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors h-9 px-2">
                                                    <span className="material-symbols-outlined text-lg">add</span>
                                                    Agregar entrada manual...
                                                </button>
                                            </div>
                                        </div>

                                        {/* Carnes */}
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Carnes</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 group">
                                                    <div className="flex-1 h-10 px-3 rounded-md border bg-background flex items-center text-sm shadow-sm group-hover:border-primary/50 transition-colors">
                                                        Côte de bœuf ou Tomahawk
                                                    </div>
                                                    <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 group">
                                                    <div className="flex-1 h-10 px-3 rounded-md border bg-background flex items-center text-sm shadow-sm group-hover:border-primary/50 transition-colors">
                                                        Magret de Canard
                                                    </div>
                                                    <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors h-9 px-2">
                                                    <span className="material-symbols-outlined text-lg">add</span>
                                                    Agregar carne manual...
                                                </button>
                                            </div>
                                        </div>

                                        {/* Postres */}
                                        <div className="space-y-3">
                                            <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Postres</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 group">
                                                    <div className="flex-1 h-10 px-3 rounded-md border bg-background flex items-center text-sm shadow-sm group-hover:border-primary/50 transition-colors">
                                                        Pièce montée ou gâteau d'anniversaire prévu
                                                    </div>
                                                    <button className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">Total HT</span>
                                                <span className="font-medium">2100.00 €</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-1">
                                                <span className="text-muted-foreground">TVA (10%)</span>
                                                <span className="font-medium">210.00 €</span>
                                            </div>
                                            <div className="flex justify-between items-center text-base mt-2 font-bold text-foreground">
                                                <span>Total TTC</span>
                                                <span>2310.00 €</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Sections Collapsed Style */}
                                <div className="space-y-4">
                                    {/* Material */}
                                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">chair</span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm leading-none">Material</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Mesas, sillas, carpas...</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">€850.00</span>
                                            <button className="text-muted-foreground hover:text-destructive p-1 rounded-full"><span className="material-symbols-outlined text-lg">delete</span></button>
                                            <span className="material-symbols-outlined text-muted-foreground">expand_more</span>
                                        </div>
                                    </div>

                                    {/* Placeholders for Empty Sections */}
                                    <button className="w-full rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 text-muted-foreground hover:text-foreground h-14 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                                        <span className="material-symbols-outlined text-lg">add_circle</span>
                                        Agregar Servicio
                                    </button>
                                    <button className="w-full rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 text-muted-foreground hover:text-foreground h-14 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                                        <span className="material-symbols-outlined text-lg">add_circle</span>
                                        Agregar Boissons Soft
                                    </button>
                                    <button className="w-full rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 text-muted-foreground hover:text-foreground h-14 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                                        <span className="material-symbols-outlined text-lg">local_shipping</span>
                                        Agregar Desplazamiento
                                    </button>
                                </div>

                            </div>

                            {/* Right Column: Calculations & Actions */}
                            <div className="space-y-6">

                                {/* 💰 Totales Finales Card */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm sticky top-24">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b">
                                        <h3 className="font-semibold text-lg leading-none tracking-tight flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">payments</span>
                                            Totales Finales
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Total HT Global</span>
                                                <span className="font-medium text-foreground">3324.30 €</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Total TVA Global</span>
                                                <span className="font-medium text-foreground">454.86 €</span>
                                            </div>
                                            <div className="border-t my-2"></div>
                                            <div className="flex justify-between items-center text-xl font-bold text-primary">
                                                <span>TOTAL A PAGAR</span>
                                                <span>3779.16 €</span>
                                            </div>
                                            <p className="text-xs text-center text-muted-foreground mt-2 bg-muted rounded py-1">TTC (Impuestos incluidos)</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 pt-2">
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 shadow-sm w-full">
                                                <span className="material-symbols-outlined text-lg mr-2">picture_as_pdf</span> Generar PDF
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full">
                                                <span className="material-symbols-outlined text-lg mr-2">mark_email_read</span> Marcar como Enviado
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full">
                                                <span className="material-symbols-outlined text-lg mr-2">send</span> Enviar Presupuesto
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                                    <div className="p-6 space-y-4">
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                            <span className="material-symbols-outlined text-muted-foreground">lock</span>
                                            Notas Internas <span className="bg-muted text-foreground text-[10px] px-1.5 py-0.5 rounded-full">0</span>
                                        </h4>
                                        <div className="text-xs text-muted-foreground italic text-center py-4 border-2 border-dashed rounded-lg bg-muted/5">
                                            Sin notas aún
                                        </div>
                                        <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1 justify-center w-full">
                                            + Agregar nota
                                        </button>

                                        <div className="border-t my-4"></div>

                                        <h4 className="font-medium text-sm flex items-center gap-2 text-foreground">
                                            <span className="material-symbols-outlined text-muted-foreground">edit_note</span>
                                            Notas del administrador
                                        </h4>
                                        <p className="text-xs text-muted-foreground mb-2">Visible para el cliente en el PDF.</p>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Ej: Ofrecemos un descuento especial..."
                                        ></textarea>
                                        <div className="flex justify-end">
                                            <button className="text-xs font-medium text-primary hover:underline mt-2">Guardado</button>
                                        </div>
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
