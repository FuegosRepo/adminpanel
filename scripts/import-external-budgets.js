const fs = require('fs');
const Papa = require('papaparse');

// Leer el CSV
const csvPath = 'c:\\Users\\FrancoCorujo\\FuegosDirectorio\\PanelAdmin\\csv\\BOUCHENY Jean Luc - Respuestas.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parsear con papaparse
const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false
});

console.log(`Total de registros parseados: ${parsed.data.length}`);
console.log(`Headers: ${Object.keys(parsed.data[0]).length}`);

// Mostrar los primeros headers
console.log('\n=== HEADERS ===');
Object.keys(parsed.data[0]).slice(0, 15).forEach((key, i) => {
    console.log(`${i + 1}. ${key}`);
});

// Mostrar los primeros 3 registros
console.log('\n=== PRIMEROS 3 REGISTROS ===');
parsed.data.slice(0, 3).forEach((row, i) => {
    console.log(`\n--- Registro ${i + 1} ---`);
    console.log(`Email: ${row['Dirección de correo electrónico']}`);
    console.log(`Nombre: ${row['Nom et prénom']}`);
    console.log(`Teléfono: ${row['Téléphone']}`);
    console.log(`Fecha: ${row['Date de votre événement']}`);
    console.log(`Evento: ${row['Nature de votre événement']}`);
    console.log(`Dirección: ${row['Adresse de l\'événement']}`);
    console.log(`Personas: ${row['Nombre d\'invités']}`);
    console.log(`Estado: ${row['Estado']}`);
    console.log(`Categoría: ${row['Categoria']}`);
});

// Generar SQL
console.log('\n\n=== GENERANDO SQL ===');

const sqlStatements = [];

// Create table
const createTableSQL = `
-- Tabla para devis externos importados
CREATE TABLE IF NOT EXISTS external_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Información del cliente
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  
  -- Detalles del evento
  event_date DATE,
  event_type TEXT,
  event_address TEXT,
  guest_count TEXT,
  meal_type TEXT,
  
  -- Estado y gestión  
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Datos adicionales
  notes TEXT,
  admin_comments TEXT,
  categoria TEXT,
  
  -- Metadata de importación
  imported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  original_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_external_budgets_email ON external_budgets(client_email);
CREATE INDEX IF NOT EXISTS idx_external_budgets_date ON external_budgets(event_date);
CREATE INDEX IF NOT EXISTS idx_external_budgets_status ON external_budgets(status);
CREATE INDEX IF NOT EXISTS idx_external_budgets_name ON external_budgets(client_name);

-- RLS Policies
ALTER TABLE external_budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON external_budgets;
CREATE POLICY "Enable read access for authenticated users" ON external_budgets
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON external_budgets;
CREATE POLICY "Enable insert for authenticated users" ON external_budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON external_budgets;
CREATE POLICY "Enable update for authenticated users" ON external_budgets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON external_budgets;
CREATE POLICY "Enable delete for authenticated users" ON external_budgets
  FOR DELETE
  TO authenticated
  USING (true);
`;

sqlStatements.push(createTableSQL);

// Helper functions
function escapeSQL(str) {
    if (!str) return null;
    return str.replace(/'/g, "''");
}

function parseDate(dateStr) {
    if (!dateStr) return null;

    // Try parsing different formats
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        const fullYear = year.length === 4 ? year : (parseInt(year) > 50 ? `19${year}` : `20${year}`);
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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

// Generate INSERT statements
const insertStatements = [];
let validCount = 0;

parsed.data.forEach((row, index) => {
    const email = row['Dirección de correo electrónico'];
    const nombre = row['Nom et prénom'];
    const telefono = row['Téléphone'];

    // Skip if missing essential data
    if (!email || !nombre) {
        console.log(`Skipping row ${index + 1}: missing email or name`);
        return;
    }

    const eventDate = parseDate(row['Date de votre événement']);
    const eventType = row['Nature de votre événement'];
    const address = row['Adresse de l\'événement'];
    const guestCount = row['Nombre d\'invités'];
    const mealType = row['Déjeuner ou dîner \nPrestations du midi : Bénéficiez d\'une remise de 10 %'] || row['Déjeuner ou dîner'];
    const estado = row['Estado'];
    const categoria = row['Categoria'];
    const comentarios = row['Comenatrios'] || row['Comentarios'];
    const timestamp = row['Marca temporal'];

    const status = parseStatus(estado);

    const sql = `INSERT INTO external_budgets (
    client_name, client_email, client_phone,
    event_date, event_type, event_address, guest_count, meal_type,
    status, categoria, admin_comments, original_timestamp
  ) VALUES (
    '${escapeSQL(nombre)}',
    '${escapeSQL(email)}',
    '${escapeSQL(telefono)}',
    ${eventDate ? `'${eventDate}'` : 'NULL'},
    '${escapeSQL(eventType)}',
    '${escapeSQL(address)}',
    '${escapeSQL(guestCount)}',
    '${escapeSQL(mealType)}',
    '${status}',
    '${escapeSQL(categoria)}',
    '${escapeSQL(comentarios)}',
    ${timestamp ? `'${timestamp}'::timestamp` : 'NULL'}
  );`;

    insertStatements.push(sql);
    validCount++;
});

console.log(`\nRegistros válidos para insertar: ${validCount}`);

// Write to file
const migrationContent = sqlStatements.join('\n\n') + '\n\n-- Insert data\n' + insertStatements.join('\n');

const outputPath = 'database/add_external_budgets.sql';
fs.writeFileSync(outputPath, migrationContent);

console.log(`\n✅ Migración SQL generada en: ${outputPath}`);
console.log(`   - Total de registros: ${validCount}`);
console.log(`   - Ejecuta esta migración en Supabase para importar los datos`);
