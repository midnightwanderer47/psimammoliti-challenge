"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Calendar, Users, TrendingUp, Loader2, ArrowLeft, Download, RefreshCw } from "lucide-react"
import { getAnalytics } from "@/lib/database"
import type { AnalyticsData } from "@/lib/supabase"
import Link from "next/link"
import { StatusBanner } from "@/components/status-banner"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
      setAnalytics({
        most_consulted_topics: [
          { tematica: "Depresión", total_sesiones: 8, porcentaje: 32.0 },
          { tematica: "Fobias", total_sesiones: 6, porcentaje: 24.0 },
          { tematica: "Ansiedad Social", total_sesiones: 4, porcentaje: 16.0 },
        ],
        busiest_days: [
          { dia_semana: "Martes", total_sesiones: 6, porcentaje: 24.0 },
          { dia_semana: "Miércoles", total_sesiones: 5, porcentaje: 20.0 },
          { dia_semana: "Lunes", total_sesiones: 4, porcentaje: 16.0 },
        ],
        popular_modalities: [
          { modalidad: "online", total_sesiones: 18, porcentaje: 72.0, precio_promedio: 78.5 },
          { modalidad: "telefonica", total_sesiones: 4, porcentaje: 16.0, precio_promedio: 75.0 },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-4 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-lg text-muted-foreground">Análisis detallado de las sesiones psicológicas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <StatusBanner
          type="demo"
          message="Analytics Demo: Mostrando datos de ejemplo. Una vez configurada la base de datos, verás datos reales de las sesiones."
        />

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Sesiones</p>
                  <p className="text-3xl font-bold">
                    {analytics?.most_consulted_topics.reduce((acc, topic) => acc + topic.total_sesiones, 0) || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Especialidades Activas</p>
                  <p className="text-3xl font-bold">{analytics?.most_consulted_topics.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Modalidades</p>
                  <p className="text-3xl font-bold">{analytics?.popular_modalities.length || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Temáticas Más Consultadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-muted rounded-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                Temáticas Más Consultadas
              </CardTitle>
              <CardDescription>¿Qué temática es más consultada?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.most_consulted_topics.map((topic, index) => (
                  <div key={topic.tematica} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium">{topic.tematica}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{topic.total_sesiones}</div>
                        <div className="text-xs text-muted-foreground">{topic.porcentaje}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? "bg-foreground" : "bg-muted-foreground"}`}
                        style={{ width: `${topic.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Días Más Ocupados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                Días Más Ocupados
              </CardTitle>
              <CardDescription>¿Qué día tiene más sesiones?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.busiest_days.map((day, index) => (
                  <div key={day.dia_semana} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium">{day.dia_semana}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{day.total_sesiones}</div>
                        <div className="text-xs text-muted-foreground">{day.porcentaje}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? "bg-foreground" : "bg-muted-foreground"}`}
                        style={{ width: `${day.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Modalidades Más Populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-muted rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                Modalidades Populares
              </CardTitle>
              <CardDescription>¿Qué modalidad es más usada?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.popular_modalities.map((modality, index) => (
                  <div key={modality.modalidad} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <span className="font-medium capitalize">{modality.modalidad}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{modality.total_sesiones}</div>
                        <div className="text-xs text-muted-foreground">{modality.porcentaje}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? "bg-foreground" : "bg-muted-foreground"}`}
                        style={{ width: `${modality.porcentaje}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Precio promedio: ${modality.precio_promedio} USD
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-muted rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              Resumen Ejecutivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 bg-muted rounded-xl">
                <h3 className="font-semibold mb-2">Temática Líder</h3>
                <p className="text-3xl font-bold mb-1">{analytics?.most_consulted_topics[0]?.tematica || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics?.most_consulted_topics[0]?.porcentaje}% de las consultas
                </p>
              </div>

              <div className="text-center p-6 bg-muted rounded-xl">
                <h3 className="font-semibold mb-2">Día Más Activo</h3>
                <p className="text-3xl font-bold mb-1">{analytics?.busiest_days[0]?.dia_semana || "N/A"}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics?.busiest_days[0]?.porcentaje}% de las sesiones
                </p>
              </div>

              <div className="text-center p-6 bg-muted rounded-xl">
                <h3 className="font-semibold mb-2">Modalidad Preferida</h3>
                <p className="text-3xl font-bold mb-1 capitalize">
                  {analytics?.popular_modalities[0]?.modalidad || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {analytics?.popular_modalities[0]?.porcentaje}% de preferencia
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
