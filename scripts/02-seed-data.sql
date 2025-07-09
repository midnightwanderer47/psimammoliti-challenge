-- Clear existing data
DELETE FROM sessions;
DELETE FROM available_slots;
DELETE FROM psychologist_specialties;
DELETE FROM patients;
DELETE FROM psychologists;
DELETE FROM specialties;

-- Insert specialties (11 total)
INSERT INTO specialties (id, name, description) VALUES
(1, 'Fobias', 'Tratamiento de fobias específicas y trastornos de ansiedad relacionados'),
(2, 'Depresión', 'Terapia especializada para el tratamiento de la depresión y trastornos del estado de ánimo'),
(3, 'Ansiedad Social', 'Tratamiento de la ansiedad social y fobia social'),
(4, 'Relaciones Personales', 'Terapia para mejorar las relaciones interpersonales y habilidades sociales'),
(5, 'Terapia de Pareja', 'Consejería y terapia especializada para parejas'),
(6, 'Estrés Laboral', 'Manejo del estrés en el ambiente laboral y burnout'),
(7, 'Autoestima', 'Fortalecimiento de la autoestima y confianza personal'),
(8, 'Duelo', 'Acompañamiento en procesos de duelo y pérdida'),
(9, 'Trauma', 'Terapia especializada para trauma y trastorno de estrés postraumático'),
(10, 'Burnout', 'Tratamiento del síndrome de desgaste profesional'),
(11, 'Comunicación', 'Desarrollo de habilidades de comunicación efectiva');

