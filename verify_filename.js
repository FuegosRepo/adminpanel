
const { getBudgetPDFFilename } = require('./src/lib/budgetPDFService');

// Mock BudgetData
const mockBudgetData = {
    clientInfo: {
        name: 'Devis Franco Corujo',
        eventDate: '2026-08-07T12:00:00Z',
        email: 'franco@example.com'
    },
    generatedAt: new Date().toISOString()
};

const filename = getBudgetPDFFilename(mockBudgetData);
console.log('Resulting Filename:', filename);

if (filename === 'Devis Devis Franco Corujo - 07-08-2026.pdf') {
    console.log('✅ TEST PASSED');
} else {
    console.log('❌ TEST FAILED');
}

// Test with problematic characters
const mockData2 = {
    clientInfo: {
        name: 'Franco / Corujo: Test',
        eventDate: '2026-08-07T12:00:00Z'
    },
    generatedAt: new Date().toISOString()
};

const filename2 = getBudgetPDFFilename(mockData2);
console.log('Problematic Name Result:', filename2);
if (filename2 === 'Devis Franco  Corujo Test - 07-08-2026.pdf') {
    console.log('✅ CLEANUP TEST PASSED');
}
