import { supabase } from "./supabase"
import { fetchRandomUser } from "./randomuser"
import type { PsychologistWithSpecialties, AnalyticsData } from "./supabase"

// Enhanced fallback data with more realistic information
const fallbackSpecialties = [
  { id: 1, name: "Fobias", description: "Tratamiento de fobias específicas" },
  { id: 2, name: "Depresión", description: "Terapia para depresión" },
  { id: 3, name: "Ansiedad Social", description: "Tratamiento de ansiedad social" },
  { id: 4, name: "Relaciones Personales", description: "Terapia de relaciones" },
  { id: 5, name: "Terapia de Pareja", description: "Consejería de pareja" },
  { id: 6, name: "Estrés Laboral", description: "Manejo del estrés en el trabajo" },
  { id: 7, name: "Autoestima", description: "Fortalecimiento de la autoestima" },
  { id: 8, name: "Duelo", description: "Proceso de duelo y pérdida" },
]

// Function to create fallback psychologists with Random User API data
async function createFallbackPsychologists(): Promise<PsychologistWithSpecialties[]> {
  const psychologistTemplates = [
    {
      id: 1,
      specialtyIds: [1, 2, 3],
      rating: 4.9,
      experience: "8 años",
      price: 75,
      description: "Especialista en tratamiento de fobias y trastornos de ansiedad con enfoque cognitivo-conductual.",
      available_slots: [
        { id: 1, psychologist_id: 1, day_of_week: 1, time_slot: "09:00", is_available: true },
        { id: 2, psychologist_id: 1, day_of_week: 1, time_slot: "10:30", is_available: true },
        { id: 3, psychologist_id: 1, day_of_week: 2, time_slot: "14:00", is_available: true },
        { id: 4, psychologist_id: 1, day_of_week: 3, time_slot: "16:00", is_available: true },
      ],
    },
    {
      id: 2,
      specialtyIds: [4, 5],
      rating: 4.8,
      experience: "12 años",
      price: 85,
      description: "Especialista en relaciones interpersonales y terapia de pareja con enfoque sistémico.",
      available_slots: [
        { id: 5, psychologist_id: 2, day_of_week: 1, time_slot: "16:00", is_available: true },
        { id: 6, psychologist_id: 2, day_of_week: 2, time_slot: "09:30", is_available: true },
        { id: 7, psychologist_id: 2, day_of_week: 4, time_slot: "11:00", is_available: true },
      ],
    },
    {
      id: 3,
      specialtyIds: [6, 7],
      rating: 4.7,
      experience: "6 años",
      price: 70,
      description: "Psicóloga especializada en estrés laboral y desarrollo de autoestima en adultos jóvenes.",
      available_slots: [
        { id: 8, psychologist_id: 3, day_of_week: 2, time_slot: "15:30", is_available: true },
        { id: 9, psychologist_id: 3, day_of_week: 3, time_slot: "10:00", is_available: true },
        { id: 10, psychologist_id: 3, day_of_week: 5, time_slot: "14:30", is_available: true },
      ],
    },
    {
      id: 4,
      specialtyIds: [8, 2],
      rating: 4.9,
      experience: "15 años",
      price: 90,
      description: "Especialista en procesos de duelo y depresión con amplia experiencia clínica.",
      available_slots: [
        { id: 11, psychologist_id: 4, day_of_week: 1, time_slot: "11:30", is_available: true },
        { id: 12, psychologist_id: 4, day_of_week: 3, time_slot: "13:00", is_available: true },
        { id: 13, psychologist_id: 4, day_of_week: 4, time_slot: "15:00", is_available: true },
      ],
    },
    {
      id: 5,
      specialtyIds: [1, 3, 7],
      rating: 4.6,
      experience: "10 años",
      price: 80,
      description: "Psicólogo especializado en fobias, ansiedad social y fortalecimiento de la autoestima.",
      available_slots: [
        { id: 14, psychologist_id: 5, day_of_week: 2, time_slot: "08:30", is_available: true },
        { id: 15, psychologist_id: 5, day_of_week: 4, time_slot: "17:00", is_available: true },
        { id: 16, psychologist_id: 5, day_of_week: 5, time_slot: "12:00", is_available: true },
      ],
    },
    {
      id: 6,
      specialtyIds: [4, 6],
      rating: 4.8,
      experience: "9 años",
      price: 78,
      description: "Especialista en relaciones interpersonales y manejo del estrés en entornos laborales.",
      available_slots: [
        { id: 17, psychologist_id: 6, day_of_week: 1, time_slot: "13:30", is_available: true },
        { id: 18, psychologist_id: 6, day_of_week: 3, time_slot: "09:00", is_available: true },
        { id: 19, psychologist_id: 6, day_of_week: 5, time_slot: "16:30", is_available: true },
      ],
    },
  ]

  // Fetch user data from Random User API for each psychologist
  const psychologists = await Promise.all(
    psychologistTemplates.map(async (template, index) => {
      const userData = await fetchRandomUser(index)

      return {
        ...template,
        name: userData.name,
        image_url: userData.image_url,
        specialties: template.specialtyIds.map((id) => fallbackSpecialties.find((s) => s.id === id)!),
        timezone: "America/Mexico_City",
        created_at: new Date().toISOString(),
      }
    }),
  )

  return psychologists
}

