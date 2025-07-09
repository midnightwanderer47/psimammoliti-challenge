-- Add modality column to available_slots table if it doesn't exist
DO $$ 
BEGIN
    -- Check if modality column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'available_slots' 
        AND column_name = 'modality'
    ) THEN
        -- Add the modality column
        ALTER TABLE available_slots 
        ADD COLUMN modality VARCHAR(20) NOT NULL DEFAULT 'online' 
        CHECK (modality IN ('online', 'presencial'));
        
        -- Update existing records to have mixed modalities
        -- This will randomly assign modalities to existing slots
        UPDATE available_slots 
        SET modality = CASE 
            WHEN (id % 3) = 0 THEN 'presencial'
            ELSE 'online'
        END;
        
        -- Create index for better performance
        CREATE INDEX IF NOT EXISTS idx_available_slots_day_modality 
        ON available_slots(day_of_week, modality);
        
        RAISE NOTICE 'Modality column added successfully to available_slots table';
    ELSE
        RAISE NOTICE 'Modality column already exists in available_slots table';
    END IF;
END $$;
