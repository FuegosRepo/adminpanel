const { createClient } = require('@supabase/supabase-js');
const Papa = require('papaparse');
const fs = require('fs');

// Configuración de Supabase
const supabaseUrl = 'https://fygptwzqzjgomumixuqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5Z3B0d3pxempnb211bWl4dXFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjg3NzEzNywiZXhwIjoyMDc4NDUzMTM3fQ.bqjCMQpVG7VuVutmX_CQ4As2mhJ_mwCcTnVQhr7g1Wg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Leer CSV
const csvPath = 'c:\\Users\\FrancoCorujo\\FuegosDirectorio\\PanelAdmin\\csv\\BOUCHENY Jean Luc - Respuestas.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parsear CSV
const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
});

console.log(`📊 Total registros en CSV: ${parsed.data.length}`);

// Helper functions
function parseDate(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const fullYear = year.length === 4 ? year : (parseInt(year) > 50 ? `19${year}` : `20${year}`);
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
}

function parseTimestamp(timestampStr) {
    if (!timestampStr) return null;

    // Format: "16/07/2024 15:07:52"
    const [datePart, timePart] = timestampStr.split(' ');
    if (!datePart) return null;

    const parts = datePart.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const fullYear = year.length === 4 ? year : (parseInt(year) > 50 ? `19${year}` : `20${year}`);
        const time = timePart || '00:00:00';
        // Return ISO format: YYYY-MM-DD HH:MM:SS
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
    }
    return null;
}

function parseStatus(estado) {
    if (!estado) return 'pending';
    const lower = estado.toLowerCase();
    if (lower.includes('aceptado') || lower.includes('accepted')) return 'accepted';
    if (lower.includes('rechazado') || lower.includes('rejected')) return 'rejected';
    if (lower.includes('enviado') || lower.includes('sent')) return 'sent';
    return 'pending';
}

// Preparar datos para insertar
const budgetsToInsert = [];

parsed.data.forEach((row, index) => {
    const email = row['Dirección de correo electrónico'];
    const nombre = row['Nom et prénom'];
    const telefono = row['Téléphone'];

    if (!email || !nombre) {
        console.log(`⏭️  Skipping row ${index + 1}: missing email or name`);
        return;
    }

    const budget = {
        client_name: nombre,
        client_email: email,
        client_phone: telefono || 'N/A',  // Default value instead of empty string
        event_date: parseDate(row['Date de votre événement']),
        event_type: row['Nature de votre événement'] || null,
        event_address: row['Adresse de l\'événement'] || null,
        guest_count: row['Nombre d\'invités'] || null,
        meal_type: row['Déjeuner ou dîner \nPrestations du midi : Bénéficiez d\'une remise de 10 %'] || row['Déjeuner ou dîner'] || null,
        status: parseStatus(row['Estado']),
        categoria: row['Categoria'] || null,
        admin_comments: row['Comenatrios'] || row['Comentarios'] || null,
        original_timestamp: parseTimestamp(row['Marca temporal'])
    };

    budgetsToInsert.push(budget);
});

console.log(`✅ Registros válidos para insertar: ${budgetsToInsert.length}`);

// Test with first record
async function testInsert() {
    console.log('\n🧪 Probando con el primer registro...');
    console.log(JSON.stringify(budgetsToInsert[0], null, 2));

    const { data, error } = await supabase
        .from('external_budgets')
        .insert([budgetsToInsert[0]]);

    if (error) {
        console.error('\n❌ Error details:', JSON.stringify(error, null, 2));
    } else {
        console.log('\n✅ Primer registro insertado correctamente!');
        console.log('\nProcediendo con el resto...\n');
        return insertInBatches();
    }
}

// Insertar en lotes de 50
async function insertInBatches() {
    const batchSize = 50;
    let inserted = 0;
    let errors = 0;

    for (let i = 1; i < budgetsToInsert.length; i += batchSize) {
        const batch = budgetsToInsert.slice(i, i + batchSize);

        console.log(`📤 Insertando lote ${Math.floor(i / batchSize) + 1} (${batch.length} registros)...`);

        const { data, error } = await supabase
            .from('external_budgets')
            .insert(batch);

        if (error) {
            console.error(`❌ Error en lote ${Math.floor(i / batchSize) + 1}:`, error.message);
            errors += batch.length;
        } else {
            inserted += batch.length;
            console.log(`✅ Lote ${Math.floor(i / batchSize) + 1} insertado correctamente`);
        }
    }

    console.log(`\n📊 RESUMEN:`);
    console.log(`   ✅ Insertados: ${inserted + 1}`); // +1 for test record
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📝 Total: ${budgetsToInsert.length}`);
}

// Ejecutar
testInsert().catch(console.error);
