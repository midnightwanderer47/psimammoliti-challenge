-- Add is_booked column to available_slots table
ALTER TABLE available_slots 
ADD COLUMN is_booked BOOLEAN DEFAULT FALSE;

-- Create index for better performance on booking queries
CREATE INDEX idx_available_slots_booking 
ON available_slots(psychologist_id, day_of_week, time_slot, modality, is_booked);

-- Update existing slots to set is_booked = false (default)
UPDATE available_slots SET is_booked = FALSE WHERE is_booked IS NULL;
