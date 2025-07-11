"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Zap, Clock } from "lucide-react"
import type { Specialty } from "@/lib/supabase"

interface FilterSectionProps {
  specialties: Specialty[]
  selectedSpecialty: string
  onSpecialtyChange: (specialty: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedModality: string
  onModalityChange: (modality: string) => void
  selectedAvailability?: string
  onAvailabilityChange?: (availability: string) => void
  resultCount: number
}

export function FilterSection({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
  searchQuery,
  onSearchChange,
  selectedModality,
  onModalityChange,
  selectedAvailability = "Todas",
  onAvailabilityChange,
  resultCount,
}: FilterSectionProps) {
  const hasActiveFilters = selectedSpecialty !== "Todas" || selectedModality !== "Todas" || searchQuery.trim() !== ""

  const resetFilters = () => {
    onSpecialtyChange("Todas")
    onModalityChange("Todas")
    onSearchChange("")
    if (onAvailabilityChange) {
      onAvailabilityChange("Todas")
    }
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedAvailability === "inmediata" ? "default" : "outline"}
          size="sm"
          onClick={() => onAvailabilityChange?.("inmediata")}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Disponible hoy/mañana
        </Button>
        <Button
          variant={selectedModality === "online" ? "default" : "outline"}
          size="sm"
          onClick={() => onModalityChange(selectedModality === "online" ? "Todas" : "online")}
        >
          Solo Online
        </Button>
        <Button
          variant={selectedModality === "presencial" ? "default" : "outline"}
          size="sm"
          onClick={() => onModalityChange(selectedModality === "presencial" ? "Todas" : "presencial")}
        >
          Solo Presencial
        </Button>
      </div>

      {/* Main Filters */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o especialidad..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Specialty Filter */}
          <Select value={selectedSpecialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las especialidades" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Modality Filter */}
          <Select value={selectedModality} onValueChange={onModalityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las modalidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas las modalidades</SelectItem>
              <SelectItem value="online">Solo Online</SelectItem>
              <SelectItem value="presencial">Solo Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {selectedSpecialty !== "Todas" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedSpecialty}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onSpecialtyChange("Todas")} />
              </Badge>
            )}
            {selectedModality !== "Todas" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedModality === "online" ? "Online" : "Presencial"}
                <X className="h-3 w-3 cursor-pointer" onClick={() => onModalityChange("Todas")} />
              </Badge>
            )}
            {searchQuery.trim() && (
              <Badge variant="secondary" className="flex items-center gap-1">
                "{searchQuery}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resultCount === 0 ? (
            "No se encontraron psicólogos"
          ) : (
            <>
              Mostrando <span className="font-semibold">{resultCount}</span> psicólogo{resultCount !== 1 ? "s" : ""}
              {hasActiveFilters && " que coinciden con tus filtros"}
            </>
          )}
        </p>

        {resultCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Horarios en tu zona horaria</span>
          </div>
        )}
      </div>
    </div>
  )
}
