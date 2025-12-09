const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
} catch (e) {
    console.error('Error reading .env.local', e);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertPanqueques() {
    console.log('🥞 Creando producto "Panqueques"...');

    const { data, error } = await supabase
        .from('products')
        .insert([
            {
                name: 'Panqueques',
                category: 'postres',
                price_per_portion: 6.00, // Precio estimado, puedes cambiarlo en el panel luego
                unit_type: 'unidad',
                active: true,
                notes: 'Panqueques con dulce de leche',
                portion_per_person: '1'
            }
        ])
        .select();

    if (error) {
        console.error('❌ Error al crear:', error.message);
    } else {
        console.log('✅ Producto creado exitosamente:', data);
    }
}

insertPanqueques();
