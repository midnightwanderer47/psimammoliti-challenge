-- Insertar algunos pacientes de ejemplo
INSERT INTO patients (name, email, timezone) VALUES
('Juan Pérez', 'juan@email.com', 'America/Mexico_City'),
('María López', 'maria@email.com', 'America/New_York'),
('Carlos Ruiz', 'carlos@email.com', 'Europe/Madrid'),
('Ana García', 'ana@email.com', 'America/Los_Angeles'),
('Luis Martín', 'luis@email.com', 'America/Argentina/Buenos_Aires');

-- Insertar sesiones de ejemplo para análisis
INSERT INTO sessions (patient_id, psychologist_id, specialty_id, session_date, session_time, modality, status, price, patient_timezone) VALUES
-- Sesiones de la semana pasada
(1, 1, 1, '2024-01-08', '09:00', 'online', 'completed', 75.00, 'America/Mexico_City'),
(2, 2, 5, '2024-01-08', '16:00', 'online', 'completed', 85.00, 'America/New_York'),
(3, 3, 7, '2024-01-09', '11:00', 'online', 'completed', 70.00, 'Europe/Madrid'),
(4, 1, 2, '2024-01-09', '14:00', 'online', 'completed', 75.00, 'America/Los_Angeles'),
(5, 4, 10, '2024-01-10', '15:00', 'telefonica', 'completed', 80.00, 'America/Argentina/Buenos_Aires'),
(1, 2, 4, '2024-01-10', '17:00', 'online', 'completed', 85.00, 'America/Mexico_City'),
(2, 3, 8, '2024-01-11', '14:30', 'online', 'completed', 70.00, 'America/New_York'),
(3, 4, 2, '2024-01-11', '16:00', 'presencial', 'completed', 80.00, 'Europe/Madrid'),
(4, 5, 11, '2024-01-12', '09:00', 'online', 'completed', 90.00, 'America/Los_Angeles'),
(5, 1, 3, '2024-01-12', '10:30', 'online', 'completed', 75.00, 'America/Argentina/Buenos_Aires'),

-- Más sesiones para análisis (diferentes días y temáticas)
(1, 3, 9, '2024-01-15', '09:30', 'online', 'completed', 70.00, 'America/Mexico_City'),
(2, 4, 2, '2024-01-15', '14:00', 'online', 'completed', 80.00, 'America/New_York'),
(3, 1, 1, '2024-01-16', '09:00', 'online', 'completed', 75.00, 'Europe/Madrid'),
(4, 2, 5, '2024-01-16', '13:00', 'telefonica', 'completed', 85.00, 'America/Los_Angeles'),
(5, 5, 11, '2024-01-17', '10:00', 'online', 'completed', 90.00, 'America/Argentina/Buenos_Aires'),
(1, 4, 10, '2024-01-17', '15:00', 'online', 'completed', 80.00, 'America/Mexico_City'),
(2, 1, 2, '2024-01-18', '10:30', 'online', 'completed', 75.00, 'America/New_York'),
(3, 3, 7, '2024-01-18', '16:00', 'presencial', 'completed', 70.00, 'Europe/Madrid'),
(4, 5, 1, '2024-01-19', '08:00', 'online', 'completed', 90.00, 'America/Los_Angeles'),
(5, 2, 6, '2024-01-19', '17:00', 'online', 'completed', 85.00, 'America/Argentina/Buenos_Aires'),

-- Sesiones programadas para el futuro
(1, 1, 1, '2024-01-22', '09:00', 'online', 'scheduled', 75.00, 'America/Mexico_City'),
(2, 2, 5, '2024-01-22', '16:00', 'online', 'scheduled', 85.00, 'America/New_York'),
(3, 3, 7, '2024-01-23', '11:00', 'online', 'scheduled', 70.00, 'Europe/Madrid'),
(4, 4, 2, '2024-01-23', '14:00', 'telefonica', 'scheduled', 80.00, 'America/Los_Angeles'),
(5, 5, 11, '2024-01-24', '09:00', 'online', 'scheduled', 90.00, 'America/Argentina/Buenos_Aires');
