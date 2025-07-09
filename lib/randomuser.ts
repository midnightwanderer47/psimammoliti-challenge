interface RandomUserResponse {
  results: Array<{
    name: {
      title: string
      first: string
      last: string
    }
    picture: {
      large: string
      medium: string
      thumbnail: string
    }
    gender: string
  }>
}

interface UserData {
  name: string
  image_url: string
  gender: string
}

// Cache to store API responses and avoid repeated calls
const userCache = new Map<number, UserData>()

// Fallback names for when API fails
const fallbackNames = [
  { name: "Dra. María González", gender: "female" },
  { name: "Dr. Carlos Mendoza", gender: "male" },
  { name: "Dra. Ana Rodríguez", gender: "female" },
  { name: "Dr. Luis Herrera", gender: "male" },
  { name: "Dra. Carmen Silva", gender: "female" },
  { name: "Dr. Roberto Martín", gender: "male" },
  { name: "Dra. Patricia López", gender: "female" },
  { name: "Dr. Fernando Castro", gender: "male" },
  { name: "Dra. Isabel Moreno", gender: "female" },
  { name: "Dr. Alejandro Ruiz", gender: "male" },
  { name: "Dra. Sofía Jiménez", gender: "female" },
  { name: "Dr. Miguel Ángel Torres", gender: "male" },
  { name: "Dra. Lucía Ramírez", gender: "female" },
  { name: "Dr. Diego Vargas", gender: "male" },
  { name: "Dra. Valentina Herrera", gender: "female" },
  { name: "Dr. Sebastián Morales", gender: "male" },
  { name: "Dra. Camila Delgado", gender: "female" },
  { name: "Dr. Andrés Peña", gender: "male" },
  { name: "Dra. Natalia Cruz", gender: "female" },
  { name: "Dr. Gabriel Soto", gender: "male" },
  { name: "Dra. Daniela Vega", gender: "female" },
  { name: "Dr. Mateo Guerrero", gender: "male" },
  { name: "Dra. Alejandra Mendez", gender: "female" },
  { name: "Dr. Nicolás Rojas", gender: "male" },
  { name: "Dra. Mariana Castillo", gender: "female" },
  { name: "Dr. Santiago Ortega", gender: "male" },
  { name: "Dra. Valeria Núñez", gender: "female" },
  { name: "Dr. Emilio Ramos", gender: "male" },
  { name: "Dra. Adriana Flores", gender: "female" },
  { name: "Dr. Joaquín Aguilar", gender: "male" },
]

export async function fetchRandomUser(index: number): Promise<UserData> {
  // Check cache first
  if (userCache.has(index)) {
    return userCache.get(index)!
  }

  try {
    // Use index as seed to get consistent results for the same psychologist
    const seed = `psychologist-${index}`
    const nationality = ["es", "us", "gb"][index % 3] // Rotate between Spanish, US, and UK

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(`https://randomuser.me/api/?seed=${seed}&nat=${nationality}&inc=name,picture,gender`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: RandomUserResponse = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error("No user data received")
    }

    const user = data.results[0]
    const title = user.gender === "female" ? "Dra." : "Dr."
    const fullName = `${title} ${user.name.first} ${user.name.last}`

    const userData: UserData = {
      name: fullName,
      image_url: user.picture.large,
      gender: user.gender,
    }

    // Cache the result
    userCache.set(index, userData)

    return userData
  } catch (error) {
    console.warn(`Failed to fetch random user for index ${index}:`, error)

    // Use fallback data
    const fallbackIndex = index % fallbackNames.length
    const fallback = fallbackNames[fallbackIndex]

    const fallbackData: UserData = {
      name: fallback.name,
      image_url: `/placeholder.svg?height=100&width=100&text=${encodeURIComponent(fallback.name)}`,
      gender: fallback.gender,
    }

    // Cache the fallback
    userCache.set(index, fallbackData)

    return fallbackData
  }
}
