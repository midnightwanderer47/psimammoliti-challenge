"use client"

import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, X, Video, MapPin } from "lucide-react"
import type { Specialty } from "@/lib/supabase"

interface FilterSectionProps {
  specialties: Specialty[]
  selectedSpecialty: string
  onSpecialtyChange: (specialty: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedModality: string
  onModalityChange: (modality: string) => void
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
  resultCount,
}: FilterSectionProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
            <CardDescription>Encuentra el psicólogo ideal para ti</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o especialidad..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              name="search"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Specialty Filter */}
          <Select value={selectedSpecialty} onValueChange={onSpecialtyChange}>
            <SelectTrigger name="specialty">
              <SelectValue placeholder="Selecciona una especialidad" />
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
            <SelectTrigger name="modality">
              <SelectValue placeholder="Modalidad de sesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas las modalidades</SelectItem>
              <SelectItem value="online">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Online
                </div>
              </SelectItem>
              <SelectItem value="presencial">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Presencial
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {selectedSpecialty !== "Todas" && (
            <Badge data-testid="active-filter" variant="secondary">
              {selectedSpecialty}
              <button onClick={() => onSpecialtyChange("Todas")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedModality !== "Todas" && (
            <Badge data-testid="active-filter" variant="secondary">
              <div className="flex items-center gap-1">
                {selectedModality === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                {selectedModality === "online" ? "Online" : "Presencial"}
              </div>
              <button onClick={() => onModalityChange("Todas")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge data-testid="active-filter" variant="secondary">
              "{searchQuery}"
              <button onClick={() => onSearchChange("")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <span data-testid="results-count" className="text-sm text-muted-foreground ml-auto">
            {resultCount} psicólogo{resultCount !== 1 ? "s" : ""} encontrado{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
