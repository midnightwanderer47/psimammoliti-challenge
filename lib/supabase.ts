import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para la base de datos
export interface Psychologist {
  id: number
  name: string
  experience: string
  price: number
  rating: number
  description: string
  timezone: string
  image_url: string
  created_at: string
}

export interface Specialty {
  id: number
  name: string
  description: string
}

export interface PsychologistWithSpecialties extends Psychologist {
  specialties: Specialty[]
  available_slots: AvailableSlot[]
}

export interface AvailableSlot {
  id: number
  psychologist_id: number
  day_of_week: number
  time_slot: string
  is_available: boolean
  modality: "online" | "presencial"
}

export interface Session {
  id: number
  patient_id: number
  psychologist_id: number
  specialty_id: number
  session_date: string
  session_time: string
  modality: string
  status: string
  price: number
  patient_timezone: string
  notes?: string
  created_at: string
}

export interface AnalyticsData {
  most_consulted_topics: Array<{
    tematica: string
    total_sesiones: number
    porcentaje: number
  }>
  busiest_days: Array<{
    dia_semana: string
    total_sesiones: number
    porcentaje: number
  }>
  popular_modalities: Array<{
    modalidad: string
    total_sesiones: number
    porcentaje: number
    precio_promedio: number
  }>
}
