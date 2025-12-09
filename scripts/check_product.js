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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // Get search term from command line args
    const searchTerm = process.argv[2] || 'tomahawk';
    console.log(`🔎 Buscando producto: "${searchTerm}"...`);

    const { data, error } = await supabase
        .from('products')
        .select('id, name, active, portion_per_person, price_per_kg, price_per_portion, category')
        .ilike('name', `%${searchTerm}%`);

    if (error) {
        console.error('❌ Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('✅ Productos encontrados:');
        console.table(data);
    } else {
        console.log('⚠️ No se encontraron productos que coincidan.');
        console.table(data); // Empty table
    }
}

check();
