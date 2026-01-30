
import { getBudgetPDFFilename } from './src/lib/budgetPDFService';

const mockBudgetData = {
    clientInfo: {
        name: 'Devis Franco Corujo',
        eventDate: '2026-08-07T12:00:00Z',
        email: 'franco@example.com'
    },
    generatedAt: new Date().toISOString()
};

const filename = getBudgetPDFFilename(mockBudgetData as any);
console.log('Resulting Filename:', filename);

if (filename === 'Devis Devis Franco Corujo - 07-08-2026.pdf') {
    console.log('✅ TEST PASSED');
} else {
    console.log('❌ TEST FAILED');
}
