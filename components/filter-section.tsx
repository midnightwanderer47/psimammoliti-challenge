"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Video, MapPin, Globe } from "lucide-react"
import type { Specialty } from "@/lib/supabase"

interface FilterSectionProps {
  specialties: Specialty[]
  selectedSpecialties: number[]
  onSpecialtyChange: (specialtyIds: number[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedModality: string
  onModalityChange: (modality: string) => void
}

export function FilterSection({
  specialties,
  selectedSpecialties,
  onSpecialtyChange,
  priceRange,
  onPriceRangeChange,
  selectedModality,
  onModalityChange,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSpecialtyToggle = (specialtyId: number) => {
    if (selectedSpecialties.includes(specialtyId)) {
      onSpecialtyChange(selectedSpecialties.filter((id) => id !== specialtyId))
    } else {
      onSpecialtyChange([...selectedSpecialties, specialtyId])
    }
  }

  const clearAllFilters = () => {
    onSpecialtyChange([])
    onPriceRangeChange([0, 200])
    onModalityChange("todas")
  }

  const hasActiveFilters =
    selectedSpecialties.length > 0 || priceRange[0] > 0 || priceRange[1] < 200 || selectedModality !== "todas"

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "online":
        return <Video className="h-4 w-4" />
      case "presencial":
        return <MapPin className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case "online":
        return "Online"
      case "presencial":
        return "Presencial"
      default:
        return "Todas"
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filtros</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {selectedSpecialties.length +
                  (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) +
                  (selectedModality !== "todas" ? 1 : 0)}{" "}
                activos
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-sm">
                Limpiar filtros
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-sm">
              {isExpanded ? "Ocultar" : "Mostrar"} filtros
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSpecialties.map((specialtyId) => {
              const specialty = specialties.find((s) => s.id === specialtyId)
              return (
                <Badge key={specialtyId} variant="default" className="flex items-center gap-1">
                  {specialty?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleSpecialtyToggle(specialtyId)} />
                </Badge>
              )
            })}
            {(priceRange[0] > 0 || priceRange[1] < 200) && (
              <Badge variant="default" className="flex items-center gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onPriceRangeChange([0, 200])} />
              </Badge>
            )}
            {selectedModality !== "todas" && (
              <Badge variant="default" className="flex items-center gap-1">
                {getModalityIcon(selectedModality)}
                {getModalityLabel(selectedModality)}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onModalityChange("todas")} />
              </Badge>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="space-y-6">
            {/* Modality Filter */}
            <div>
              <h4 className="font-medium mb-3">Modalidad</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "todas", label: "Todas", icon: <Globe className="h-4 w-4" /> },
                  { value: "online", label: "Online", icon: <Video className="h-4 w-4" /> },
                  { value: "presencial", label: "Presencial", icon: <MapPin className="h-4 w-4" /> },
                ].map((modality) => (
                  <Button
                    key={modality.value}
                    variant={selectedModality === modality.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onModalityChange(modality.value)}
                    className="flex items-center gap-2"
                  >
                    {modality.icon}
                    {modality.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Specialties Filter */}
            <div>
              <h4 className="font-medium mb-3">Especialidades</h4>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty.id}
                    variant={selectedSpecialties.includes(specialty.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSpecialtyToggle(specialty.id)}
                  >
                    {specialty.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium mb-3">Rango de Precio</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Mínimo</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={priceRange[0]}
                      onChange={(e) => onPriceRangeChange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <span className="text-sm font-medium">${priceRange[0]}</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Máximo</label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={priceRange[1]}
                      onChange={(e) => onPriceRangeChange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <span className="text-sm font-medium">${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
