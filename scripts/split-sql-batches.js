const fs = require('fs');

// Leer el archivo SQL completo
const sqlContent = fs.readFileSync('database/add_external_budgets.sql', 'utf8');

// Extraer solo los INSERTs
const insertStart = sqlContent.indexOf('-- Insert data');
const insertsSection = sqlContent.substring(insertStart);

// Dividir en statements individuales
const insertStatements = insertsSection
    .split('INSERT INTO external_budgets')
    .filter(s => s.trim().length > 0)
    .map(s => 'INSERT INTO external_budgets' + s.trim());

console.log(`Total INSERT statements: ${insertStatements.length}`);

// Crear archivos de migración en lotes de 100
const batchSize = 100;
const batches = [];

for (let i = 0; i < insertStatements.length; i += batchSize) {
    const batch = insertStatements.slice(i, i + batchSize);
    batches.push(batch.join('\n'));
}

console.log(`Creating ${batches.length} batch files...`);

batches.forEach((batch, index) => {
    const filename = `database/insert_external_budgets_batch_${index + 1}.sql`;
    fs.writeFileSync(filename, batch);
    console.log(`Created ${filename} with ${batch.split('INSERT').length - 1} records`);
});

console.log('\n✅ Batch files created successfully!');
console.log(`Run these files in sequence to import all data.`);
