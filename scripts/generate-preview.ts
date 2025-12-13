
import { generateBudgetHTML } from '../src/lib/budgetPDFTemplate';
import { BudgetData } from '../src/lib/types/budget';
import fs from 'fs';
import path from 'path';

const mockBudgetData: BudgetData = {
    clientInfo: {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        eventDate: '2026-06-15',
        eventType: 'Mariage',
        guestCount: 80,
        menuType: 'diner',
        address: 'Château de la Napoule, Mandelieu'
    },
    menu: {
        entrees: [{ name: 'Empanadas' }, { name: 'Provoleta' }],
        viandes: [{ name: 'Bife de Chorizo' }, { name: 'Asado de Tira' }],
        accompagnements: ['Salade Mixte', 'Légumes Grillés'],
        dessert: { name: 'Flan au Dulce de Leche' },
        totalHT: 3200,
        tva: 320,
        tvaPct: 10,
        totalTTC: 3520
    },
    material: {
        items: [
            { name: 'Assiettes plates', quantity: 80, price: 0.5 },
            { name: 'Verres de vin', quantity: 80, price: 0.3 },
            { name: 'Verres d\'eau', quantity: 80, price: 0.3 }
        ],
        totalHT: 500,
        tva: 100,
        tvaPct: 20,
        totalTTC: 600,
        insuranceAmount: 30,
        insurancePct: 6
    },
    service: {
        mozos: 4,
        hours: 6,
        totalHT: 800,
        tva: 160,
        tvaPct: 20,
        totalTTC: 960
    },
    deplacement: {
        distance: 50,
        totalHT: 100,
        tva: 20,
        tvaPct: 20,
        totalTTC: 120
    },
    deliveryReprise: {
        deliveryCost: 50,
        pickupCost: 50,
        totalHT: 100,
        tva: 20,
        tvaPct: 20,
        totalTTC: 120
    },
    totals: {
        totalHT: 4700,
        totalTVA: 620,
        totalTTC: 5320,
        discount: {
            amount: 100,
            percentage: 2,
            reason: 'Remise commerciale'
        }
    },
    generatedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
};

try {
    const html = generateBudgetHTML(mockBudgetData);
    const outputPath = path.join(process.cwd(), 'public', 'preview.html');
    fs.writeFileSync(outputPath, html);
    console.log(`Preview generated at: ${outputPath}`);
} catch (error) {
    console.error('Error generating preview:', error);
}
