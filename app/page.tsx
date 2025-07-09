"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, ChevronLeft, ChevronRight, Loader2, Shield, Video, Users } from "lucide-react"
import { getPsychologists, getSpecialties, bookSession } from "@/lib/database"
import type { PsychologistWithSpecialties, Specialty } from "@/lib/supabase"
import { PsychologistCard } from "@/components/psychologist-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { StatusBanner } from "@/components/status-banner"
import { FilterSection } from "@/components/filter-section"
import { EmptyState } from "@/components/empty-state"

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function PsychologyApp() {
  const [psychologists, setPsychologists] = useState<PsychologistWithSpecialties[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPsychologist, setSelectedPsychologist] = useState<PsychologistWithSpecialties | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookedAppointment, setBookedAppointment] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [userTimezone, setUserTimezone] = useState("")
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)

  // Formulario de paciente
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [databaseReady, setDatabaseReady] = useState(false)
  const [apiStatus, setApiStatus] = useState<string | null>(null)

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUserTimezone(timezone)
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    setApiStatus("Cargando psicólogos con fotos reales...")

    try {
      const [psychologistsData, specialtiesData] = await Promise.all([getPsychologists(), getSpecialties()])
      setPsychologists(psychologistsData)
      setSpecialties([{ id: 0, name: "Todas", description: "" }, ...specialtiesData])

      if (psychologistsData.length > 0 && psychologistsData[0].id) {
        setDatabaseReady(true)
        setApiStatus("✅ Psicólogos cargados con fotos reales de Random User API")
      } else {
        setApiStatus("⚠️ Usando datos de demostración con fotos reales")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Error cargando datos. Usando datos de demostración.")
      setApiStatus("❌ Error en la carga, usando datos de respaldo")
    } finally {
      setLoading(false)
      // Clear API status after 3 seconds
      setTimeout(() => setApiStatus(null), 3000)
    }
  }

  const filteredPsychologists = useMemo(() => {
    let filtered = psychologists

    // Filter by specialty
    if (selectedSpecialty !== "Todas") {
      filtered = filtered.filter((p) => p.specialties.some((s) => s.name === selectedSpecialty))
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
  }, [psychologists, selectedSpecialty, searchQuery])

  const resetFilters = () => {
    setSelectedSpecialty("Todas")
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
        modality: "online",
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

  const getAvailableSlotsForDay = (psychologist: PsychologistWithSpecialties, dayOfWeek: number) => {
    return psychologist.available_slots
      .filter((slot) => slot.day_of_week === dayOfWeek && slot.is_available)
      .map((slot) => slot.time_slot)
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
            {apiStatus && <p className="text-sm text-muted-foreground mt-2">{apiStatus}</p>}
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
              <Clock className="h-4 w-4" />
              <span>Disponible 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Perfiles Reales</span>
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
        {apiStatus && <StatusBanner type="info" message={apiStatus} />}

        {!databaseReady && !loading && (
          <StatusBanner
            type="demo"
            message="Modo Demo: La base de datos se está configurando. Mostrando datos de demostración con fotos reales."
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
              />
            ))}
          </div>
        ) : (
          <EmptyState type={psychologists.length === 0 ? "no-psychologists" : "no-results"} onReset={resetFilters} />
        )}

        {/* Booking Modal */}
        <Dialog open={!!selectedPsychologist} onOpenChange={() => setSelectedPsychologist(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Agendar Sesión - {selectedPsychologist?.name}</DialogTitle>
              <DialogDescription className="text-lg">
                ${selectedPsychologist?.price} USD por sesión de 50 minutos • Modalidad online
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {weekDates[0].toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-3">
                {dayNames.map((dayName, index) => {
                  const availableSlots = selectedPsychologist
                    ? getAvailableSlotsForDay(selectedPsychologist, index)
                    : []

                  return (
                    <div key={dayName} className="text-center">
                      <div className="font-semibold text-sm mb-3 p-3 bg-muted rounded-lg border">
                        <div>{dayName}</div>
                        <div className="text-xs text-muted-foreground mt-1">{formatDate(weekDates[index])}</div>
                      </div>
                      <div className="space-y-2">
                        {availableSlots.map((time, timeIndex) => {
                          const convertedTime = convertTimeToUserTimezone(time)
                          const slotData = {
                            date: weekDates[index],
                            originalTime: time,
                            convertedTime: convertedTime,
                            day: dayName,
                          }
                          const isSelected =
                            selectedSlot?.originalTime === time &&
                            selectedSlot?.date.toDateString() === weekDates[index].toDateString()

                          return (
                            <Button
                              key={timeIndex}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => setSelectedSlot(slotData)}
                            >
                              {convertedTime}
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

              {/* Patient Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información del Paciente</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                        <div className="font-medium">Sesión Online</div>
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
                className="w-full h-12 text-lg"
                onClick={handleBookAppointment}
                disabled={!selectedSlot || !patientName || !patientEmail || bookingLoading}
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Agendando tu cita...
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

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                ¡Cita Agendada Exitosamente!
              </DialogTitle>
            </DialogHeader>

            {bookedAppointment && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detalles de tu Cita</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID de Sesión:</span>
                      <span className="font-mono font-medium">#{bookedAppointment.sessionData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Psicólogo:</span>
                      <span className="font-medium">{bookedAppointment.psychologist.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">
                        {bookedAppointment.slot.date.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora:</span>
                      <span className="font-medium">{bookedAppointment.slot.convertedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-semibold">${bookedAppointment.psychologist.price} USD</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Próximos Pasos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Recibirás un email de confirmación en los próximos minutos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>El enlace de la videollamada se enviará 30 minutos antes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5" />
                        <span>Asegúrate de tener una conexión estable a internet</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Button className="w-full h-12" onClick={() => setShowConfirmation(false)}>
                  Perfecto, ¡Entendido!
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
