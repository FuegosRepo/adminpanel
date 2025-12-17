import React from 'react'
import { generateBudgetHTML } from '@/lib/budgetPDFTemplate'
import { BudgetData } from '@/lib/types/budget'

export default function PDFPreviewPage() {
    // Mock Data for Preview
    const mockData: BudgetData = {
        clientInfo: {
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            phone: '+33 6 12 34 56 78',
            eventType: 'Mariage',
            eventDate: '2025-06-15',
            guestCount: 80,
            menuType: 'diner',
            address: 'Château de la Napoule, 06210 Mandelieu-la-Napoule'
        },
        menu: {
            pricePerPerson: 45,
            totalPersons: 80,
            totalHT: 3600,
            tvaPct: 10,
            tva: 360,
            totalTTC: 3960,
            entrees: [
                { name: "Empanadas", quantity: 80, pricePerUnit: 0, total: 0 },
                { name: "Miniburger", quantity: 80, pricePerUnit: 0, total: 0 },
                { name: "Choripan", quantity: 80, pricePerUnit: 0, total: 0 }
            ],
            viandes: [
                { name: "Entrecôte / Ojo de bife / Ribeye (Argentine)", quantity: 40, pricePerUnit: 0, total: 0 },
                { name: "Vacio / Bavette d'aloyau", quantity: 40, pricePerUnit: 0, total: 0 }
            ],
            dessert: { name: "Fruits grille", quantity: 80, pricePerUnit: 0, total: 0 },
            accompagnements: [] // Required by interface
        },
        material: {
            items: [
                { name: "Assiettes plates", quantity: 80, pricePerUnit: 0.5, total: 40 },
                { name: "Verres de vin", quantity: 80, pricePerUnit: 0.3, total: 24 }
            ],
            totalHT: 64,
            tvaPct: 20,
            tva: 12.8,
            totalTTC: 76.8,
            insurancePct: 6,
            insuranceAmount: 3.84
        },
        service: {
            mozos: 4,
            hours: 6,
            pricePerHour: 35,
            totalHT: 840,
            tvaPct: 20,
            tva: 168,
            totalTTC: 1008
        },
        deplacement: {
            distance: 50,
            pricePerKm: 2,
            totalHT: 100,
            tvaPct: 20,
            tva: 20,
            totalTTC: 120
        },
        deliveryReprise: {
            deliveryCost: 50,
            pickupCost: 50,
            totalHT: 100,
            tvaPct: 20,
            tva: 20,
            totalTTC: 120
        },
        totals: {
            totalHT: 4704,
            totalTVA: 580.8,
            totalTTC: 5284.8,
            discount: {
                reason: 'Promotion Saisonnière',
                percentage: 0,
                amount: 0
            }
        },
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    const html = generateBudgetHTML(mockData)

    return (
        <div style={{ width: '100%', height: '100vh', padding: 0, margin: 0 }}>
            <iframe
                srcDoc={html}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="PDF Preview"
            />
        </div>
    )
}
