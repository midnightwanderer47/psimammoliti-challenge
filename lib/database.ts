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
  { id: 9, name: "Trauma", description: "Terapia para traumas y TEPT" },
  { id: 10, name: "Burnout", description: "Síndrome de desgaste profesional" },
  { id: 11, name: "Comunicación", description: "Desarrollo de habilidades de comunicación" },
]

// Function to create fallback psychologists with Random User API data
async function createFallbackPsychologists(): Promise<PsychologistWithSpecialties[]> {
  const psychologistTemplates = [
    // Original 6 psychologists with mixed modalities
    {
      id: 1,
      specialtyIds: [1, 2, 3],
      rating: 4.9,
      experience: "8 años",
      price: 75,
      description: "Especialista en tratamiento de fobias y trastornos de ansiedad con enfoque cognitivo-conductual.",
      available_slots: [
        { id: 1, psychologist_id: 1, day_of_week: 1, time_slot: "09:00", is_available: true, modality: "online" },
        { id: 2, psychologist_id: 1, day_of_week: 1, time_slot: "10:30", is_available: true, modality: "presencial" },
        { id: 3, psychologist_id: 1, day_of_week: 2, time_slot: "14:00", is_available: true, modality: "online" },
        { id: 4, psychologist_id: 1, day_of_week: 3, time_slot: "16:00", is_available: true, modality: "online" },
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
        { id: 5, psychologist_id: 2, day_of_week: 1, time_slot: "16:00", is_available: true, modality: "presencial" },
        { id: 6, psychologist_id: 2, day_of_week: 2, time_slot: "09:30", is_available: true, modality: "online" },
        { id: 7, psychologist_id: 2, day_of_week: 4, time_slot: "11:00", is_available: true, modality: "presencial" },
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
        { id: 8, psychologist_id: 3, day_of_week: 2, time_slot: "15:30", is_available: true, modality: "online" },
        { id: 9, psychologist_id: 3, day_of_week: 3, time_slot: "10:00", is_available: true, modality: "online" },
        { id: 10, psychologist_id: 3, day_of_week: 5, time_slot: "14:30", is_available: true, modality: "presencial" },
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
        { id: 11, psychologist_id: 4, day_of_week: 1, time_slot: "11:30", is_available: true, modality: "presencial" },
        { id: 12, psychologist_id: 4, day_of_week: 3, time_slot: "13:00", is_available: true, modality: "online" },
        { id: 13, psychologist_id: 4, day_of_week: 4, time_slot: "15:00", is_available: true, modality: "presencial" },
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
        { id: 14, psychologist_id: 5, day_of_week: 2, time_slot: "08:30", is_available: true, modality: "online" },
        { id: 15, psychologist_id: 5, day_of_week: 4, time_slot: "17:00", is_available: true, modality: "online" },
        { id: 16, psychologist_id: 5, day_of_week: 5, time_slot: "12:00", is_available: true, modality: "presencial" },
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
        { id: 17, psychologist_id: 6, day_of_week: 1, time_slot: "13:30", is_available: true, modality: "online" },
        { id: 18, psychologist_id: 6, day_of_week: 3, time_slot: "09:00", is_available: true, modality: "presencial" },
        { id: 19, psychologist_id: 6, day_of_week: 5, time_slot: "16:30", is_available: true, modality: "online" },
      ],
    },
    // Additional 24 psychologists (30 total) with mixed modalities
    {
      id: 7,
      specialtyIds: [9, 10],
      rating: 4.5,
      experience: "7 años",
      price: 72,
      description: "Especialista en trauma y burnout con enfoque en terapia EMDR.",
      available_slots: [
        { id: 20, psychologist_id: 7, day_of_week: 1, time_slot: "14:00", is_available: true, modality: "online" },
        { id: 21, psychologist_id: 7, day_of_week: 2, time_slot: "16:30", is_available: true, modality: "presencial" },
        { id: 22, psychologist_id: 7, day_of_week: 4, time_slot: "10:30", is_available: true, modality: "online" },
      ],
    },
    {
      id: 8,
      specialtyIds: [11, 5],
      rating: 4.7,
      experience: "11 años",
      price: 82,
      description: "Psicólogo especializado en comunicación y terapia de pareja con enfoque humanista.",
      available_slots: [
        { id: 23, psychologist_id: 8, day_of_week: 2, time_slot: "11:00", is_available: true, modality: "presencial" },
        { id: 24, psychologist_id: 8, day_of_week: 3, time_slot: "15:00", is_available: true, modality: "online" },
        { id: 25, psychologist_id: 8, day_of_week: 5, time_slot: "09:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 9,
      specialtyIds: [2, 6, 8],
      rating: 4.8,
      experience: "13 años",
      price: 88,
      description: "Especialista en depresión, estrés laboral y duelo con amplia experiencia en terapia cognitiva.",
      available_slots: [
        { id: 26, psychologist_id: 9, day_of_week: 1, time_slot: "15:30", is_available: true, modality: "online" },
        { id: 27, psychologist_id: 9, day_of_week: 3, time_slot: "11:30", is_available: true, modality: "presencial" },
        { id: 28, psychologist_id: 9, day_of_week: 6, time_slot: "10:00", is_available: true, modality: "online" },
      ],
    },
    {
      id: 10,
      specialtyIds: [1, 9],
      rating: 4.6,
      experience: "5 años",
      price: 68,
      description: "Psicóloga joven especializada en fobias y trauma con enfoque en terapia de exposición.",
      available_slots: [
        { id: 29, psychologist_id: 10, day_of_week: 2, time_slot: "13:30", is_available: true, modality: "online" },
        { id: 30, psychologist_id: 10, day_of_week: 4, time_slot: "14:30", is_available: true, modality: "online" },
        { id: 31, psychologist_id: 10, day_of_week: 5, time_slot: "11:00", is_available: true, modality: "presencial" },
      ],
    },
    // Continue with more psychologists...
    {
      id: 11,
      specialtyIds: [3, 7, 11],
      rating: 4.9,
      experience: "14 años",
      price: 92,
      description: "Especialista senior en ansiedad social, autoestima y comunicación interpersonal.",
      available_slots: [
        { id: 32, psychologist_id: 11, day_of_week: 1, time_slot: "08:00", is_available: true, modality: "presencial" },
        { id: 33, psychologist_id: 11, day_of_week: 3, time_slot: "17:30", is_available: true, modality: "online" },
        { id: 34, psychologist_id: 11, day_of_week: 5, time_slot: "13:00", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 12,
      specialtyIds: [4, 10],
      rating: 4.4,
      experience: "8 años",
      price: 76,
      description: "Psicólogo especializado en relaciones personales y prevención del burnout.",
      available_slots: [
        { id: 35, psychologist_id: 12, day_of_week: 2, time_slot: "10:00", is_available: true, modality: "online" },
        { id: 36, psychologist_id: 12, day_of_week: 4, time_slot: "16:00", is_available: true, modality: "online" },
        { id: 37, psychologist_id: 12, day_of_week: 6, time_slot: "11:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 13,
      specialtyIds: [5, 8, 2],
      rating: 4.7,
      experience: "16 años",
      price: 95,
      description: "Terapeuta familiar especializada en terapia de pareja, duelo y depresión.",
      available_slots: [
        { id: 38, psychologist_id: 13, day_of_week: 1, time_slot: "12:00", is_available: true, modality: "presencial" },
        { id: 39, psychologist_id: 13, day_of_week: 3, time_slot: "14:00", is_available: true, modality: "presencial" },
        { id: 40, psychologist_id: 13, day_of_week: 5, time_slot: "15:30", is_available: true, modality: "online" },
      ],
    },
    {
      id: 14,
      specialtyIds: [6, 9, 10],
      rating: 4.5,
      experience: "9 años",
      price: 79,
      description: "Especialista en estrés laboral, trauma y burnout con enfoque en mindfulness.",
      available_slots: [
        { id: 41, psychologist_id: 14, day_of_week: 2, time_slot: "08:30", is_available: true, modality: "online" },
        { id: 42, psychologist_id: 14, day_of_week: 4, time_slot: "12:30", is_available: true, modality: "presencial" },
        { id: 43, psychologist_id: 14, day_of_week: 6, time_slot: "14:00", is_available: true, modality: "online" },
      ],
    },
    {
      id: 15,
      specialtyIds: [1, 3, 11],
      rating: 4.8,
      experience: "10 años",
      price: 84,
      description: "Psicóloga especializada en fobias, ansiedad social y desarrollo de habilidades comunicativas.",
      available_slots: [
        { id: 44, psychologist_id: 15, day_of_week: 1, time_slot: "17:00", is_available: true, modality: "online" },
        { id: 45, psychologist_id: 15, day_of_week: 3, time_slot: "09:30", is_available: true, modality: "presencial" },
        { id: 46, psychologist_id: 15, day_of_week: 5, time_slot: "10:30", is_available: true, modality: "online" },
      ],
    },
    // Continue adding more psychologists up to 30...
    {
      id: 16,
      specialtyIds: [2, 7, 8],
      rating: 4.6,
      experience: "12 años",
      price: 86,
      description: "Especialista en depresión, autoestima y procesos de duelo con enfoque integrativo.",
      available_slots: [
        { id: 47, psychologist_id: 16, day_of_week: 2, time_slot: "12:00", is_available: true, modality: "presencial" },
        { id: 48, psychologist_id: 16, day_of_week: 4, time_slot: "09:00", is_available: true, modality: "online" },
        { id: 49, psychologist_id: 16, day_of_week: 6, time_slot: "15:00", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 17,
      specialtyIds: [4, 5, 11],
      rating: 4.9,
      experience: "18 años",
      price: 98,
      description: "Terapeuta senior especializada en relaciones, terapia de pareja y comunicación.",
      available_slots: [
        { id: 50, psychologist_id: 17, day_of_week: 1, time_slot: "10:00", is_available: true, modality: "presencial" },
        { id: 51, psychologist_id: 17, day_of_week: 3, time_slot: "16:30", is_available: true, modality: "online" },
        { id: 52, psychologist_id: 17, day_of_week: 5, time_slot: "14:00", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 18,
      specialtyIds: [6, 10, 9],
      rating: 4.4,
      experience: "6 años",
      price: 71,
      description: "Psicólogo joven especializado en estrés laboral, burnout y trauma organizacional.",
      available_slots: [
        { id: 53, psychologist_id: 18, day_of_week: 2, time_slot: "14:30", is_available: true, modality: "online" },
        { id: 54, psychologist_id: 18, day_of_week: 4, time_slot: "11:30", is_available: true, modality: "online" },
        { id: 55, psychologist_id: 18, day_of_week: 6, time_slot: "09:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 19,
      specialtyIds: [1, 2, 7],
      rating: 4.7,
      experience: "11 años",
      price: 83,
      description: "Especialista en fobias, depresión y fortalecimiento de la autoestima personal.",
      available_slots: [
        { id: 56, psychologist_id: 19, day_of_week: 1, time_slot: "14:30", is_available: true, modality: "online" },
        { id: 57, psychologist_id: 19, day_of_week: 3, time_slot: "12:30", is_available: true, modality: "presencial" },
        { id: 58, psychologist_id: 19, day_of_week: 5, time_slot: "16:00", is_available: true, modality: "online" },
      ],
    },
    {
      id: 20,
      specialtyIds: [3, 8, 11],
      rating: 4.8,
      experience: "13 años",
      price: 89,
      description: "Psicóloga especializada en ansiedad social, duelo y desarrollo comunicativo.",
      available_slots: [
        { id: 59, psychologist_id: 20, day_of_week: 2, time_slot: "17:00", is_available: true, modality: "online" },
        { id: 60, psychologist_id: 20, day_of_week: 4, time_slot: "08:30", is_available: true, modality: "presencial" },
        { id: 61, psychologist_id: 20, day_of_week: 6, time_slot: "12:30", is_available: true, modality: "online" },
      ],
    },
    // Adding 10 more to reach 30 total
    {
      id: 21,
      specialtyIds: [5, 6, 10],
      rating: 4.5,
      experience: "7 años",
      price: 74,
      description: "Terapeuta especializada en terapia de pareja, estrés laboral y prevención del burnout.",
      available_slots: [
        { id: 62, psychologist_id: 21, day_of_week: 1, time_slot: "11:00", is_available: true, modality: "presencial" },
        { id: 63, psychologist_id: 21, day_of_week: 3, time_slot: "15:30", is_available: true, modality: "online" },
        { id: 64, psychologist_id: 21, day_of_week: 5, time_slot: "17:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 22,
      specialtyIds: [9, 1, 3],
      rating: 4.6,
      experience: "9 años",
      price: 77,
      description: "Especialista en trauma, fobias y ansiedad social con enfoque en terapia cognitiva.",
      available_slots: [
        { id: 65, psychologist_id: 22, day_of_week: 2, time_slot: "09:00", is_available: true, modality: "online" },
        { id: 66, psychologist_id: 22, day_of_week: 4, time_slot: "13:30", is_available: true, modality: "online" },
        { id: 67, psychologist_id: 22, day_of_week: 6, time_slot: "16:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 23,
      specialtyIds: [2, 4, 7],
      rating: 4.9,
      experience: "15 años",
      price: 93,
      description: "Psicólogo senior especializado en depresión, relaciones personales y autoestima.",
      available_slots: [
        { id: 68, psychologist_id: 23, day_of_week: 1, time_slot: "16:30", is_available: true, modality: "presencial" },
        { id: 69, psychologist_id: 23, day_of_week: 3, time_slot: "10:30", is_available: true, modality: "online" },
        { id: 70, psychologist_id: 23, day_of_week: 5, time_slot: "11:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 24,
      specialtyIds: [8, 11, 6],
      rating: 4.4,
      experience: "8 años",
      price: 75,
      description: "Especialista en duelo, comunicación y manejo del estrés en el trabajo.",
      available_slots: [
        { id: 71, psychologist_id: 24, day_of_week: 2, time_slot: "11:30", is_available: true, modality: "online" },
        { id: 72, psychologist_id: 24, day_of_week: 4, time_slot: "15:00", is_available: true, modality: "presencial" },
        { id: 73, psychologist_id: 24, day_of_week: 6, time_slot: "13:30", is_available: true, modality: "online" },
      ],
    },
    {
      id: 25,
      specialtyIds: [10, 9, 2],
      rating: 4.7,
      experience: "10 años",
      price: 81,
      description: "Psicóloga especializada en burnout, trauma y tratamiento de la depresión.",
      available_slots: [
        { id: 74, psychologist_id: 25, day_of_week: 1, time_slot: "13:00", is_available: true, modality: "online" },
        { id: 75, psychologist_id: 25, day_of_week: 3, time_slot: "08:30", is_available: true, modality: "presencial" },
        { id: 76, psychologist_id: 25, day_of_week: 5, time_slot: "15:00", is_available: true, modality: "online" },
      ],
    },
    {
      id: 26,
      specialtyIds: [1, 5, 11],
      rating: 4.8,
      experience: "12 años",
      price: 87,
      description: "Terapeuta especializada en fobias, terapia de pareja y habilidades comunicativas.",
      available_slots: [
        { id: 77, psychologist_id: 26, day_of_week: 2, time_slot: "15:00", is_available: true, modality: "presencial" },
        { id: 78, psychologist_id: 26, day_of_week: 4, time_slot: "10:00", is_available: true, modality: "online" },
        { id: 79, psychologist_id: 26, day_of_week: 6, time_slot: "17:00", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 27,
      specialtyIds: [3, 6, 7],
      rating: 4.5,
      experience: "6 años",
      price: 69,
      description: "Psicólogo joven especializado en ansiedad social, estrés laboral y autoestima.",
      available_slots: [
        { id: 80, psychologist_id: 27, day_of_week: 1, time_slot: "09:30", is_available: true, modality: "online" },
        { id: 81, psychologist_id: 27, day_of_week: 3, time_slot: "14:30", is_available: true, modality: "online" },
        { id: 82, psychologist_id: 27, day_of_week: 5, time_slot: "12:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 28,
      specialtyIds: [4, 8, 10],
      rating: 4.6,
      experience: "11 años",
      price: 85,
      description: "Especialista en relaciones personales, duelo y prevención del burnout profesional.",
      available_slots: [
        { id: 83, psychologist_id: 28, day_of_week: 2, time_slot: "16:00", is_available: true, modality: "presencial" },
        { id: 84, psychologist_id: 28, day_of_week: 4, time_slot: "12:00", is_available: true, modality: "online" },
        { id: 85, psychologist_id: 28, day_of_week: 6, time_slot: "10:30", is_available: true, modality: "presencial" },
      ],
    },
    {
      id: 29,
      specialtyIds: [9, 2, 11],
      rating: 4.9,
      experience: "17 años",
      price: 96,
      description: "Psicóloga senior especializada en trauma, depresión y desarrollo comunicativo.",
      available_slots: [
        { id: 86, psychologist_id: 29, day_of_week: 1, time_slot: "15:00", is_available: true, modality: "online" },
        { id: 87, psychologist_id: 29, day_of_week: 3, time_slot: "11:00", is_available: true, modality: "presencial" },
        { id: 88, psychologist_id: 29, day_of_week: 5, time_slot: "09:00", is_available: true, modality: "online" },
      ],
    },
    {
      id: 30,
      specialtyIds: [1, 6, 8],
      rating: 4.7,
      experience: "14 años",
      price: 91,
      description: "Especialista en fobias, estrés laboral y acompañamiento en procesos de duelo.",
      available_slots: [
        { id: 89, psychologist_id: 30, day_of_week: 2, time_slot: "13:00", is_available: true, modality: "presencial" },
        { id: 90, psychologist_id: 30, day_of_week: 4, time_slot: "17:30", is_available: true, modality: "online" },
        { id: 91, psychologist_id: 30, day_of_week: 6, time_slot: "11:00", is_available: true, modality: "presencial" },
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
          is_available,
          modality
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
          { tematica: "Depresión", total_sesiones: 45, porcentaje: 28.1 },
          { tematica: "Ansiedad Social", total_sesiones: 38, porcentaje: 23.8 },
          { tematica: "Fobias", total_sesiones: 32, porcentaje: 20.0 },
          { tematica: "Estrés Laboral", total_sesiones: 28, porcentaje: 17.5 },
          { tematica: "Relaciones Personales", total_sesiones: 17, porcentaje: 10.6 },
        ],
        busiest_days: [
          { dia_semana: "Miércoles", total_sesiones: 35, porcentaje: 21.9 },
          { dia_semana: "Martes", total_sesiones: 32, porcentaje: 20.0 },
          { dia_semana: "Jueves", total_sesiones: 28, porcentaje: 17.5 },
          { dia_semana: "Lunes", total_sesiones: 25, porcentaje: 15.6 },
          { dia_semana: "Viernes", total_sesiones: 22, porcentaje: 13.8 },
          { dia_semana: "Sábado", total_sesiones: 12, porcentaje: 7.5 },
          { dia_semana: "Domingo", total_sesiones: 6, porcentaje: 3.8 },
        ],
        popular_modalities: [
          { modalidad: "online", total_sesiones: 128, porcentaje: 80.0, precio_promedio: 82.3 },
          { modalidad: "telefonica", total_sesiones: 22, porcentaje: 13.8, precio_promedio: 75.8 },
          { modalidad: "presencial", total_sesiones: 10, porcentaje: 6.3, precio_promedio: 89.5 },
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
