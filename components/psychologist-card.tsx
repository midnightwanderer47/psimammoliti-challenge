"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Star, MapPin, Clock, Award, Video, AlertTriangle, Zap } from "lucide-react"
import Image from "next/image"
import type { PsychologistWithSpecialties } from "@/lib/supabase"

interface PsychologistCardProps {
  psychologist: PsychologistWithSpecialties
  onViewAvailability: (psychologist: PsychologistWithSpecialties) => void
  onQuickBook: (psychologist: PsychologistWithSpecialties, slot: any) => void
  bookedSessions?: any[]
  userTimezone?: string
}

export function PsychologistCard({
  psychologist,
  onViewAvailability,
  onQuickBook,
  bookedSessions = [],
  userTimezone = "",
}: PsychologistCardProps) {
  // Get unique modalities available for this psychologist
  const availableModalities = [...new Set(psychologist.available_slots.map((slot) => slot.modality))]

  // Helper function to check if slot is booked
  const isSlotBooked = (psychologistId: number, date: Date, timeSlot: string, modality: string) => {
    const dateString = date.toISOString().split("T")[0]
    return bookedSessions.some(
      (session) =>
        session.psychologist_id === psychologistId &&
        session.session_date === dateString &&
        session.session_time === timeSlot &&
        session.modality === modality &&
        session.status === "scheduled",
    )
  }

  // Helper function to check if slot is in past (same logic as in app/page.tsx)
  const isSlotInPast = (date: Date, timeSlot: string, userTimezone: string) => {
    if (!userTimezone) return false

    try {
      // Parse the time slot
      const [hours, minutes] = timeSlot.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) return false

      // Create a date object for the slot in the user's timezone
      // We need to create the date string in the user's timezone
      const slotDate = new Date(date)
      const year = slotDate.getFullYear()
      const month = slotDate.getMonth() + 1
      const day = slotDate.getDate()

      // Create a date string in the user's timezone
      const slotDateString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
      const slotTimeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`

      // Create the full datetime string in the user's timezone
      const slotDateTimeString = `${slotDateString}T${slotTimeString}`

      // Create a Date object that represents this time in the user's timezone
      // We'll use the Intl.DateTimeFormat to ensure proper timezone handling
      const slotDateTime = new Date(slotDateTimeString + "Z") // Add Z to treat as UTC

      // Get current time
      const now = new Date()

      return slotDateTime < now
    } catch (error) {
      console.error("Error checking if slot is in past:", error)
      return false // If there's an error, don't filter out the slot
    }
  }

  // Helper function to convert time to user timezone (same logic as in app/page.tsx)
  const convertTimeToUserTimezone = (time: string, date: Date) => {
    if (!userTimezone || !time) {
      return time
    }

    try {
      // Parse the time string (format: "HH:MM")
      const [hours, minutes] = time.split(":").map(Number)

      if (isNaN(hours) || isNaN(minutes)) {
        return time
      }

      // Create a proper UTC date string for the specific date with the given time
      const dateString = date.toISOString().split("T")[0] // YYYY-MM-DD format

      // Ensure time is in HH:MM format (remove any seconds if present)
      const cleanTime = time.split(":").slice(0, 2).join(":")
      const utcDateTimeString = `${dateString}T${cleanTime}:00.000Z` // UTC time

      // Create a Date object from the UTC time
      const utcDate = new Date(utcDateTimeString)

      if (isNaN(utcDate.getTime())) {
        return time
      }

      // Get the time in user's timezone
      const userTimeString = utcDate.toLocaleTimeString("en-US", {
        timeZone: userTimezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      // Validate the result
      if (userTimeString && userTimeString !== "Invalid Date") {
        return userTimeString
      } else {
        return time // Fallback to original time
      }
    } catch (error) {
      return time // Fallback to original time if conversion fails
    }
  }

  // Get next available slots for quick booking
  const getNextAvailableSlots = () => {
    const today = new Date()
    const allSlots = []

    // Check next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() + dayOffset)
      // Convert JavaScript day of week (0=Sunday) to calendar day of week (0=Monday)
      let dayOfWeek = checkDate.getDay()
      // Convert: Sunday(0) -> 6, Monday(1) -> 0, Tuesday(2) -> 1, etc.
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

      const daySlots = psychologist.available_slots
        .filter((slot) => slot.day_of_week === dayOfWeek && slot.is_available)
        .filter((slot) => !isSlotInPast(checkDate, slot.time_slot, userTimezone))
        .filter((slot) => !isSlotBooked(psychologist.id, checkDate, slot.time_slot, slot.modality))
        .map((slot) => {
          const convertedTime = convertTimeToUserTimezone(slot.time_slot, checkDate)
          return {
            ...slot,
            date: checkDate,
            dateString: checkDate.toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            }),
            isToday: dayOffset === 0,
            isTomorrow: dayOffset === 1,
            convertedTime: convertedTime,
            dayOffset: dayOffset,
          }
        })

      allSlots.push(...daySlots)
    }

    // Sort all slots by date and time to get the earliest available slots
    allSlots.sort((a, b) => {
      // First sort by day offset (earlier days first)
      if (a.dayOffset !== b.dayOffset) {
        return a.dayOffset - b.dayOffset
      }
      // Then sort by time within the same day
      return a.time_slot.localeCompare(b.time_slot)
    })

    return allSlots.slice(0, 3)
  }

  const nextSlots = getNextAvailableSlots()

  // Calculate total available slots (excluding past slots and booked slots)
  const totalAvailableSlots = psychologist.available_slots.filter((slot) => {
    if (!slot.is_available) return false

    // Calculate the date for this slot's day of the week for current week
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1)

    const slotDate = new Date(monday)
    slotDate.setDate(monday.getDate() + slot.day_of_week)

    // Check if slot is in past
    if (isSlotInPast(slotDate, slot.time_slot, userTimezone)) return false

    // Check if slot is booked
    if (isSlotBooked(psychologist.id, slotDate, slot.time_slot, slot.modality)) return false

    return true
  }).length

  const hasLowAvailability = totalAvailableSlots <= 3
  const hasImmediateAvailability = nextSlots.some((slot) => slot.isToday || slot.isTomorrow)

  return (
    <Card
      data-testid="psychologist-card"
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative"
    >
      {hasImmediateAvailability && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-green-500 text-white text-xs px-2 py-1 shadow-lg">
            <Zap className="h-3 w-3 mr-1" />
            Disponible hoy
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-border shadow-sm">
            <Image
              src={psychologist.image_url || "/placeholder.svg"}
              alt={psychologist.name}
              width={80}
              height={80}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <CardTitle className="text-xl font-semibold mb-1">{psychologist.name}</CardTitle>

        <CardDescription data-testid="experience" className="flex items-center justify-center gap-1 text-sm">
          <Award className="h-3 w-3" />
          {psychologist.experience} de experiencia
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Rating */}
        <div data-testid="rating" className="flex items-center justify-center gap-2 p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(psychologist.rating) ? "fill-foreground text-foreground" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">{psychologist.rating}</span>
          <span className="text-xs text-muted-foreground">(127 reseñas)</span>
        </div>

        {/* Quick Booking Slots */}
        {nextSlots.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-sm mb-2 text-blue-800 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Próximos horarios
            </h4>
            <div className="space-y-2">
              {nextSlots.map((slot, index) => (
                <Button
                  key={`${slot.date.toISOString()}-${slot.time_slot}-${slot.modality}`}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs h-8 bg-white hover:bg-blue-100 border-blue-200"
                  onClick={() =>
                    onQuickBook(psychologist, {
                      ...slot,
                      originalTime: slot.time_slot,
                      convertedTime: slot.convertedTime,
                      day: slot.dateString,
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {slot.isToday ? "Hoy" : slot.isTomorrow ? "Mañana" : slot.dateString}
                    </span>
                    <span>{slot.convertedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {slot.modality === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Specialties */}
        <div data-testid="specialties">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Especialidades
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {psychologist.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty.id} variant="secondary" className="text-xs px-2 py-1">
                {specialty.name}
              </Badge>
            ))}
            {psychologist.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                +{psychologist.specialties.length - 3} más
              </Badge>
            )}
          </div>
        </div>

        {/* Available Modalities */}
        <div data-testid="modalities">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Modalidades disponibles
          </h4>
          <div className="flex gap-2">
            {availableModalities.map((modality) => (
              <Badge key={modality} variant="outline" className="text-xs px-2 py-1">
                <div className="flex items-center gap-1">
                  {modality === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                  {modality === "online" ? "Online" : "Presencial"}
                </div>
              </Badge>
            ))}
          </div>
        </div>

        {/* Availability indicator */}
        <div
          data-testid="availability-indicator"
          className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
            hasLowAvailability ? "text-orange-700 bg-orange-50 border border-orange-200" : "text-green-700 bg-green-50"
          }`}
        >
          {hasLowAvailability ? (
            <>
              <AlertTriangle className="h-3 w-3" />
              <span>Poca disponibilidad ({totalAvailableSlots} horarios)</span>
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              <span>Disponible esta semana ({totalAvailableSlots} horarios)</span>
            </>
          )}
        </div>

        {/* Price and CTA */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div data-testid="price" className="text-2xl font-bold">
                ${psychologist.price}
              </div>
              <div className="text-xs text-muted-foreground">por sesión de 50 min</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Modalidades</div>
              <div className="text-sm font-medium">
                {availableModalities.length === 2
                  ? "Online + Presencial"
                  : availableModalities[0] === "online"
                    ? "Online"
                    : "Presencial"}
              </div>
            </div>
          </div>

          <Button className="w-full bg-transparent" variant="outline" onClick={() => onViewAvailability(psychologist)}>
            <Calendar className="h-4 w-4 mr-2" />
            Ver Todos los Horarios
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
