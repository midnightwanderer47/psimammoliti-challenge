"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, ChevronLeft, ChevronRight, Loader2, Shield, Video, MapPin } from "lucide-react"
import { getPsychologists, getSpecialties, bookSession, getBookedSessions } from "@/lib/database"
import type { PsychologistWithSpecialties, Specialty, Session } from "@/lib/supabase"
import { PsychologistCard } from "@/components/psychologist-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { StatusBanner } from "@/components/status-banner"
import { FilterSection } from "@/components/filter-section"
import { EmptyState } from "@/components/empty-state"

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export default function PsychologyApp() {
  const [psychologists, setPsychologists] = useState<PsychologistWithSpecialties[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas")
  const [selectedModality, setSelectedModality] = useState("Todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPsychologist, setSelectedPsychologist] = useState<PsychologistWithSpecialties | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookedAppointment, setBookedAppointment] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [userTimezone, setUserTimezone] = useState("")
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookedSessions, setBookedSessions] = useState<Session[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState("Todas")

  // Formulario de paciente
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [databaseReady, setDatabaseReady] = useState(false)

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(timezone)
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [psychologistsData, specialtiesData, bookedSessionsData] = await Promise.all([
        getPsychologists(),
        getSpecialties(),
        getBookedSessions(),
      ])
      setPsychologists(psychologistsData)
      setSpecialties([{ id: 0, name: "Todas", description: "" }, ...specialtiesData])
      setBookedSessions(bookedSessionsData)

      if (psychologistsData.length > 0 && psychologistsData[0].id) {
        setDatabaseReady(true)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Error cargando datos. Usando datos de demostración.")
    } finally {
      setLoading(false)
    }
  }

  const filteredPsychologists = useMemo(() => {
    let filtered = psychologists

    // Filter by specialty
    if (selectedSpecialty !== "Todas") {
      filtered = filtered.filter((p) => p.specialties.some((s) => s.name === selectedSpecialty))
    }

    // Filter by modality
    if (selectedModality !== "Todas") {
      filtered = filtered.filter((p) =>
        p.available_slots.some((slot) => slot.modality === selectedModality && slot.is_available),
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.specialties.some((s) => s.name.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [psychologists, selectedSpecialty, selectedModality, searchQuery, bookedSessions, userTimezone])

  const resetFilters = () => {
    setSelectedSpecialty("Todas")
    setSelectedModality("Todas")
    setSearchQuery("")
  }

  const getWeekDates = (weekOffset = 0) => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - currentDay + 1 + weekOffset * 7)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

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

      // For debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Slot time check:", {
          slotDateTimeString,
          slotDateTime: slotDateTime.toISOString(),
          now: now.toISOString(),
          userTimezone,
          timeSlot,
          isPast: slotDateTime < now,
        })
      }

      return slotDateTime < now
    } catch (error) {
      console.error("Error checking if slot is in past:", error)
      return false // If there's an error, don't filter out the slot
    }
  }

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

  const convertTimeToUserTimezone = (time: string) => {
    if (!userTimezone || !time) {
      console.log("No timezone or time provided:", { userTimezone, time })
      return time
    }

    try {
      // Parse the time string (format: "HH:MM")
      const [hours, minutes] = time.split(":").map(Number)

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format:", time)
        return time
      }

      // Create a date object for today
      const today = new Date()

      // Create a proper UTC date string for today with the given time
      const dateString = today.toISOString().split("T")[0] // YYYY-MM-DD format

      // Ensure time is in HH:MM format (remove any seconds if present)
      const cleanTime = time.split(":").slice(0, 2).join(":")
      const utcDateTimeString = `${dateString}T${cleanTime}:00.000Z` // UTC time

      // Debug: log the time conversion
      if (process.env.NODE_ENV === "development") {
        console.log("Time conversion debug:", {
          originalTime: time,
          cleanTime: cleanTime,
          utcDateTimeString: utcDateTimeString,
        })
      }

      // Create a Date object from the UTC time
      const utcDate = new Date(utcDateTimeString)

      if (isNaN(utcDate.getTime())) {
        console.error("Invalid UTC date:", utcDateTimeString)
        return time
      }

      // Get the time in user's timezone using a simpler approach
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
        console.error("Invalid timezone conversion result:", userTimeString)
        return time // Fallback to original time
      }
    } catch (error) {
      console.error("Error converting timezone:", error)

      // Simple fallback: just return the original time if conversion fails
      // This ensures the UI doesn't break even if timezone conversion fails
      return time
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedPsychologist || !selectedSlot || !patientName || !patientEmail) {
      alert("Por favor completa todos los campos")
      return
    }

    setBookingLoading(true)
    try {
      const sessionData = {
        patient_name: patientName,
        patient_email: patientEmail,
        patient_timezone: userTimezone,
        psychologist_id: selectedPsychologist.id,
        specialty_id: selectedPsychologist.specialties[0].id,
        session_date: selectedSlot.date.toISOString().split("T")[0],
        session_time: selectedSlot.originalTime,
        modality: selectedSlot.modality,
        price: selectedPsychologist.price,
      }

      const result = await bookSession(sessionData)

      if (result.success) {
        const appointment = {
          psychologist: selectedPsychologist,
          slot: selectedSlot,
          bookingDate: new Date().toLocaleDateString(),
          userTimezone: userTimezone,
          sessionData: result.data,
        }
        setBookedAppointment(appointment)
        setShowConfirmation(true)
        setSelectedPsychologist(null)
        setSelectedSlot(null)
        setPatientName("")
        setPatientEmail("")

        // Reload booked sessions to update the calendar
        const updatedBookedSessions = await getBookedSessions()
        setBookedSessions(updatedBookedSessions)
      } else {
        alert("Error al agendar la cita. Por favor intenta de nuevo.")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Error al agendar la cita. Por favor intenta de nuevo.")
    } finally {
      setBookingLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getAvailableSlotsForDay = (psychologist: PsychologistWithSpecialties, dayOfWeek: number, date: Date) => {
    return psychologist.available_slots
      .filter((slot) => slot.day_of_week === dayOfWeek && slot.is_available)
      .filter((slot) => !isSlotInPast(date, slot.time_slot, userTimezone))
      .sort((a, b) => a.time_slot.localeCompare(b.time_slot))
      .map((slot) => ({
        time_slot: slot.time_slot,
        modality: slot.modality,
        isBooked: isSlotBooked(psychologist.id, date, slot.time_slot, slot.modality),
      }))
  }

  const weekDates = getWeekDates(currentWeek)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Psimammoliti Online</h1>
            <p className="text-lg text-muted-foreground">Cargando psicólogos disponibles...</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
            Plataforma líder en salud mental online
          </div>
          <h1 className="text-5xl font-bold mb-4">Psimammoliti Online</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Conecta con psicólogos profesionales certificados desde la comodidad de tu hogar
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>100% Confidencial</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>Sesiones Online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Sesiones Presenciales</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Disponible 24/7</span>
            </div>
          </div>

          {userTimezone && (
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Horarios en tu zona: {userTimezone}</span>
            </div>
          )}
        </div>

        {/* Status Banners */}
        {!databaseReady && !loading && (
          <StatusBanner
            type="demo"
            message="Modo Demo: La base de datos se está configurando. Mostrando datos de demostración."
            onRetry={loadData}
            showRetry={true}
          />
        )}

        {error && <StatusBanner type="error" message={error} />}

        {/* Filters */}
        <FilterSection
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={setSelectedSpecialty}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedModality={selectedModality}
          onModalityChange={setSelectedModality}
          resultCount={filteredPsychologists.length}
        />

        {/* Psychologists Grid */}
        {filteredPsychologists.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPsychologists.map((psychologist) => (
              <PsychologistCard
                key={psychologist.id}
                psychologist={psychologist}
                onViewAvailability={setSelectedPsychologist}
                bookedSessions={bookedSessions}
                userTimezone={userTimezone}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={psychologists.length === 0 ? "no-psychologists" : "no-results"} onReset={resetFilters} />
        )}

        {/* Booking Modal */}
        <Dialog open={!!selectedPsychologist} onOpenChange={() => setSelectedPsychologist(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto sm:max-w-5xl w-[95vw] sm:w-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Agendar Sesión - {selectedPsychologist?.name}</DialogTitle>
              <DialogDescription className="text-lg">
                ${selectedPsychologist?.price} USD por sesión de 50 minutos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                <div className="text-center min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-lg truncate">
                    {weekDates[0].toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="flex-shrink-0"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-4">
                {/* Desktop Calendar - Hidden on mobile */}
                <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
                  {dayNames.map((dayName, index) => {
                    const availableSlots = selectedPsychologist
                      ? getAvailableSlotsForDay(selectedPsychologist, index, weekDates[index])
                      : []

                    return (
                      <div key={dayName} className="text-center">
                        <div className="font-semibold text-sm mb-3 p-3 bg-muted rounded-lg border">
                          <div>{dayName}</div>
                          <div className="text-xs text-muted-foreground mt-1">{formatDate(weekDates[index])}</div>
                        </div>
                        <div className="space-y-2">
                          {availableSlots.map((slot, timeIndex) => {
                            const convertedTime = convertTimeToUserTimezone(slot.time_slot)
                            const slotData = {
                              date: weekDates[index],
                              originalTime: slot.time_slot,
                              convertedTime: convertedTime,
                              day: dayName,
                              modality: slot.modality,
                            }
                            const isSelected =
                              selectedSlot?.originalTime === slot.time_slot &&
                              selectedSlot?.date.toDateString() === weekDates[index].toDateString() &&
                              selectedSlot?.modality === slot.modality

                            if (slot.isBooked) {
                              return (
                                <div
                                  key={`${timeIndex}-${slot.modality}`}
                                  className="w-full text-xs flex flex-col gap-1 h-auto py-2 px-2 bg-red-50 border border-red-200 rounded text-red-600 cursor-not-allowed"
                                >
                                  <div className="font-medium">{convertedTime}</div>
                                  <div className="flex items-center gap-1 text-xs opacity-75">
                                    {slot.modality === "online" ? (
                                      <Video className="h-3 w-3" />
                                    ) : (
                                      <MapPin className="h-3 w-3" />
                                    )}
                                    Reservado
                                  </div>
                                </div>
                              )
                            }

                            return (
                              <Button
                                key={`${timeIndex}-${slot.modality}`}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className="w-full text-xs flex flex-col gap-1 h-auto py-2"
                                onClick={() => setSelectedSlot(slotData)}
                              >
                                <div className="font-medium">{convertedTime}</div>
                                <div className="flex items-center gap-1 text-xs opacity-75">
                                  {slot.modality === "online" ? (
                                    <Video className="h-3 w-3" />
                                  ) : (
                                    <MapPin className="h-3 w-3" />
                                  )}
                                  {slot.modality === "online" ? "Online" : "Presencial"}
                                </div>
                              </Button>
                            )
                          })}
                          {availableSlots.length === 0 && (
                            <div className="text-xs text-muted-foreground py-4 bg-muted rounded border-2 border-dashed">
                              No disponible
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Mobile Calendar - Visible only on mobile */}
                <div className="sm:hidden space-y-4">
                  {dayNames.map((dayName, index) => {
                    const availableSlots = selectedPsychologist
                      ? getAvailableSlotsForDay(selectedPsychologist, index, weekDates[index])
                      : []

                    if (availableSlots.length === 0) return null

                    return (
                      <div key={dayName} className="border rounded-lg p-4 bg-card">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b">
                          <div>
                            <div className="font-semibold text-base">{dayName}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(weekDates[index])}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {availableSlots.length} disponible{availableSlots.length !== 1 ? "s" : ""}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {availableSlots.map((slot, timeIndex) => {
                            const convertedTime = convertTimeToUserTimezone(slot.time_slot)
                            const slotData = {
                              date: weekDates[index],
                              originalTime: slot.time_slot,
                              convertedTime: convertedTime,
                              day: dayName,
                              modality: slot.modality,
                            }
                            const isSelected =
                              selectedSlot?.originalTime === slot.time_slot &&
                              selectedSlot?.date.toDateString() === weekDates[index].toDateString() &&
                              selectedSlot?.modality === slot.modality

                            if (slot.isBooked) {
                              return (
                                <div
                                  key={`${timeIndex}-${slot.modality}`}
                                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg cursor-not-allowed"
                                >
                                  <div className="flex items-center gap-3">
                                    {slot.modality === "online" ? (
                                      <Video className="h-5 w-5 text-red-600" />
                                    ) : (
                                      <MapPin className="h-5 w-5 text-red-600" />
                                    )}
                                    <div>
                                      <div className="font-medium text-red-600">{convertedTime}</div>
                                      <div className="text-sm text-red-500">
                                        {slot.modality === "online" ? "Online" : "Presencial"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-sm text-red-600 font-medium">Reservado</div>
                                </div>
                              )
                            }

                            return (
                              <Button
                                key={`${timeIndex}-${slot.modality}`}
                                variant={isSelected ? "default" : "outline"}
                                className="flex items-center justify-between p-4 h-auto text-left"
                                onClick={() => setSelectedSlot(slotData)}
                              >
                                <div className="flex items-center gap-3">
                                  {slot.modality === "online" ? (
                                    <Video className="h-5 w-5" />
                                  ) : (
                                    <MapPin className="h-5 w-5" />
                                  )}
                                  <div>
                                    <div className="font-medium text-base">{convertedTime}</div>
                                    <div className="text-sm opacity-75">
                                      {slot.modality === "online" ? "Sesión Online" : "Sesión Presencial"}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <CheckCircle className="h-5 w-5" />}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Patient Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Paciente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Nombre completo *</Label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientEmail">Correo electrónico *</Label>
                    <Input
                      id="patientEmail"
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="mt-1"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              {selectedSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de tu Cita</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Psicólogo:</span>
                        <div className="font-medium">{selectedPsychologist?.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Especialidades:</span>
                        <div className="font-medium">
                          {selectedPsychologist?.specialties.map((s) => s.name).join(", ")}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha:</span>
                        <div className="font-medium">
                          {selectedSlot.date.toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hora:</span>
                        <div className="font-medium">{selectedSlot.convertedTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Modalidad:</span>
                        <div className="font-medium flex items-center gap-2">
                          {selectedSlot.modality === "online" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          {selectedSlot.modality === "online" ? "Sesión Online" : "Sesión Presencial"}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Precio:</span>
                        <div className="font-semibold text-lg">${selectedPsychologist?.price} USD</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA Button */}
              <Button
                className="w-full h-12 sm:h-12 text-base sm:text-lg"
                onClick={handleBookAppointment}
                disabled={!selectedSlot || !patientName || !patientEmail || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Agendando tu cita...</span>
                    <span className="sm:hidden">Agendando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="hidden sm:inline">Confirmar Cita</span>
                    <span className="sm:hidden">Confirmar</span>
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-green-800">¡Cita Agendada!</DialogTitle>
                  <DialogDescription className="text-green-600">
                    Tu sesión ha sido confirmada exitosamente
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {bookedAppointment && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Detalles de tu cita:</h3>
                  <div className="space-y-2 text-sm text-green-700">
                    <div>
                      <span className="font-medium">Psicólogo:</span> {bookedAppointment.psychologist.name}
                    </div>
                    <div>
                      <span className="font-medium">Fecha:</span>{" "}
                      {bookedAppointment.slot.date.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Hora:</span> {bookedAppointment.slot.convertedTime} (
                      {bookedAppointment.userTimezone})
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Modalidad:</span>
                      {bookedAppointment.slot.modality === "online" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {bookedAppointment.slot.modality === "online" ? "Sesión Online" : "Sesión Presencial"}
                    </div>
                    <div>
                      <span className="font-medium">Precio:</span> ${bookedAppointment.psychologist.price} USD
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                  <p className="mb-2">
                    <strong>Próximos pasos:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Recibirás un email de confirmación en los próximos minutos</li>
                    {bookedAppointment.slot.modality === "online" ? (
                      <li>Te enviaremos el enlace de la videollamada 30 minutos antes de tu cita</li>
                    ) : (
                      <li>Te enviaremos la dirección del consultorio y las indicaciones de acceso</li>
                    )}
                    <li>
                      {bookedAppointment.slot.modality === "online"
                        ? "Asegúrate de tener una conexión estable a internet"
                        : "Llega 10 minutos antes de tu cita al consultorio"}
                    </li>
                  </ul>
                </div>

                <Button className="w-full" onClick={() => setShowConfirmation(false)}>
                  Entendido
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
