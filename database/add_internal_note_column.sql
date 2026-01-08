-- Fix: Ensure internal_note column is JSONB type
-- Run this in Supabase SQL Editor

-- First, check if column exists and its type
DO $$ 
BEGIN
    -- If column exists as TEXT, alter it to JSONB
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'catering_orders' 
        AND column_name = 'internal_note'
        AND data_type = 'text'
    ) THEN
        -- Column exists as TEXT, convert to JSONB
        ALTER TABLE catering_orders 
        ALTER COLUMN internal_note TYPE JSONB USING 
            CASE 
                WHEN internal_note IS NOT NULL AND internal_note != '' 
                THEN jsonb_build_object('text', internal_note, 'updatedAt', NOW())
                ELSE NULL
            END;
        RAISE NOTICE 'Column internal_note converted from TEXT to JSONB';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'catering_orders' 
        AND column_name = 'internal_note'
    ) THEN
        -- Column doesn't exist, create it as JSONB
        ALTER TABLE catering_orders ADD COLUMN internal_note JSONB;
        RAISE NOTICE 'Column internal_note created as JSONB';
    ELSE
        RAISE NOTICE 'Column internal_note already exists as JSONB';
    END IF;
END $$;

-- Verify the column exists with correct type
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'catering_orders' 
AND column_name = 'internal_note';