-- Insert 30 psychologists (5x the original 6)
INSERT INTO psychologists (id, name, image_url, rating, experience, price, description, timezone) VALUES
(1, 'Dr. Placeholder 1', '/placeholder.svg?height=100&width=100&text=Dr1', 4.9, '8 años', 75, 'Especialista en tratamiento de fobias y trastornos de ansiedad con enfoque cognitivo-conductual.', 'America/Mexico_City'),
(2, 'Dr. Placeholder 2', '/placeholder.svg?height=100&width=100&text=Dr2', 4.8, '12 años', 85, 'Especialista en relaciones interpersonales y terapia de pareja con enfoque sistémico.', 'America/Mexico_City'),
(3, 'Dr. Placeholder 3', '/placeholder.svg?height=100&width=100&text=Dr3', 4.7, '6 años', 70, 'Psicóloga especializada en estrés laboral y desarrollo de autoestima en adultos jóvenes.', 'America/Mexico_City'),
(4, 'Dr. Placeholder 4', '/placeholder.svg?height=100&width=100&text=Dr4', 4.9, '15 años', 90, 'Especialista en procesos de duelo y depresión con amplia experiencia clínica.', 'America/Mexico_City'),
(5, 'Dr. Placeholder 5', '/placeholder.svg?height=100&width=100&text=Dr5', 4.6, '10 años', 80, 'Psicólogo especializado en fobias, ansiedad social y fortalecimiento de la autoestima.', 'America/Mexico_City'),
(6, 'Dr. Placeholder 6', '/placeholder.svg?height=100&width=100&text=Dr6', 4.8, '9 años', 78, 'Especialista en relaciones interpersonales y manejo del estrés en entornos laborales.', 'America/Mexico_City'),
(7, 'Dr. Placeholder 7', '/placeholder.svg?height=100&width=100&text=Dr7', 4.5, '7 años', 72, 'Especialista en trauma y burnout con enfoque en terapia EMDR.', 'America/Mexico_City'),
(8, 'Dr. Placeholder 8', '/placeholder.svg?height=100&width=100&text=Dr8', 4.7, '11 años', 82, 'Psicólogo especializado en comunicación y terapia de pareja con enfoque humanista.', 'America/Mexico_City'),
(9, 'Dr. Placeholder 9', '/placeholder.svg?height=100&width=100&text=Dr9', 4.8, '13 años', 88, 'Especialista en depresión, estrés laboral y duelo con amplia experiencia en terapia cognitiva.', 'America/Mexico_City'),
(10, 'Dr. Placeholder 10', '/placeholder.svg?height=100&width=100&text=Dr10', 4.6, '5 años', 68, 'Psicóloga joven especializada en fobias y trauma con enfoque en terapia de exposición.', 'America/Mexico_City'),
(11, 'Dr. Placeholder 11', '/placeholder.svg?height=100&width=100&text=Dr11', 4.9, '14 años', 92, 'Especialista senior en ansiedad social, autoestima y comunicación interpersonal.', 'America/Mexico_City'),
(12, 'Dr. Placeholder 12', '/placeholder.svg?height=100&width=100&text=Dr12', 4.4, '8 años', 76, 'Psicólogo especializado en relaciones personales y prevención del burnout.', 'America/Mexico_City'),
(13, 'Dr. Placeholder 13', '/placeholder.svg?height=100&width=100&text=Dr13', 4.7, '16 años', 95, 'Terapeuta familiar especializada en terapia de pareja, duelo y depresión.', 'America/Mexico_City'),
(14, 'Dr. Placeholder 14', '/placeholder.svg?height=100&width=100&text=Dr14', 4.5, '9 años', 79, 'Especialista en estrés laboral, trauma y burnout con enfoque en mindfulness.', 'America/Mexico_City'),
(15, 'Dr. Placeholder 15', '/placeholder.svg?height=100&width=100&text=Dr15', 4.8, '10 años', 84, 'Psicóloga especializada en fobias, ansiedad social y desarrollo de habilidades comunicativas.', 'America/Mexico_City'),
(16, 'Dr. Placeholder 16', '/placeholder.svg?height=100&width=100&text=Dr16', 4.6, '12 años', 86, 'Especialista en depresión, autoestima y procesos de duelo con enfoque integrativo.', 'America/Mexico_City'),
(17, 'Dr. Placeholder 17', '/placeholder.svg?height=100&width=100&text=Dr17', 4.9, '18 años', 98, 'Terapeuta senior especializada en relaciones, terapia de pareja y comunicación.', 'America/Mexico_City'),
(18, 'Dr. Placeholder 18', '/placeholder.svg?height=100&width=100&text=Dr18', 4.4, '6 años', 71, 'Psicólogo joven especializado en estrés laboral, burnout y trauma organizacional.', 'America/Mexico_City'),
(19, 'Dr. Placeholder 19', '/placeholder.svg?height=100&width=100&text=Dr19', 4.7, '11 años', 83, 'Especialista en fobias, depresión y fortalecimiento de la autoestima personal.', 'America/Mexico_City'),
(20, 'Dr. Placeholder 20', '/placeholder.svg?height=100&width=100&text=Dr20', 4.8, '13 años', 89, 'Psicóloga especializada en ansiedad social, duelo y desarrollo comunicativo.', 'America/Mexico_City'),
(21, 'Dr. Placeholder 21', '/placeholder.svg?height=100&width=100&text=Dr21', 4.5, '7 años', 74, 'Terapeuta especializada en terapia de pareja, estrés laboral y prevención del burnout.', 'America/Mexico_City'),
(22, 'Dr. Placeholder 22', '/placeholder.svg?height=100&width=100&text=Dr22', 4.6, '9 años', 77, 'Especialista en trauma, fobias y ansiedad social con enfoque en terapia cognitiva.', 'America/Mexico_City'),
(23, 'Dr. Placeholder 23', '/placeholder.svg?height=100&width=100&text=Dr23', 4.9, '15 años', 93, 'Psicólogo senior especializado en depresión, relaciones personales y autoestima.', 'America/Mexico_City'),
(24, 'Dr. Placeholder 24', '/placeholder.svg?height=100&width=100&text=Dr24', 4.4, '8 años', 75, 'Especialista en duelo, comunicación y manejo del estrés en el trabajo.', 'America/Mexico_City'),
(25, 'Dr. Placeholder 25', '/placeholder.svg?height=100&width=100&text=Dr25', 4.7, '10 años', 81, 'Psicóloga especializada en burnout, trauma y tratamiento de la depresión.', 'America/Mexico_City'),
(26, 'Dr. Placeholder 26', '/placeholder.svg?height=100&width=100&text=Dr26', 4.8, '12 años', 87, 'Terapeuta especializada en fobias, terapia de pareja y habilidades comunicativas.', 'America/Mexico_City'),
(27, 'Dr. Placeholder 27', '/placeholder.svg?height=100&width=100&text=Dr27', 4.5, '6 años', 69, 'Psicólogo joven especializado en ansiedad social, estrés laboral y autoestima.', 'America/Mexico_City'),
(28, 'Dr. Placeholder 28', '/placeholder.svg?height=100&width=100&text=Dr28', 4.6, '11 años', 85, 'Especialista en relaciones personales, duelo y prevención del burnout profesional.', 'America/Mexico_City'),
(29, 'Dr. Placeholder 29', '/placeholder.svg?height=100&width=100&text=Dr29', 4.9, '17 años', 96, 'Psicóloga senior especializada en trauma, depresión y desarrollo comunicativo.', 'America/Mexico_City'),
(30, 'Dr. Placeholder 30', '/placeholder.svg?height=100&width=100&text=Dr30', 4.7, '14 años', 91, 'Especialista en fobias, estrés laboral y acompañamiento en procesos de duelo.', 'America/Mexico_City'),
-- Add 4 psychologists who only offer in-person sessions
(31, 'Dr. Placeholder 31', '/placeholder.svg?height=100&width=100&text=Dr31', 4.8, '9 años', 80, 'Especialista en terapia presencial con enfoque en contacto directo y comunicación no verbal.', 'America/Mexico_City'),
(32, 'Dr. Placeholder 32', '/placeholder.svg?height=100&width=100&text=Dr32', 4.6, '12 años', 88, 'Psicóloga especializada en terapia presencial para fobias y trauma con técnicas de exposición directa.', 'America/Mexico_City'),
(33, 'Dr. Placeholder 33', '/placeholder.svg?height=100&width=100&text=Dr33', 4.9, '15 años', 95, 'Terapeuta familiar que trabaja exclusivamente de forma presencial para terapia de pareja y familiar.', 'America/Mexico_City'),
(34, 'Dr. Placeholder 34', '/placeholder.svg?height=100&width=100&text=Dr34', 4.7, '8 años', 82, 'Especialista en terapia presencial para depresión y duelo con enfoque humanístico.', 'America/Mexico_City'),

