-- Update existing available_slots with mixed modalities
-- This script ensures we have a good distribution of online and presencial slots

UPDATE available_slots SET modality = 'online' WHERE id IN (
    SELECT id FROM available_slots 
    WHERE psychologist_id IN (1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29)
    AND (id % 2) = 1
);

UPDATE available_slots SET modality = 'presencial' WHERE id IN (
    SELECT id FROM available_slots 
    WHERE psychologist_id IN (1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29)
    AND (id % 2) = 0
);

UPDATE available_slots SET modality = 'presencial' WHERE id IN (
    SELECT id FROM available_slots 
    WHERE psychologist_id IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30)
    AND (id % 3) = 1
);

UPDATE available_slots SET modality = 'online' WHERE id IN (
    SELECT id FROM available_slots 
    WHERE psychologist_id IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30)
    AND (id % 3) != 1
);

-- Verify the distribution
SELECT 
    modality,
    COUNT(*) as total_slots,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM available_slots), 2) as percentage
FROM available_slots 
GROUP BY modality
ORDER BY modality;
