-- Verificar estructura de email_logs
-- Esta tabla debe tener estos campos para el tracking de relances

-- Si la tabla ya existe, esto mostrará su estructura
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'email_logs'
ORDER BY ordinal_position;

-- Si necesitas recrear o actualizar la tabla, usa esto:
-- (Descomenta solo si es necesario)

/*
-- Asegurar que email_logs tiene todos los campos necesarios
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES catering_orders(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS recipient_email VARCHAR(255) NOT NULL,
ADD COLUMN IF NOT EXISTS recipient_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS subject VARCHAR(500) NOT NULL,
ADD COLUMN IF NOT EXISTS content TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'sent',
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_subject ON email_logs(subject);
*/