-- Add 4 psychologists who only offer online sessions
(35, 'Dr. Placeholder 35', '/placeholder.svg?height=100&width=100&text=Dr35', 4.5, '6 años', 70, 'Psicólogo digital especializado en terapia online para ansiedad social y estrés laboral.', 'America/Mexico_City'),
(36, 'Dr. Placeholder 36', '/placeholder.svg?height=100&width=100&text=Dr36', 4.8, '10 años', 85, 'Especialista en terapia online con amplia experiencia en plataformas digitales para burnout y autoestima.', 'America/Mexico_City'),
(37, 'Dr. Placeholder 37', '/placeholder.svg?height=100&width=100&text=Dr37', 4.6, '7 años', 75, 'Terapeuta online especializada en comunicación y relaciones interpersonales a distancia.', 'America/Mexico_City'),
(38, 'Dr. Placeholder 38', '/placeholder.svg?height=100&width=100&text=Dr38', 4.9, '11 años', 90, 'Psicóloga online senior especializada en trauma y fobias con terapia cognitivo-conductual digital.', 'America/Mexico_City');

-- Insert psychologist specialties (multiple specialties per psychologist)
INSERT INTO psychologist_specialties (psychologist_id, specialty_id) VALUES
-- Psychologist 1: Fobias, Depresión, Ansiedad Social
(1, 1), (1, 2), (1, 3),
-- Psychologist 2: Relaciones Personales, Terapia de Pareja
(2, 4), (2, 5),
-- Psychologist 3: Estrés Laboral, Autoestima
(3, 6), (3, 7),
-- Psychologist 4: Duelo, Depresión
(4, 8), (4, 2),
-- Psychologist 5: Fobias, Ansiedad Social, Autoestima
(5, 1), (5, 3), (5, 7),
-- Psychologist 6: Relaciones Personales, Estrés Laboral
(6, 4), (6, 6),
-- Psychologist 7: Trauma, Burnout
(7, 9), (7, 10),
-- Psychologist 8: Comunicación, Terapia de Pareja
(8, 11), (8, 5),
-- Psychologist 9: Depresión, Estrés Laboral, Duelo
(9, 2), (9, 6), (9, 8),
-- Psychologist 10: Fobias, Trauma
(10, 1), (10, 9),
-- Psychologist 11: Ansiedad Social, Autoestima, Comunicación
(11, 3), (11, 7), (11, 11),
-- Psychologist 12: Relaciones Personales, Burnout
(12, 4), (12, 10),
-- Psychologist 13: Terapia de Pareja, Duelo, Depresión
(13, 5), (13, 8), (13, 2),
-- Psychologist 14: Estrés Laboral, Trauma, Burnout
(14, 6), (14, 9), (14, 10),
-- Psychologist 15: Fobias, Ansiedad Social, Comunicación
(15, 1), (15, 3), (15, 11),
-- Psychologist 16: Depresión, Autoestima, Duelo
(16, 2), (16, 7), (16, 8),
-- Psychologist 17: Relaciones Personales, Terapia de Pareja, Comunicación
(17, 4), (17, 5), (17, 11),
-- Psychologist 18: Estrés Laboral, Burnout, Trauma
(18, 6), (18, 10), (18, 9),
-- Psychologist 19: Fobias, Depresión, Autoestima
(19, 1), (19, 2), (19, 7),
-- Psychologist 20: Ansiedad Social, Duelo, Comunicación
(20, 3), (20, 8), (20, 11),
-- Psychologist 21: Terapia de Pareja, Estrés Laboral, Burnout
(21, 5), (21, 6), (21, 10),
-- Psychologist 22: Trauma, Fobias, Ansiedad Social
(22, 9), (22, 1), (22, 3),
-- Psychologist 23: Depresión, Relaciones Personales, Autoestima
(23, 2), (23, 4), (23, 7),
-- Psychologist 24: Duelo, Comunicación, Estrés Laboral
(24, 8), (24, 11), (24, 6),
-- Psychologist 25: Burnout, Trauma, Depresión
(25, 10), (25, 9), (25, 2),
-- Psychologist 26: Fobias, Terapia de Pareja, Comunicación
(26, 1), (26, 5), (26, 11),
-- Psychologist 27: Ansiedad Social, Estrés Laboral, Autoestima
(27, 3), (27, 6), (27, 7),
-- Psychologist 28: Relaciones Personales, Duelo, Burnout
(28, 4), (28, 8), (28, 10),
-- Psychologist 29: Trauma, Depresión, Comunicación
(29, 9), (29, 2), (29, 11),
-- Psychologist 30: Fobias, Estrés Laboral, Duelo
(30, 1), (30, 6), (30, 8),
-- Psychologist 31: Fobias, Comunicación, Relaciones Personales (presencial only)
(31, 1), (31, 11), (31, 4),
-- Psychologist 32: Fobias, Trauma, Ansiedad Social (presencial only)
(32, 1), (32, 9), (32, 3),
-- Psychologist 33: Terapia de Pareja, Relaciones Personales, Comunicación (presencial only)
(33, 5), (33, 4), (33, 11),
-- Psychologist 34: Depresión, Duelo, Autoestima (presencial only)
(34, 2), (34, 8), (34, 7),
-- Psychologist 35: Ansiedad Social, Estrés Laboral, Autoestima (online only)
(35, 3), (35, 6), (35, 7),
-- Psychologist 36: Burnout, Autoestima, Estrés Laboral (online only)
(36, 10), (36, 7), (36, 6),
-- Psychologist 37: Comunicación, Relaciones Personales, Terapia de Pareja (online only)
(37, 11), (37, 4), (37, 5),
-- Psychologist 38: Trauma, Fobias, Depresión (online only)
(38, 9), (38, 1), (38, 2);

