-- Add 4 psychologists who only offer in-person sessions
INSERT INTO psychologists (id, name, description, experience, rating, price, timezone, image_url) VALUES
(31, 'Dr. María Elena Vásquez', 'Especialista en terapia presencial con enfoque en contacto directo y comunicación no verbal.', '9 años', 4.8, 80, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(32, 'Dra. Carmen Rodríguez', 'Psicóloga especializada en terapia presencial para fobias y trauma con técnicas de exposición directa.', '12 años', 4.6, 88, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(33, 'Dr. Roberto Fernández', 'Terapeuta familiar que trabaja exclusivamente de forma presencial para terapia de pareja y familiar.', '15 años', 4.9, 95, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(34, 'Dra. Ana Sofía Morales', 'Especialista en terapia presencial para depresión y duelo con enfoque humanístico.', '8 años', 4.7, 82, 'America/Mexico_City', '/placeholder.svg?height=80&width=80');

-- Add 4 psychologists who only offer online sessions
INSERT INTO psychologists (id, name, description, experience, rating, price, timezone, image_url) VALUES
(35, 'Dr. Carlos Digital', 'Psicólogo digital especializado en terapia online para ansiedad social y estrés laboral.', '6 años', 4.5, 70, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(36, 'Dra. Patricia Online', 'Especialista en terapia online con amplia experiencia en plataformas digitales para burnout y autoestima.', '10 años', 4.8, 85, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(37, 'Dra. Lucía Virtual', 'Terapeuta online especializada en comunicación y relaciones interpersonales a distancia.', '7 años', 4.6, 75, 'America/Mexico_City', '/placeholder.svg?height=80&width=80'),
(38, 'Dr. Miguel Cyber', 'Psicólogo online senior especializado en trauma y fobias con terapia cognitivo-conductual digital.', '11 años', 4.9, 90, 'America/Mexico_City', '/placeholder.svg?height=80&width=80');

-- Add specialties for in-person only psychologists
INSERT INTO psychologist_specialties (psychologist_id, specialty_id) VALUES
-- Dr. María Elena Vásquez (31): Fobias, Comunicación, Relaciones Personales
(31, 1), (31, 11), (31, 4),
-- Dra. Carmen Rodríguez (32): Fobias, Trauma, Ansiedad Social
(32, 1), (32, 9), (32, 3),
-- Dr. Roberto Fernández (33): Terapia de Pareja, Relaciones Personales, Comunicación
(33, 5), (33, 4), (33, 11),
-- Dra. Ana Sofía Morales (34): Depresión, Duelo, Autoestima
(34, 2), (34, 8), (34, 7);

-- Add specialties for online only psychologists
INSERT INTO psychologist_specialties (psychologist_id, specialty_id) VALUES
-- Dr. Carlos Digital (35): Ansiedad Social, Estrés Laboral, Autoestima
(35, 3), (35, 6), (35, 7),
-- Dra. Patricia Online (36): Burnout, Autoestima, Estrés Laboral
(36, 10), (36, 7), (36, 6),
-- Dra. Lucía Virtual (37): Comunicación, Relaciones Personales, Terapia de Pareja
(37, 11), (37, 4), (37, 5),
-- Dr. Miguel Cyber (38): Trauma, Fobias, Depresión
(38, 9), (38, 1), (38, 2);

-- Add available slots for in-person only psychologists
INSERT INTO available_slots (psychologist_id, day_of_week, time_slot, is_available, modality) VALUES
-- Dr. María Elena Vásquez (31) - Only presencial
(31, 1, '09:00', true, 'presencial'),
(31, 2, '11:00', true, 'presencial'),
(31, 4, '14:00', true, 'presencial'),
(31, 5, '16:30', true, 'presencial'),

-- Dra. Carmen Rodríguez (32) - Only presencial
(32, 1, '10:30', true, 'presencial'),
(32, 3, '13:30', true, 'presencial'),
(32, 5, '15:00', true, 'presencial'),

-- Dr. Roberto Fernández (33) - Only presencial
(33, 2, '08:30', true, 'presencial'),
(33, 3, '16:00', true, 'presencial'),
(33, 6, '10:00', true, 'presencial'),
(33, 6, '14:30', true, 'presencial'),

-- Dra. Ana Sofía Morales (34) - Only presencial
(34, 1, '12:00', true, 'presencial'),
(34, 4, '09:30', true, 'presencial'),
(34, 5, '17:00', true, 'presencial');

-- Add available slots for online only psychologists
INSERT INTO available_slots (psychologist_id, day_of_week, time_slot, is_available, modality) VALUES
-- Dr. Carlos Digital (35) - Only online
(35, 1, '08:00', true, 'online'),
(35, 2, '14:30', true, 'online'),
(35, 4, '16:00', true, 'online'),
(35, 6, '11:30', true, 'online'),

-- Dra. Patricia Online (36) - Only online
(36, 2, '09:00', true, 'online'),
(36, 3, '12:30', true, 'online'),
(36, 5, '18:00', true, 'online'),

-- Dra. Lucía Virtual (37) - Only online
(37, 1, '13:00', true, 'online'),
(37, 3, '15:30', true, 'online'),
(37, 4, '17:30', true, 'online'),
(37, 6, '10:30', true, 'online'),

-- Dr. Miguel Cyber (38) - Only online
(38, 2, '10:00', true, 'online'),
(38, 4, '12:00', true, 'online'),
(38, 5, '14:00', true, 'online'),
(38, 6, '16:30', true, 'online');
