-- Add 4 psychologists who only offer in-person sessions
INSERT INTO psychologists (id, name, image_url, rating, experience, price, description, timezone) VALUES
(31, 'Dr. Placeholder 31', '/placeholder.svg?height=100&width=100&text=Dr31', 4.8, '9 años', 80, 'Especialista en terapia presencial con enfoque en contacto directo y comunicación no verbal.', 'America/Mexico_City'),
(32, 'Dr. Placeholder 32', '/placeholder.svg?height=100&width=100&text=Dr32', 4.6, '12 años', 88, 'Psicóloga especializada en terapia presencial para fobias y trauma con técnicas de exposición directa.', 'America/Mexico_City'),
(33, 'Dr. Placeholder 33', '/placeholder.svg?height=100&width=100&text=Dr33', 4.9, '15 años', 95, 'Terapeuta familiar que trabaja exclusivamente de forma presencial para terapia de pareja y familiar.', 'America/Mexico_City'),
(34, 'Dr. Placeholder 34', '/placeholder.svg?height=100&width=100&text=Dr34', 4.7, '8 años', 82, 'Especialista en terapia presencial para depresión y duelo con enfoque humanístico.', 'America/Mexico_City'),

-- Add 4 psychologists who only offer online sessions
(35, 'Dr. Placeholder 35', '/placeholder.svg?height=100&width=100&text=Dr35', 4.5, '6 años', 70, 'Psicólogo digital especializado en terapia online para ansiedad social y estrés laboral.', 'America/Mexico_City'),
(36, 'Dr. Placeholder 36', '/placeholder.svg?height=100&width=100&text=Dr36', 4.8, '10 años', 85, 'Especialista en terapia online con amplia experiencia en plataformas digitales para burnout y autoestima.', 'America/Mexico_City'),
(37, 'Dr. Placeholder 37', '/placeholder.svg?height=100&width=100&text=Dr37', 4.6, '7 años', 75, 'Terapeuta online especializada en comunicación y relaciones interpersonales a distancia.', 'America/Mexico_City'),
(38, 'Dr. Placeholder 38', '/placeholder.svg?height=100&width=100&text=Dr38', 4.9, '11 años', 90, 'Psicóloga online senior especializada en trauma y fobias con terapia cognitivo-conductual digital.', 'America/Mexico_City');

-- Insert psychologist specialties for new psychologists
INSERT INTO psychologist_specialties (psychologist_id, specialty_id) VALUES
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

-- Insert available slots for new psychologists
INSERT INTO available_slots (psychologist_id, day_of_week, time_slot, modality, is_available) VALUES
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