-- Insert available slots for all 30 psychologists with mixed modalities (online and presencial)
INSERT INTO available_slots (psychologist_id, day_of_week, time_slot, modality, is_available) VALUES
-- Psychologist 1 - Mixed modalities
(1, 1, '09:00', 'online', true), (1, 1, '10:30', 'presencial', true), (1, 2, '14:00', 'online', true), (1, 3, '16:00', 'online', true),
-- Psychologist 2 - Mixed modalities
(2, 1, '16:00', 'presencial', true), (2, 2, '09:30', 'online', true), (2, 4, '11:00', 'presencial', true),
-- Psychologist 3 - Mixed modalities
(3, 2, '15:30', 'online', true), (3, 3, '10:00', 'online', true), (3, 5, '14:30', 'presencial', true),
-- Psychologist 4 - Mixed modalities
(4, 1, '11:30', 'presencial', true), (4, 3, '13:00', 'online', true), (4, 4, '15:00', 'presencial', true),
-- Psychologist 5 - Mixed modalities
(5, 2, '08:30', 'online', true), (5, 4, '17:00', 'online', true), (5, 5, '12:00', 'presencial', true),
-- Psychologist 6 - Mixed modalities
(6, 1, '13:30', 'online', true), (6, 3, '09:00', 'presencial', true), (6, 5, '16:30', 'online', true),
-- Psychologist 7 - Mixed modalities
(7, 1, '14:00', 'online', true), (7, 2, '16:30', 'presencial', true), (7, 4, '10:30', 'online', true),
-- Psychologist 8 - Mixed modalities
(8, 2, '11:00', 'presencial', true), (8, 3, '15:00', 'online', true), (8, 5, '09:30', 'presencial', true),
-- Psychologist 9 - Mixed modalities
(9, 1, '15:30', 'online', true), (9, 3, '11:30', 'presencial', true), (9, 6, '10:00', 'online', true),
-- Psychologist 10 - Mixed modalities
(10, 2, '13:30', 'online', true), (10, 4, '14:30', 'online', true), (10, 5, '11:00', 'presencial', true),
-- Psychologist 11 - Mixed modalities
(11, 1, '08:00', 'presencial', true), (11, 3, '17:30', 'online', true), (11, 5, '13:00', 'presencial', true),
-- Psychologist 12 - Mixed modalities
(12, 2, '10:00', 'online', true), (12, 4, '16:00', 'online', true), (12, 6, '11:30', 'presencial', true),
-- Psychologist 13 - Mixed modalities
(13, 1, '12:00', 'presencial', true), (13, 3, '14:00', 'presencial', true), (13, 5, '15:30', 'online', true),
-- Psychologist 14 - Mixed modalities
(14, 2, '08:30', 'online', true), (14, 4, '12:30', 'presencial', true), (14, 6, '14:00', 'online', true),
-- Psychologist 15 - Mixed modalities
(15, 1, '17:00', 'online', true), (15, 3, '09:30', 'presencial', true), (15, 5, '10:30', 'online', true),
-- Psychologist 16 - Mixed modalities
(16, 2, '12:00', 'presencial', true), (16, 4, '09:00', 'online', true), (16, 6, '15:00', 'presencial', true),
-- Psychologist 17 - Mixed modalities
(17, 1, '10:00', 'presencial', true), (17, 3, '16:30', 'online', true), (17, 5, '14:00', 'presencial', true),
-- Psychologist 18 - Mixed modalities
(18, 2, '14:30', 'online', true), (18, 4, '11:30', 'online', true), (18, 6, '09:30', 'presencial', true),
-- Psychologist 19 - Mixed modalities
(19, 1, '14:30', 'online', true), (19, 3, '12:30', 'presencial', true), (19, 5, '16:00', 'online', true),
-- Psychologist 20 - Mixed modalities
(20, 2, '17:00', 'online', true), (20, 4, '08:30', 'presencial', true), (20, 6, '12:30', 'online', true),
-- Psychologist 21 - Mixed modalities
(21, 1, '11:00', 'presencial', true), (21, 3, '15:30', 'online', true), (21, 5, '17:30', 'presencial', true),
-- Psychologist 22 - Mixed modalities
(22, 2, '09:00', 'online', true), (22, 4, '13:30', 'online', true), (22, 6, '16:30', 'presencial', true),
-- Psychologist 23 - Mixed modalities
(23, 1, '16:30', 'presencial', true), (23, 3, '10:30', 'online', true), (23, 5, '11:30', 'presencial', true),
-- Psychologist 24 - Mixed modalities
(24, 2, '11:30', 'online', true), (24, 4, '15:00', 'presencial', true), (24, 6, '13:30', 'online', true),
-- Psychologist 25 - Mixed modalities
(25, 1, '13:00', 'online', true), (25, 3, '08:30', 'presencial', true), (25, 5, '15:00', 'online', true),
-- Psychologist 26 - Mixed modalities
(26, 2, '15:00', 'presencial', true), (26, 4, '10:00', 'online', true), (26, 6, '17:00', 'presencial', true),
-- Psychologist 27 - Mixed modalities
(27, 1, '09:30', 'online', true), (27, 3, '14:30', 'online', true), (27, 5, '12:30', 'presencial', true),
-- Psychologist 28 - Mixed modalities
(28, 2, '16:00', 'presencial', true), (28, 4, '12:00', 'online', true), (28, 6, '10:30', 'presencial', true),
-- Psychologist 29 - Mixed modalities
(29, 1, '15:00', 'online', true), (29, 3, '11:00', 'presencial', true), (29, 5, '09:00', 'online', true),
-- Psychologist 30 - Mixed modalities
(30, 2, '13:00', 'presencial', true), (30, 4, '17:30', 'online', true), (30, 6, '11:00', 'presencial', true),
-- Psychologist 31 - Only presencial modality
(31, 1, '09:00', 'presencial', true), (31, 2, '11:00', 'presencial', true), (31, 4, '14:00', 'presencial', true), (31, 5, '16:30', 'presencial', true),
-- Psychologist 32 - Only presencial modality
(32, 1, '10:30', 'presencial', true), (32, 3, '13:30', 'presencial', true), (32, 5, '15:00', 'presencial', true),
-- Psychologist 33 - Only presencial modality
(33, 2, '08:30', 'presencial', true), (33, 3, '16:00', 'presencial', true), (33, 6, '10:00', 'presencial', true), (33, 6, '14:30', 'presencial', true),
-- Psychologist 34 - Only presencial modality
(34, 1, '12:00', 'presencial', true), (34, 4, '09:30', 'presencial', true), (34, 5, '17:00', 'presencial', true),
-- Psychologist 35 - Only online modality
(35, 1, '08:00', 'online', true), (35, 2, '14:30', 'online', true), (35, 4, '16:00', 'online', true), (35, 6, '11:30', 'online', true),
-- Psychologist 36 - Only online modality
(36, 2, '09:00', 'online', true), (36, 3, '12:30', 'online', true), (36, 5, '18:00', 'online', true),
-- Psychologist 37 - Only online modality
(37, 1, '13:00', 'online', true), (37, 3, '15:30', 'online', true), (37, 4, '17:30', 'online', true), (37, 6, '10:30', 'online', true),
-- Psychologist 38 - Only online modality
(38, 2, '10:00', 'online', true), (38, 4, '12:00', 'online', true), (38, 5, '14:00', 'online', true), (38, 6, '16:30', 'online', true);

