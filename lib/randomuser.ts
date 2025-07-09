// Types for Random User API
interface RandomUserName {
  title: string
  first: string
  last: string
}

interface RandomUserPicture {
  large: string
  medium: string
  thumbnail: string
}

interface RandomUserResult {
  gender: string
  name: RandomUserName
  picture: RandomUserPicture
}

interface RandomUserResponse {
  results: RandomUserResult[]
  info: {
    seed: string
    results: number
    page: number
    version: string
  }
}

// Cache for storing fetched users to avoid repeated API calls
const userCache = new Map<number, { name: string; image_url: string }>()

// Fallback names and images in case API fails
const fallbackUsers = [
  {
    name: "Dra. María González",
    image_url: "/placeholder.svg?height=100&width=100&text=MG",
  },
  {
    name: "Dr. Carlos Mendoza",
    image_url: "/placeholder.svg?height=100&width=100&text=CM",
  },
  {
    name: "Dra. Ana Rodríguez",
    image_url: "/placeholder.svg?height=100&width=100&text=AR",
  },
  {
    name: "Dr. Luis Fernández",
    image_url: "/placeholder.svg?height=100&width=100&text=LF",
  },
  {
    name: "Dra. Carmen López",
    image_url: "/placeholder.svg?height=100&width=100&text=CL",
  },
  {
    name: "Dr. Miguel Torres",
    image_url: "/placeholder.svg?height=100&width=100&text=MT",
  },
  {
    name: "Dra. Isabel Martín",
    image_url: "/placeholder.svg?height=100&width=100&text=IM",
  },
  {
    name: "Dr. Francisco Ruiz",
    image_url: "/placeholder.svg?height=100&width=100&text=FR",
  },
]

export async function fetchRandomUser(index: number): Promise<{ name: string; image_url: string }> {
  // Check cache first
  if (userCache.has(index)) {
    return userCache.get(index)!
  }

  try {
    // Use a seed based on index to get consistent results
    const seed = `psimammoliti-${index}`
    const response = await fetch(`https://randomuser.me/api/?seed=${seed}&results=1&inc=name,picture&nat=es,us,gb`, {
      // Add timeout and cache control
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: RandomUserResponse = await response.json()

    if (!data.results || data.results.length === 0) {
      throw new Error("No results from Random User API")
    }

    const user = data.results[0]

    // Format the name with appropriate title
    const title = user.gender === "female" ? "Dra." : "Dr."
    const formattedName = `${title} ${user.name.first} ${user.name.last}`

    const userData = {
      name: formattedName,
      image_url: user.picture.large,
    }

    // Cache the result
    userCache.set(index, userData)

    console.log(`✅ Fetched user ${index} from Random User API:`, userData.name)

    return userData
  } catch (error) {
    console.warn(`⚠️ Failed to fetch user ${index} from Random User API:`, error)

    // Use fallback data
    const fallbackIndex = index % fallbackUsers.length
    const fallbackUser = fallbackUsers[fallbackIndex]

    // Cache the fallback result to avoid repeated API calls
    userCache.set(index, fallbackUser)

    console.log(`🔄 Using fallback user ${index}:`, fallbackUser.name)

    return fallbackUser
  }
}

// Function to fetch multiple users at once
export async function fetchMultipleRandomUsers(count: number): Promise<Array<{ name: string; image_url: string }>> {
  const promises = Array.from({ length: count }, (_, index) => fetchRandomUser(index))

  try {
    const results = await Promise.allSettled(promises)

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        console.warn(`Failed to fetch user ${index}, using fallback`)
        const fallbackIndex = index % fallbackUsers.length
        return fallbackUsers[fallbackIndex]
      }
    })
  } catch (error) {
    console.error("Error fetching multiple users:", error)
    // Return fallback users if everything fails
    return fallbackUsers.slice(0, count)
  }
}

// Clear cache function (useful for development)
export function clearUserCache() {
  userCache.clear()
  console.log("🧹 User cache cleared")
}
