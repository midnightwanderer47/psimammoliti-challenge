"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, ChevronLeft, ChevronRight, Brain, Loader2, Shield, Video, MapPin } from "lucide-react"
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
  const [showBookingModal, setShowBookingModal] = useState(false)
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
      filtered = filtered.filter((p) => {
        // Get all available modalities for this psychologist
        const availableModalities = [...new Set(
          p.available_slots
            .filter(slot => slot.is_available)
            .map(slot => slot.modality)
        )]
        
        // Only show psychologists who offer ONLY the selected modality
        return availableModalities.length === 1 && availableModalities[0] === selectedModality
      })
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

  const handleSlotSelect = (psychologist: PsychologistWithSpecialties, slot: any) => {
    setSelectedPsychologist(psychologist)
    setSelectedSlot(slot)
    setShowBookingModal(true)
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
        setShowBookingModal(false)
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
            Plataforma líder en salud mental
          </div>
          <h1 className="text-5xl font-bold mb-4">Psimammoliti Hub</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Conecta con psicólogos profesionales certificados, presencial o virtual
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>Sesiones Online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Sesiones Presenciales</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>Múltiples especialidades</span>
            </div>
          </div>

          {/* {userTimezone && (
            <div
              data-testid="timezone-display"
              className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground"
            >
              <Clock className="h-4 w-4" />
              <span>Horarios en tu zona: {userTimezone}</span>
            </div>
          )} */}
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
                onSlotSelect={handleSlotSelect}
                bookedSessions={bookedSessions}
                userTimezone={userTimezone}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={psychologists.length === 0 ? "no-psychologists" : "no-results"} onReset={resetFilters} />
        )}

        {/* Quick Booking Modal */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Confirmar Cita</DialogTitle>
              <DialogDescription>Completa tus datos para agendar la sesión</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Selected Appointment Summary */}
              {selectedSlot && selectedPsychologist && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={selectedPsychologist.image_url || "/placeholder.svg"}
                          alt={selectedPsychologist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedPsychologist.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedPsychologist.experience} de experiencia
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                        <div className="font-medium flex items-center gap-1">
                          {selectedSlot.modality === "online" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          {selectedSlot.modality === "online" ? "Online" : `Presencial en ${selectedPsychologist.city}`}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Precio:</span>
                        <div className="font-semibold text-lg">${selectedPsychologist.price} USD</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patient Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tus Datos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="patientName">Nombre completo *</Label>
                    <Input
                      id="patientName"
                      name="patientName"
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
                      name="patientEmail"
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

              {/* CTA Button */}
              <Button
                className="w-full h-12 text-lg"
                onClick={handleBookAppointment}
                disabled={!selectedSlot || !patientName || !patientEmail || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Confirmando tu cita...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirmar Cita
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
