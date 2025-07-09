"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Star, MapPin, Clock, Award, Video } from "lucide-react"
import Image from "next/image"
import type { PsychologistWithSpecialties } from "@/lib/supabase"

interface PsychologistCardProps {
  psychologist: PsychologistWithSpecialties
  onViewAvailability: (psychologist: PsychologistWithSpecialties) => void
}

export function PsychologistCard({ psychologist, onViewAvailability }: PsychologistCardProps) {
  // Get unique modalities available for this psychologist
  const availableModalities = [...new Set(psychologist.available_slots.map((slot) => slot.modality))]

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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

        <CardDescription className="flex items-center justify-center gap-1 text-sm">
          <Award className="h-3 w-3" />
          {psychologist.experience} de experiencia
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Rating */}
        <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded-lg">
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

        {/* Specialties */}
        <div>
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

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{psychologist.description}</p>

        {/* Available Modalities */}
        <div>
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
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg">
          <Clock className="h-3 w-3" />
          <span>Disponible esta semana</span>
        </div>

        {/* Price and CTA */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold">${psychologist.price}</div>
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

          <Button className="w-full" onClick={() => onViewAvailability(psychologist)}>
            <Calendar className="h-4 w-4 mr-2" />
            Ver Disponibilidad
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