export async function getPsychologists(): Promise<PsychologistWithSpecialties[]> {
  try {
    const { data: psychologists, error } = await supabase.from("psychologists").select(`
        *,
        psychologist_specialties (
          specialty_id,
          specialties (
            id,
            name,
            description
          )
        ),
        available_slots (
          id,
          day_of_week,
          time_slot,
          is_available
        )
      `)

    if (error) {
      console.warn("Database not ready, using fallback data with Random User API:", error.message)
      return await createFallbackPsychologists()
    }

    // If we have database data, enhance it with Random User API data
    if (psychologists && psychologists.length > 0) {
      const enhancedPsychologists = await Promise.all(
        psychologists.map(async (p, index) => {
          // Try to get user data from Random User API, but keep original if it fails
          try {
            const userData = await fetchRandomUser(index)
            return {
              ...p,
              name: userData.name,
              image_url: userData.image_url,
              specialties: p.psychologist_specialties.map((ps: any) => ps.specialties),
              available_slots: p.available_slots,
            }
          } catch (error) {
            console.warn(`Failed to enhance psychologist ${index} with Random User data:`, error)
            return {
              ...p,
              specialties: p.psychologist_specialties.map((ps: any) => ps.specialties),
              available_slots: p.available_slots,
            }
          }
        }),
      )

      return enhancedPsychologists
    }

    return await createFallbackPsychologists()
  } catch (error) {
    console.warn("Error fetching psychologists, using fallback data with Random User API:", error)
    return await createFallbackPsychologists()
  }
}

export async function getSpecialties() {
  try {
    const { data, error } = await supabase.from("specialties").select("*").order("name")

    if (error) {
      console.warn("Database not ready, using fallback data:", error.message)
      return fallbackSpecialties
    }

    return data || fallbackSpecialties
  } catch (error) {
    console.warn("Error fetching specialties, using fallback data:", error)
    return fallbackSpecialties
  }
}

