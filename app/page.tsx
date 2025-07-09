"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Shield, Video, MapPin, Brain, Users } from "lucide-react"
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
  const [loading, setLoading] = useState(true)
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedModality, setSelectedModality] = useState<string>("todas")
  const [selectedPsychologist, setSelectedPsychologist] = useState<PsychologistWithSpecialties | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookedAppointment, setBookedAppointment] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [userTimezone, setUserTimezone] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

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
      const [psychologistsData, specialtiesData] = await Promise.all([getPsychologists(), getSpecialties()])
      setPsychologists(psychologistsData)
      setSpecialties(specialtiesData)

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
    return psychologists.filter((psychologist) => {
      // Filter by specialties
      if (selectedSpecialties.length > 0) {
        const hasMatchingSpecialty = psychologist.specialties.some((specialty) =>
          selectedSpecialties.includes(specialty.id),
        )
        if (!hasMatchingSpecialty) return false
      }

      // Filter by price range
      if (psychologist.price < priceRange[0] || psychologist.price > priceRange[1]) {
        return false
      }

      // Filter by modality
      if (selectedModality !== "todas") {
        const hasMatchingModality = psychologist.available_slots.some((slot) => slot.modality === selectedModality)
        if (!hasMatchingModality) return false
      }

      return true
    })
  }, [psychologists, selectedSpecialties, priceRange, selectedModality])

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
      .map((slot) => ({
        time_slot: slot.time_slot,
        modality: slot.modality,
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
      <StatusBanner />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Encuentra tu psicólogo ideal</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Conecta con profesionales especializados en tu área de necesidad
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <Brain className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Especialistas Certificados</p>
              </div>
              <div className="text-center">
                <Video className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Sesiones Online</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Sesiones Presenciales</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">100% Confidencial</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <FilterSection
          specialties={specialties}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyChange={setSelectedSpecialties}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedModality={selectedModality}
          onModalityChange={setSelectedModality}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">{filteredPsychologists.length} psicólogos disponibles</h2>
          </div>
          <div className="text-sm text-gray-600">Mostrando resultados filtrados</div>
        </div>

        {/* Psychologists Grid */}
        {filteredPsychologists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychologists.map((psychologist) => (
              <PsychologistCard
                key={psychologist.id}
                psychologist={psychologist}
                onViewAvailability={setSelectedPsychologist}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            onClearFilters={() => {
              setSelectedSpecialties([])
              setPriceRange([0, 200])
              setSelectedModality("todas")
            }}
          />
        )}

        {/* Booking Modal */}
        <Dialog open={!!selectedPsychologist} onOpenChange={() => setSelectedPsychologist(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Agendar Sesión - {selectedPsychologist?.name}</DialogTitle>
              <DialogDescription className="text-lg">
                ${selectedPsychologist?.price} USD por sesión de 50 minutos
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
