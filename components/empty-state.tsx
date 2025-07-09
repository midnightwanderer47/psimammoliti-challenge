"use client"

import { Search, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  type: "no-results" | "no-psychologists"
  onReset?: () => void
}

export function EmptyState({ type, onReset }: EmptyStateProps) {
  if (type === "no-results") {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No encontramos psicólogos</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          No hay psicólogos que coincidan con tus criterios de búsqueda. Intenta ajustar los filtros o buscar algo
          diferente.
        </p>
        {onReset && (
          <Button onClick={onReset} variant="outline">
            Limpiar filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <UserX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay psicólogos disponibles</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Actualmente no hay psicólogos registrados en el sistema. Por favor, intenta más tarde.
      </p>
    </div>
  )
}
