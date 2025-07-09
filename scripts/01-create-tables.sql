-- Crear tabla de psicólogos
CREATE TABLE psychologists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    experience VARCHAR(50),
    price DECIMAL(10,2),
    rating DECIMAL(3,2),
    description TEXT,
    timezone VARCHAR(100) DEFAULT 'America/Mexico_City',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de temáticas/especialidades
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación muchos a muchos entre psicólogos y especialidades
CREATE TABLE psychologist_specialties (
    id SERIAL PRIMARY KEY,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialties(id) ON DELETE CASCADE,
    UNIQUE(psychologist_id, specialty_id)
);

-- Crear tabla de horarios disponibles
CREATE TABLE available_slots (
    id SERIAL PRIMARY KEY,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
    time_slot TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de pacientes
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    timezone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de sesiones/citas
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    psychologist_id INTEGER REFERENCES psychologists(id),
    specialty_id INTEGER REFERENCES specialties(id),
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    modality VARCHAR(50) DEFAULT 'online', -- online, presencial, telefonica
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    price DECIMAL(10,2),
    patient_timezone VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_psychologist ON sessions(psychologist_id);
CREATE INDEX idx_sessions_specialty ON sessions(specialty_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_available_slots_psychologist ON available_slots(psychologist_id);
