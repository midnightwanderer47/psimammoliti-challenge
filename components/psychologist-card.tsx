"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Star, DollarSign, Video, MapPin, User, CalendarDays, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bookSession } from "@/lib/database"
import type { PsychologistWithSpecialties } from "@/lib/supabase"

interface PsychologistCardProps {
  psychologist: PsychologistWithSpecialties
}

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const TIMEZONES = [
  { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
  { value: "America/New_York", label: "Nueva York (GMT-5)" },
  { value: "America/Los_Angeles", label: "Los Ángeles (GMT-8)" },
  { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
  { value: "Europe/London", label: "Londres (GMT+0)" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (GMT-3)" },
  { value: "America/Chicago", label: "Chicago (GMT-6)" },
]

export function PsychologistCard({ psychologist }: PsychologistCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<{
    day: number
    time: string
    modality: "online" | "presencial"
  } | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    timezone: "America/Mexico_City",
  })
  const [isBooking, setIsBooking] = useState(false)
  const [bookingResult, setBookingResult] = useState<{
    success: boolean
    message: string
    data?: any
  } | null>(null)

  // Get unique modalities available for this psychologist
  const availableModalities = [...new Set(psychologist.available_slots.map((slot) => slot.modality))]

  // Get modality display info
  const getModalityInfo = (modality: "online" | "presencial") => {
    return modality === "online"
      ? { icon: <Video className="h-4 w-4" />, label: "Online", color: "bg-blue-100 text-blue-800" }
      : { icon: <MapPin className="h-4 w-4" />, label: "Presencial", color: "bg-green-100 text-green-800" }
  }

  // Generate calendar for current week
  const generateCalendar = () => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + selectedWeek * 7)

    const calendar = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)

      const daySlots = psychologist.available_slots.filter((slot) => slot.day_of_week === i && slot.is_available)

      calendar.push({
        date,
        dayOfWeek: i,
        dayName: DAYS_OF_WEEK[i],
        slots: daySlots,
      })
    }

    return calendar
  }

  const handleBooking = async () => {
    if (!selectedSlot || !selectedSpecialty || !patientData.name || !patientData.email) {
      return
    }

    setIsBooking(true)

    const sessionDate = generateCalendar().find((day) => day.dayOfWeek === selectedSlot.day)?.date
    if (!sessionDate) return

    try {
      const result = await bookSession({
        patient_name: patientData.name,
        patient_email: patientData.email,
        patient_timezone: patientData.timezone,
        psychologist_id: psychologist.id,
        specialty_id: selectedSpecialty,
        session_date: sessionDate.toISOString().split("T")[0],
        session_time: selectedSlot.time,
        modality: selectedSlot.modality,
        price: psychologist.price,
      })

      if (result.success) {
        setBookingResult({
          success: true,
          message: "¡Sesión reservada exitosamente!",
          data: result.data,
        })
      } else {
        setBookingResult({
          success: false,
          message: "Error al reservar la sesión. Por favor, intenta nuevamente.",
        })
      }
    } catch (error) {
      setBookingResult({
        success: false,
        message: "Error al reservar la sesión. Por favor, intenta nuevamente.",
      })
    } finally {
      setIsBooking(false)
    }
  }

  const resetBookingModal = () => {
    setSelectedSlot(null)
    setSelectedSpecialty(null)
    setPatientData({ name: "", email: "", timezone: "America/Mexico_City" })
    setBookingResult(null)
    setSelectedWeek(0)
  }

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={psychologist.image_url || "/placeholder.svg"} alt={psychologist.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight">{psychologist.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{psychologist.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{psychologist.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">${psychologist.price}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">{psychologist.description}</p>

          {/* Specialties */}
          <div>
            <h4 className="font-medium text-sm mb-2">Especialidades</h4>
            <div className="flex flex-wrap gap-1">
              {psychologist.specialties.map((specialty) => (
                <Badge key={specialty.id} variant="secondary" className="text-xs">
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Available Modalities */}
          <div>
            <h4 className="font-medium text-sm mb-2">Modalidades disponibles</h4>
            <div className="flex flex-wrap gap-2">
              {availableModalities.map((modality) => {
                const modalityInfo = getModalityInfo(modality)
                return (
                  <Badge key={modality} variant="outline" className={`flex items-center gap-1 ${modalityInfo.color}`}>
                    {modalityInfo.icon}
                    {modalityInfo.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          <Button
            onClick={() => setIsBookingOpen(true)}
            className="w-full"
            disabled={psychologist.available_slots.length === 0}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {psychologist.available_slots.length > 0 ? "Reservar Sesión" : "Sin horarios disponibles"}
          </Button>
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <Dialog
        open={isBookingOpen}
        onOpenChange={(open) => {
          setIsBookingOpen(open)
          if (!open) resetBookingModal()
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Reservar sesión con {psychologist.name}
            </DialogTitle>
          </DialogHeader>

          {bookingResult ? (
            <div className="text-center py-8">
              {bookingResult.success ? (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-xl font-semibold text-green-700">¡Sesión reservada exitosamente!</h3>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2 text-left">
                    <p>
                      <strong>Psicólogo:</strong> {psychologist.name}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {generateCalendar()
                        .find((day) => day.dayOfWeek === selectedSlot?.day)
                        ?.date.toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Hora:</strong> {selectedSlot?.time}
                    </p>
                    <p>
                      <strong>Modalidad:</strong> {selectedSlot?.modality === "online" ? "Online" : "Presencial"}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${psychologist.price}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-left">
                    <h4 className="font-semibold mb-2">Próximos pasos:</h4>
                    {selectedSlot?.modality === "online" ? (
                      <p className="text-sm">
                        Recibirás un enlace de videollamada por correo electrónico antes de tu sesión.
                      </p>
                    ) : (
                      <p className="text-sm">
                        Recibirás la dirección del consultorio y las instrucciones por correo electrónico.
                      </p>
                    )}
                  </div>
                  <Button onClick={() => setIsBookingOpen(false)} className="w-full">
                    Cerrar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-red-500 text-2xl">✕</span>
                  </div>
                  <h3 className="text-xl font-semibold text-red-700">Error al reservar</h3>
                  <p className="text-red-600">{bookingResult.message}</p>
                  <Button onClick={() => setBookingResult(null)} variant="outline">
                    Intentar nuevamente
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Week Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedWeek(selectedWeek - 1)}
                  disabled={selectedWeek <= 0}
                >
                  ← Semana anterior
                </Button>
                <span className="font-medium">{selectedWeek === 0 ? "Esta semana" : `Semana ${selectedWeek + 1}`}</span>
                <Button
                  variant="outline"
                  onClick={() => setSelectedWeek(selectedWeek + 1)}
                  disabled={selectedWeek >= 3}
                >
                  Siguiente semana →
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {generateCalendar().map((day) => (
                  <div key={day.dayOfWeek} className="text-center">
                    <div className="font-medium text-sm mb-2">{day.dayName}</div>
                    <div className="text-xs text-gray-500 mb-2">{day.date.toLocaleDateString()}</div>
                    <div className="space-y-1">
                      {day.slots.map((slot) => {
                        const modalityInfo = getModalityInfo(slot.modality)
                        const isSelected =
                          selectedSlot?.day === day.dayOfWeek &&
                          selectedSlot?.time === slot.time_slot &&
                          selectedSlot?.modality === slot.modality

                        return (
                          <Button
                            key={`${slot.id}-${slot.modality}`}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={`w-full text-xs p-1 h-auto flex flex-col gap-1 ${
                              isSelected ? "" : modalityInfo.color
                            }`}
                            onClick={() =>
                              setSelectedSlot({
                                day: day.dayOfWeek,
                                time: slot.time_slot,
                                modality: slot.modality,
                              })
                            }
                          >
                            <div className="flex items-center gap-1">
                              {modalityInfo.icon}
                              <span>{slot.time_slot}</span>
                            </div>
                            <span className="text-xs opacity-75">{modalityInfo.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {selectedSlot && (
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">Detalles de la reserva</h3>

                  {/* Specialty Selection */}
                  <div>
                    <Label htmlFor="specialty">Especialidad</Label>
                    <Select
                      value={selectedSpecialty?.toString()}
                      onValueChange={(value) => setSelectedSpecialty(Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {psychologist.specialties.map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.id.toString()}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={patientData.name}
                        onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={patientData.email}
                        onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Zona horaria</Label>
                    <Select
                      value={patientData.timezone}
                      onValueChange={(value) => setPatientData({ ...patientData, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Resumen de la reserva</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Psicólogo:</strong> {psychologist.name}
                      </p>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {generateCalendar()
                          .find((day) => day.dayOfWeek === selectedSlot.day)
                          ?.date.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Hora:</strong> {selectedSlot.time}
                      </p>
                      <p>
                        <strong>Modalidad:</strong> {selectedSlot.modality === "online" ? "Online" : "Presencial"}
                      </p>
                      <p>
                        <strong>Especialidad:</strong>{" "}
                        {psychologist.specialties.find((s) => s.id === selectedSpecialty)?.name || "No seleccionada"}
                      </p>
                      <p>
                        <strong>Precio:</strong> ${psychologist.price}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={!selectedSpecialty || !patientData.name || !patientData.email || isBooking}
                    className="w-full"
                  >
                    {isBooking ? "Reservando..." : "Confirmar Reserva"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