-- Insert sample patients (50 patients - 5x the original 10)
INSERT INTO patients (id, name, email, timezone) VALUES
(1, 'Ana García', 'ana.garcia@email.com', 'America/Mexico_City'),
(2, 'Carlos Mendoza', 'carlos.mendoza@email.com', 'America/New_York'),
(3, 'María López', 'maria.lopez@email.com', 'Europe/Madrid'),
(4, 'Juan Rodríguez', 'juan.rodriguez@email.com', 'America/Mexico_City'),
(5, 'Laura Martínez', 'laura.martinez@email.com', 'America/Los_Angeles'),
(6, 'Diego Silva', 'diego.silva@email.com', 'America/Argentina/Buenos_Aires'),
(7, 'Carmen Herrera', 'carmen.herrera@email.com', 'America/Mexico_City'),
(8, 'Roberto Castro', 'roberto.castro@email.com', 'Europe/London'),
(9, 'Patricia Moreno', 'patricia.moreno@email.com', 'America/Chicago'),
(10, 'Fernando Jiménez', 'fernando.jimenez@email.com', 'America/Mexico_City'),
(11, 'Isabel Torres', 'isabel.torres@email.com', 'America/New_York'),
(12, 'Alejandro Ruiz', 'alejandro.ruiz@email.com', 'Europe/Madrid'),
(13, 'Sofía Ramírez', 'sofia.ramirez@email.com', 'America/Mexico_City'),
(14, 'Miguel Vargas', 'miguel.vargas@email.com', 'America/Los_Angeles'),
(15, 'Lucía Delgado', 'lucia.delgado@email.com', 'America/Argentina/Buenos_Aires'),
(16, 'Diego Morales', 'diego.morales@email.com', 'America/Mexico_City'),
(17, 'Valentina Peña', 'valentina.pena@email.com', 'Europe/London'),
(18, 'Sebastián Cruz', 'sebastian.cruz@email.com', 'America/Chicago'),
(19, 'Camila Soto', 'camila.soto@email.com', 'America/Mexico_City'),
(20, 'Andrés Vega', 'andres.vega@email.com', 'America/New_York'),
(21, 'Natalia Guerrero', 'natalia.guerrero@email.com', 'Europe/Madrid'),
(22, 'Gabriel Mendez', 'gabriel.mendez@email.com', 'America/Mexico_City'),
(23, 'Daniela Rojas', 'daniela.rojas@email.com', 'America/Los_Angeles'),
(24, 'Mateo Castillo', 'mateo.castillo@email.com', 'America/Argentina/Buenos_Aires'),
(25, 'Alejandra Ortega', 'alejandra.ortega@email.com', 'America/Mexico_City'),
(26, 'Nicolás Núñez', 'nicolas.nunez@email.com', 'Europe/London'),
(27, 'Mariana Ramos', 'mariana.ramos@email.com', 'America/Chicago'),
(28, 'Santiago Flores', 'santiago.flores@email.com', 'America/Mexico_City'),
(29, 'Valeria Aguilar', 'valeria.aguilar@email.com', 'America/New_York'),
(30, 'Emilio Herrera', 'emilio.herrera@email.com', 'Europe/Madrid'),
(31, 'Adriana Moreno', 'adriana.moreno@email.com', 'America/Mexico_City'),
(32, 'Joaquín López', 'joaquin.lopez@email.com', 'America/Los_Angeles'),
(33, 'Carolina Silva', 'carolina.silva@email.com', 'America/Argentina/Buenos_Aires'),
(34, 'Rodrigo Martín', 'rodrigo.martin@email.com', 'America/Mexico_City'),
(35, 'Fernanda Castro', 'fernanda.castro@email.com', 'Europe/London'),
(36, 'Maximiliano Torres', 'maximiliano.torres@email.com', 'America/Chicago'),
(37, 'Antonella Ruiz', 'antonella.ruiz@email.com', 'America/Mexico_City'),
(38, 'Leonardo Ramírez', 'leonardo.ramirez@email.com', 'America/New_York'),
(39, 'Renata Vargas', 'renata.vargas@email.com', 'Europe/Madrid'),
(40, 'Thiago Delgado', 'thiago.delgado@email.com', 'America/Mexico_City'),
(41, 'Bianca Morales', 'bianca.morales@email.com', 'America/Los_Angeles'),
(42, 'Enzo Peña', 'enzo.pena@email.com', 'America/Argentina/Buenos_Aires'),
(43, 'Martina Cruz', 'martina.cruz@email.com', 'America/Mexico_City'),
(44, 'Benjamín Soto', 'benjamin.soto@email.com', 'Europe/London'),
(45, 'Catalina Vega', 'catalina.vega@email.com', 'America/Chicago'),
(46, 'Ignacio Guerrero', 'ignacio.guerrero@email.com', 'America/Mexico_City'),
(47, 'Julieta Mendez', 'julieta.mendez@email.com', 'America/New_York'),
(48, 'Tomás Rojas', 'tomas.rojas@email.com', 'Europe/Madrid'),
(49, 'Amparo Castillo', 'amparo.castillo@email.com', 'America/Mexico_City'),
(50, 'Facundo Ortega', 'facundo.ortega@email.com', 'America/Los_Angeles');