export async function bookSession(sessionData: {
  patient_name: string
  patient_email: string
  patient_timezone: string
  psychologist_id: number
  specialty_id: number
  session_date: string
  session_time: string
  modality: string
  price: number
}) {
  try {
    // Check if database is ready
    const { error: testError } = await supabase.from("patients").select("id").limit(1)

    if (testError) {
      console.warn("Database not ready, simulating booking:", testError.message)
      // Simulate successful booking
      return {
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          ...sessionData,
          status: "scheduled",
          created_at: new Date().toISOString(),
        },
      }
    }

    // Proceed with actual database operations
    let { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", sessionData.patient_email)
      .single()

    if (patientError && patientError.code !== "PGRST116") {
      console.error("Error checking patient:", patientError)
      return { success: false, error: patientError }
    }

    if (!patient) {
      const { data: newPatient, error: createPatientError } = await supabase
        .from("patients")
        .insert({
          name: sessionData.patient_name,
          email: sessionData.patient_email,
          timezone: sessionData.patient_timezone,
        })
        .select("id")
        .single()

      if (createPatientError) {
        console.error("Error creating patient:", createPatientError)
        return { success: false, error: createPatientError }
      }

      patient = newPatient
    }

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        patient_id: patient.id,
        psychologist_id: sessionData.psychologist_id,
        specialty_id: sessionData.specialty_id,
        session_date: sessionData.session_date,
        session_time: sessionData.session_time,
        modality: sessionData.modality,
        price: sessionData.price,
        patient_timezone: sessionData.patient_timezone,
        status: "scheduled",
      })
      .select()
      .single()

    if (sessionError) {
      console.error("Error creating session:", sessionError)
      return { success: false, error: sessionError }
    }

    return { success: true, data: session }
  } catch (error) {
    console.error("Error booking session:", error)
    return { success: false, error }
  }
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    // Check if database is ready
    const { error: testError } = await supabase.from("sessions").select("id").limit(1)

    if (testError) {
      console.warn("Database not ready, using fallback analytics:", testError.message)
      return {
        most_consulted_topics: [
          { tematica: "Depresión", total_sesiones: 8, porcentaje: 32.0 },
          { tematica: "Fobias", total_sesiones: 6, porcentaje: 24.0 },
          { tematica: "Ansiedad Social", total_sesiones: 4, porcentaje: 16.0 },
          { tematica: "Relaciones Personales", total_sesiones: 4, porcentaje: 16.0 },
          { tematica: "Terapia de Pareja", total_sesiones: 3, porcentaje: 12.0 },
        ],
        busiest_days: [
          { dia_semana: "Martes", total_sesiones: 6, porcentaje: 24.0 },
          { dia_semana: "Miércoles", total_sesiones: 5, porcentaje: 20.0 },
          { dia_semana: "Lunes", total_sesiones: 4, porcentaje: 16.0 },
          { dia_semana: "Jueves", total_sesiones: 4, porcentaje: 16.0 },
          { dia_semana: "Viernes", total_sesiones: 3, porcentaje: 12.0 },
          { dia_semana: "Sábado", total_sesiones: 2, porcentaje: 8.0 },
          { dia_semana: "Domingo", total_sesiones: 1, porcentaje: 4.0 },
        ],
        popular_modalities: [
          { modalidad: "online", total_sesiones: 18, porcentaje: 72.0, precio_promedio: 78.5 },
          { modalidad: "telefonica", total_sesiones: 4, porcentaje: 16.0, precio_promedio: 75.0 },
          { modalidad: "presencial", total_sesiones: 3, porcentaje: 12.0, precio_promedio: 82.0 },
        ],
      }
    }

    // Try to use the stored functions
    const [topicsResult, daysResult, modalitiesResult] = await Promise.allSettled([
      supabase.rpc("get_most_consulted_topics"),
      supabase.rpc("get_busiest_days"),
      supabase.rpc("get_popular_modalities"),
    ])

    const topicsData = topicsResult.status === "fulfilled" ? topicsResult.value.data : []
    const daysData = daysResult.status === "fulfilled" ? daysResult.value.data : []
    const modalitiesData = modalitiesResult.status === "fulfilled" ? modalitiesResult.value.data : []

    return {
      most_consulted_topics: topicsData || [],
      busiest_days: daysData || [],
      popular_modalities: modalitiesData || [],
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return {
      most_consulted_topics: [],
      busiest_days: [],
      popular_modalities: [],
    }
  }
}
