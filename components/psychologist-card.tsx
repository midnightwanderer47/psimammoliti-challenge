"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Award, Video, ChevronLeft, ChevronRight, Brain } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { PsychologistWithSpecialties } from "@/lib/supabase"

interface PsychologistCardProps {
  psychologist: PsychologistWithSpecialties
  onViewAvailability: (psychologist: PsychologistWithSpecialties) => void
  onSlotSelect: (psychologist: PsychologistWithSpecialties, slot: any) => void
  bookedSessions?: any[]
  userTimezone?: string
}

export function PsychologistCard({
  psychologist,
  onViewAvailability,
  onSlotSelect,
  bookedSessions = [],
  userTimezone = "",
}: PsychologistCardProps) {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

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

  // Helper function to check if slot is in past
  const isSlotInPast = (date: Date, timeSlot: string, userTimezone: string) => {
    if (!userTimezone) return false

    try {
      const [hours, minutes] = timeSlot.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) return false

      const slotDateTime = new Date(date)
      slotDateTime.setHours(hours, minutes, 0, 0)

      return slotDateTime <= new Date()
    } catch (error) {
      return false
    }
  }

  // Get week dates for calendar
  const getWeekDates = (weekOffset = 0) => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 4) // Changed from *7 to *4 to show 4-day chunks

    const weekDates = []
    for (let i = 0; i < 4; i++) {
      // Show 4 consecutive days
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  // Convert time to user timezone
  const convertTimeToUserTimezone = (time: string) => {
    if (!userTimezone || !time) {
      return time
    }

    try {
      const [hours, minutes] = time.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) return time

      const today = new Date()
      const dateString = today.toISOString().split("T")[0]
      const cleanTime = time.split(":").slice(0, 2).join(":")
      const utcDateTimeString = `${dateString}T${cleanTime}:00.000Z`
      const utcDate = new Date(utcDateTimeString)

      if (isNaN(utcDate.getTime())) return time

      const userTimeString = utcDate.toLocaleTimeString("en-US", {
        timeZone: userTimezone,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      return userTimeString && userTimeString !== "Invalid Date" ? userTimeString : time
    } catch (error) {
      return time
    }
  }

  // Get available slots for a specific day
  const getAvailableSlotsForDay = (dayOfWeek: number, date: Date, showAll = false) => {
    // Convert JavaScript day (0=Sunday, 1=Monday) to DB day (0=Monday, 6=Sunday)
    const jsDay = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    const dbDay = jsDay === 0 ? 6 : jsDay - 1 // Convert: Sunday(0) -> 6, Monday(1) -> 0, etc.
    
    const allSlots = psychologist.available_slots
      .filter((slot) => slot.day_of_week === dbDay && slot.is_available)
      .filter((slot) => !isSlotInPast(date, slot.time_slot, userTimezone))
      .sort((a, b) => a.time_slot.localeCompare(b.time_slot))
      .map((slot) => ({
        time_slot: slot.time_slot,
        modality: slot.modality,
        isBooked: isSlotBooked(psychologist.id, date, slot.time_slot, slot.modality),
      }))
      .filter((slot) => !slot.isBooked) // Only show available slots (booked slots disappear)
    
    return showAll ? allSlots : allSlots.slice(0, 3)
  }

  // Check if a week has any available slots
  const weekHasAvailability = (weekOffset: number) => {
    const weekDates = getWeekDates(weekOffset)

    for (let dayIndex = 0; dayIndex < 4; dayIndex++) {
      const availableSlots = getAvailableSlotsForDay(dayIndex, weekDates[dayIndex])
      if (availableSlots.length > 0) {
        return true
      }
    }
    return false
  }

  // Find the first week with availability starting from week 0
  const findFirstWeekWithAvailability = () => {
    for (let week = 0; week < 8; week++) {
      // Check up to 8 weeks ahead
      if (weekHasAvailability(week)) {
        return week
      }
    }
    return 0 // Fallback to current week if no availability found
  }

  // Initialize currentWeek to first week with availability
  useEffect(() => {
    const firstAvailableWeek = findFirstWeekWithAvailability()
    setCurrentWeek(firstAvailableWeek)
  }, [psychologist, bookedSessions, userTimezone])

  // Navigation handlers that ensure we always show weeks with availability
  const goToPreviousWeek = () => {
    let newWeek = currentWeek - 1
    let attempts = 0

    // Find the previous week with availability (max 8 attempts to avoid infinite loop)
    while (attempts < 8 && newWeek >= 0 && !weekHasAvailability(newWeek)) {
      newWeek--
      attempts++
    }

    // Only update if we found a valid week with availability
    if (newWeek >= 0 && weekHasAvailability(newWeek)) {
      setCurrentWeek(newWeek)
    }
  }

  const goToNextWeek = () => {
    let newWeek = currentWeek + 1
    let attempts = 0

    // Find the next week with availability (max 8 attempts to avoid infinite loop)
    while (attempts < 8 && newWeek < 8 && !weekHasAvailability(newWeek)) {
      newWeek++
      attempts++
    }

    // Only update if we found a valid week with availability
    if (newWeek < 8 && weekHasAvailability(newWeek)) {
      setCurrentWeek(newWeek)
    }
  }

  // Calculate total available slots (excluding past slots and booked slots)
  const totalAvailableSlots = psychologist.available_slots.filter((slot) => {
    if (!slot.is_available) return false

    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1)

    const slotDate = new Date(monday)
    slotDate.setDate(monday.getDate() + slot.day_of_week)

    if (isSlotInPast(slotDate, slot.time_slot, userTimezone)) return false
    if (isSlotBooked(psychologist.id, slotDate, slot.time_slot, slot.modality)) return false

    return true
  }).length

  const hasLowAvailability = totalAvailableSlots <= 3
  const weekDates = getWeekDates(currentWeek)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  // Calculate timezone offset for display
  const getTimezoneOffset = () => {
    if (!userTimezone) return ""
    
    try {
      const now = new Date()
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000)
      const userTime = new Date(utcTime).toLocaleString("en-US", { timeZone: userTimezone })
      const userDate = new Date(userTime)
      const offsetMs = userDate.getTimezoneOffset() * 60000
      const offsetHours = Math.abs(Math.floor(offsetMs / (1000 * 60 * 60)))
      const offsetMinutes = Math.abs(Math.floor((offsetMs % (1000 * 60 * 60)) / (1000 * 60)))
      const sign = offsetMs > 0 ? "-" : "+"
      
      const offsetString = `(${sign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")})`
      const timezoneName = userTimezone.split("/").pop()?.replace("_", " ") || userTimezone
      
      return `${offsetString} ${timezoneName}`
    } catch (error) {
      return userTimezone
    }
  }

  const handleSlotClick = (slot: any, date: Date) => {
    const slotData = {
      date: date,
      originalTime: slot.time_slot,
      convertedTime: convertTimeToUserTimezone(slot.time_slot),
      day: date.toLocaleDateString("es-ES", { weekday: "short" }),
      modality: slot.modality,
    }
    onSlotSelect(psychologist, slotData)
  }

  const toggleDayExpansion = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    const newExpandedDays = new Set(expandedDays)
    if (newExpandedDays.has(dateKey)) {
      newExpandedDays.delete(dateKey)
    } else {
      newExpandedDays.add(dateKey)
    }
    setExpandedDays(newExpandedDays)
  }

  // Check if navigation buttons should be disabled
  const canGoToPrevious = () => {
    for (let week = currentWeek - 1; week >= 0; week--) {
      if (weekHasAvailability(week)) return true
    }
    return false
  }

  const canGoToNext = () => {
    for (let week = currentWeek + 1; week < 8; week++) {
      if (weekHasAvailability(week)) return true
    }
    return false
  }

  return (
    <Card
      data-testid="psychologist-card"
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
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
          {/* <span className="text-xs text-muted-foreground">(127 reseñas)</span> */}
        </div>

        {/* Specialties */}
        <div data-testid="specialties">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
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


        {/* Description */}
        <p data-testid="description" className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {psychologist.description}
        </p>

        {/* Integrated Calendar */}
        <div className="border rounded-lg p-3 bg-muted/30">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousWeek}
              className="h-8 w-8 p-0"
              disabled={!canGoToPrevious()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium text-center">
              <div>{weekDates[0].toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</div>
              {userTimezone && (
                <div className="text-xs text-muted-foreground">{getTimezoneOffset()}</div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={goToNextWeek} className="h-8 w-8 p-0" disabled={!canGoToNext()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-4 gap-2">
            {weekDates.map((date, index) => {
              const dateKey = date.toISOString().split('T')[0]
              const isExpanded = expandedDays.has(dateKey)
              const availableSlots = getAvailableSlotsForDay(date.getDay(), date, isExpanded)
              const allSlots = getAvailableSlotsForDay(date.getDay(), date, true)
              const dayName = date.toLocaleDateString("es-ES", { weekday: "short" })
              const hasMoreSlots = allSlots.length > 3 || (process.env.NODE_ENV === 'development' && allSlots.length > 0)

              return (
                <div key={index} className="text-center">
                  <div className="font-medium text-xs mb-2 p-2 bg-background rounded border">
                    <div>{dayName}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(date)}</div>
                  </div>
                  <div className="space-y-1">
                    {availableSlots.map((slot, timeIndex) => {
                      const convertedTime = convertTimeToUserTimezone(slot.time_slot)

                      return (
                        <Button
                          key={`${timeIndex}-${slot.modality}`}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs py-1 px-1 h-auto flex flex-col gap-0.5 bg-transparent hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleSlotClick(slot, weekDates[index])}
                        >
                          <div className="font-medium">{convertedTime}</div>
                          <div className="flex items-center justify-center gap-1">
                            {slot.modality === "online" ? (
                              <Video className="h-2 w-2" />
                            ) : (
                              <MapPin className="h-2 w-2" />
                            )}
                          </div>
                        </Button>
                      )
                    })}
                    {availableSlots.length === 0 && (
                      <div className="text-xs text-muted-foreground py-2 bg-muted rounded border-2 border-dashed">
                        No disponible
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Expand/Collapse Button - Positioned below calendar */}
          {(() => {
            // Check if there are any days with more than 3 slots available
            const daysWithMoreSlots = weekDates.filter((date) => {
              const dateKey = date.toISOString().split('T')[0]
              const allSlots = getAvailableSlotsForDay(date.getDay(), date, true)
              return allSlots.length > 3
            })

            // Check if there are any expanded days
            const hasExpandedDays = weekDates.some((date) => {
              const dateKey = date.toISOString().split('T')[0]
              return expandedDays.has(dateKey)
            })

            // Only show button if there are actually more slots to show
            if (daysWithMoreSlots.length === 0 && !hasExpandedDays) {
              return null
            }

            // Determine which day to toggle
            const dayToToggle = hasExpandedDays 
              ? weekDates.find((date) => {
                  const dateKey = date.toISOString().split('T')[0]
                  return expandedDays.has(dateKey)
                })
              : daysWithMoreSlots[0]

            if (!dayToToggle) return null

            const isExpanded = hasExpandedDays
            const buttonText = isExpanded ? "Ver menos" : "Ver más horas"

            return (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all duration-300 ease-out bg-background border border-border/50 hover:border-primary/60 hover:bg-primary/5 group"
                  onClick={() => toggleDayExpansion(dayToToggle)}
                >
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                      {buttonText}
                    </span>
                    
                    {/* Animated chevron icon */}
                    <div className={`transition-transform duration-300 ease-out ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="text-foreground/70 group-hover:text-foreground/90"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </div>
                  </div>
                </Button>
              </div>
            )
          })()}

          {/* Availability Summary */}
          {/* {totalAvailableSlots > 0 && (
            <div className="mt-3 text-center">
              <div className="text-xs text-muted-foreground">
                {totalAvailableSlots} horario{totalAvailableSlots !== 1 ? "s" : ""} disponible
                {totalAvailableSlots !== 1 ? "s" : ""} esta semana
              </div>
            </div>
          )} */}
        </div>

        {/* Price and CTA */}
        <div className="pt-2">
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
                  ? `Online + Presencial en ${psychologist.city}`
                  : availableModalities[0] === "online"
                    ? "Online"
                    : `Presencial en ${psychologist.city}`}

        {/* City Information - Only show for psychologists with in-person therapy */}
        {/* {(() => {
          const hasInPersonTherapy = psychologist.available_slots.some(slot => slot.modality === "presencial")
          
          // Only show city if they offer in-person therapy and have a city
          if (hasInPersonTherapy && psychologist.city) {
            return (
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                <MapPin className="h-3 w-3" />
                <span>{psychologist.city}</span>
              </div>
            )
          }
          return null
        })()} */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
