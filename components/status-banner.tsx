"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw, Info } from "lucide-react"

interface StatusBannerProps {
  type: "demo" | "error" | "success" | "info"
  message: string
  onRetry?: () => void
  showRetry?: boolean
}

export function StatusBanner({ type, message, onRetry, showRetry = false }: StatusBannerProps) {
  const styles = {
    demo: {
      bg: "bg-muted",
      border: "border-border",
      text: "text-foreground",
      icon: <Info className="h-4 w-4" />,
    },
    error: {
      bg: "bg-destructive/10",
      border: "border-destructive/20",
      text: "text-destructive",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    info: {
      bg: "bg-muted",
      border: "border-border",
      text: "text-foreground",
      icon: <Info className="h-4 w-4" />,
    },
  }

  const style = styles[type]

  return (
    <div className={`mb-6 p-4 rounded-lg border ${style.bg} ${style.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {style.icon}
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
        </div>
        {showRetry && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4 h-8 px-3 text-xs bg-transparent">
            <RefreshCw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        )}
      </div>
    </div>
  )
}
