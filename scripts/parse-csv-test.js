const fs = require('fs');
const path = require('path');

// Leer el CSV
const csvPath = 'c:\\Users\\FrancoCorujo\\FuegosDirectorio\\PanelAdmin\\csv\\BOUCHENY Jean Luc - Respuestas.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Split por líneas
const lines = csvContent.split('\n');
console.log(`Total de líneas: ${lines.length}`);

// La primera línea son los headers
const headers = lines[0].split(',');
console.log(`\nHeaders encontrados: ${headers.length}`);
console.log('Primeros 10 headers:');
headers.slice(0, 10).forEach((h, i) => {
    console.log(`  ${i}: ${h.trim()}`);
});

// Parsear las primeras 5 filas de datos
console.log('\n\nPrimeras 5 filas de datos:');
for (let i = 1; i <= 5 && i < lines.length; i++) {
    const values = lines[i].split(',');
    console.log(`\nFila ${i}:`);
    console.log(`  - Email: ${values[1]}`);
    console.log(`  - Nombre: ${values[2]}`);
    console.log(`  - Teléfono: ${values[3]}`);
    console.log(`  - Fecha evento: ${values[4]}`);
    console.log(`  - Tipo evento: ${values[5]}`);
    console.log(`  - Estado: ${values[18] || 'N/A'}`);
}
