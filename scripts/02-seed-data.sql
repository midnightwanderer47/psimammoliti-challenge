-- Insertar especialidades
INSERT INTO specialties (name, description) VALUES
('Fobias', 'Tratamiento de miedos irracionales y fobias específicas'),
('Depresión', 'Terapia para trastornos depresivos y del estado de ánimo'),
('Ansiedad Social', 'Tratamiento de ansiedad en situaciones sociales'),
('Relaciones Personales', 'Terapia para mejorar relaciones interpersonales'),
('Terapia de Pareja', 'Consejería matrimonial y de pareja'),
('Comunicación', 'Desarrollo de habilidades de comunicación'),
('Estrés Laboral', 'Manejo del estrés relacionado con el trabajo'),
('Burnout', 'Tratamiento del síndrome de desgaste profesional'),
('Autoestima', 'Desarrollo de la autoconfianza y autovaloración'),
('Duelo', 'Acompañamiento en procesos de pérdida'),
('Trauma', 'Terapia para traumas y TEPT');

-- Insertar psicólogos
INSERT INTO psychologists (name, experience, price, rating, description, image_url) VALUES
('Dra. María González', '8 años', 75.00, 4.9, 'Especialista en tratamiento de fobias y trastornos de ansiedad.', '/placeholder.svg?height=100&width=100'),
('Dr. Carlos Mendoza', '12 años', 85.00, 4.8, 'Especialista en relaciones interpersonales y terapia de pareja.', '/placeholder.svg?height=100&width=100'),
('Dra. Ana Rodríguez', '6 años', 70.00, 4.7, 'Psicóloga especializada en manejo del estrés y desarrollo personal.', '/placeholder.svg?height=100&width=100'),
('Dr. Luis Herrera', '10 años', 80.00, 4.9, 'Especialista en tratamiento de depresión y procesos de duelo.', '/placeholder.svg?height=100&width=100'),
('Dra. Carmen Silva', '15 años', 90.00, 4.8, 'Especialista en trauma y terapia cognitivo-conductual.', '/placeholder.svg?height=100&width=100');

-- Relacionar psicólogos con especialidades
INSERT INTO psychologist_specialties (psychologist_id, specialty_id) VALUES
-- Dra. María González
(1, 1), (1, 2), (1, 3), -- Fobias, Depresión, Ansiedad Social
-- Dr. Carlos Mendoza  
(2, 4), (2, 5), (2, 6), -- Relaciones Personales, Terapia de Pareja, Comunicación
-- Dra. Ana Rodríguez
(3, 7), (3, 8), (3, 9), -- Estrés Laboral, Burnout, Autoestima
-- Dr. Luis Herrera
(4, 2), (4, 10), (4, 11), -- Depresión, Duelo, Trauma
-- Dra. Carmen Silva
(5, 11), (5, 1), (5, 2); -- Trauma, Fobias, Depresión

-- Insertar horarios disponibles (0=Domingo, 1=Lunes, etc.)
INSERT INTO available_slots (psychologist_id, day_of_week, time_slot) VALUES
-- Dra. María González (ID: 1)
(1, 1, '09:00'), (1, 1, '10:30'), (1, 1, '14:00'), (1, 1, '15:30'),
(1, 2, '09:00'), (1, 2, '11:00'), (1, 2, '16:00'),
(1, 3, '10:00'), (1, 3, '14:30'), (1, 3, '16:00'),
(1, 4, '09:30'), (1, 4, '11:00'), (1, 4, '15:00'),
(1, 5, '09:00'), (1, 5, '10:30'), (1, 5, '14:00'),
(1, 6, '10:00'), (1, 6, '11:30'),

-- Dr. Carlos Mendoza (ID: 2)
(2, 1, '16:00'), (2, 1, '17:30'),
(2, 2, '09:30'), (2, 2, '13:00'), (2, 2, '17:00'),
(2, 3, '10:00'), (2, 3, '15:00'),
(2, 4, '09:00'), (2, 4, '16:30'),
(2, 5, '14:00'), (2, 5, '15:30'), (2, 5, '17:00'),
(2, 0, '10:00'), (2, 0, '11:30'),

-- Dra. Ana Rodríguez (ID: 3)
(3, 1, '11:00'), (3, 1, '17:00'),
(3, 2, '08:00'), (3, 2, '14:30'),
(3, 3, '09:00'), (3, 3, '10:30'), (3, 3, '16:00'),
(3, 4, '11:00'), (3, 4, '15:30'),
(3, 5, '09:30'), (3, 5, '14:00'),
(3, 6, '09:00'), (3, 6, '10:30'),

-- Dr. Luis Herrera (ID: 4)
(4, 1, '15:00'), (4, 1, '16:30'),
(4, 2, '10:00'), (4, 2, '14:00'),
(4, 3, '09:30'), (4, 3, '11:30'), (4, 3, '17:00'),
(4, 4, '13:00'), (4, 4, '15:00'),
(4, 5, '09:00'), (4, 5, '16:00'),
(4, 6, '11:00'),
(4, 0, '14:00'), (4, 0, '15:30'),

-- Dra. Carmen Silva (ID: 5)
(5, 1, '08:00'), (5, 1, '09:30'), (5, 1, '16:00'),
(5, 2, '10:00'), (5, 2, '15:00'),
(5, 3, '09:00'), (5, 3, '14:00'), (5, 3, '17:30'),
(5, 4, '08:30'), (5, 4, '16:00'),
(5, 5, '10:30'), (5, 5, '15:30');
