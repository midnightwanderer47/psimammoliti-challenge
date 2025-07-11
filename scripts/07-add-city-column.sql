-- Add city column to psychologists table
ALTER TABLE psychologists ADD COLUMN city VARCHAR(100);

-- Update existing psychologists with cities across Latin America
UPDATE psychologists SET city = 'Buenos Aires' WHERE id = 1;
UPDATE psychologists SET city = 'São Paulo' WHERE id = 2;
UPDATE psychologists SET city = 'Lima' WHERE id = 3;
UPDATE psychologists SET city = 'Bogotá' WHERE id = 4;
UPDATE psychologists SET city = 'Santiago' WHERE id = 5;

UPDATE psychologists SET city = 'Caracas' WHERE id = 31;
UPDATE psychologists SET city = 'Quito' WHERE id = 32;
UPDATE psychologists SET city = 'La Paz' WHERE id = 33;
UPDATE psychologists SET city = 'Asunción' WHERE id = 34;
UPDATE psychologists SET city = 'Montevideo' WHERE id = 35;
UPDATE psychologists SET city = 'San José' WHERE id = 36;
UPDATE psychologists SET city = 'Panamá' WHERE id = 37;
UPDATE psychologists SET city = 'Tegucigalpa' WHERE id = 38;