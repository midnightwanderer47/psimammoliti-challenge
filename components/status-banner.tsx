"use client"

import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface StatusBannerProps {
  type: "demo" | "error" | "success" | "info"
  message: string
  onRetry?: () => void
  showRetry?: boolean
}

export function StatusBanner({ type, message, onRetry, showRetry = false }: StatusBannerProps) {
  const getIcon = () => {
    switch (type) {
      case "demo":
        return <Info className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "info":
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = () => {
    switch (type) {
      case "error":
        return "destructive"
      case "success":
        return "default"
      case "demo":
      case "info":
      default:
        return "default"
    }
  }

  return (
    <Alert variant={getVariant()} className="mb-6">
      {getIcon()}
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {showRetry && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 h-8 bg-transparent">
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
