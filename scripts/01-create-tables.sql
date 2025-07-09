-- Create database tables for psychology sessions platform

-- Specialties table
CREATE TABLE IF NOT EXISTS specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Psychologists table
CREATE TABLE IF NOT EXISTS psychologists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    experience VARCHAR(50),
    price INTEGER NOT NULL,
    description TEXT,
    timezone VARCHAR(100) DEFAULT 'America/Mexico_City',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for psychologist specialties (many-to-many)
CREATE TABLE IF NOT EXISTS psychologist_specialties (
    id SERIAL PRIMARY KEY,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialties(id) ON DELETE CASCADE,
    UNIQUE(psychologist_id, specialty_id)
);

-- Available slots table with modality support
CREATE TABLE IF NOT EXISTS available_slots (
    id SERIAL PRIMARY KEY,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    time_slot TIME NOT NULL,
    modality VARCHAR(20) NOT NULL CHECK (modality IN ('online', 'presencial')),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    timezone VARCHAR(100) DEFAULT 'America/Mexico_City',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    psychologist_id INTEGER REFERENCES psychologists(id) ON DELETE CASCADE,
    specialty_id INTEGER REFERENCES specialties(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    modality VARCHAR(20) NOT NULL CHECK (modality IN ('online', 'presencial', 'telefonica')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    price INTEGER NOT NULL,
    patient_timezone VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_psychologist_specialties_psychologist ON psychologist_specialties(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_psychologist_specialties_specialty ON psychologist_specialties(specialty_id);
CREATE INDEX IF NOT EXISTS idx_available_slots_psychologist ON available_slots(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_available_slots_day_modality ON available_slots(day_of_week, modality);
CREATE INDEX IF NOT EXISTS idx_sessions_psychologist ON sessions(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_modality ON sessions(modality);
