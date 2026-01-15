"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, TrendingUp, TrendingDown, Activity } from "lucide-react"
import type { DataPoint } from "@/lib/forecast-utils"

interface DataSummaryCardProps {
  data: DataPoint[]
  forecastData: DataPoint[]
}

export function DataSummaryCard({ data, forecastData }: DataSummaryCardProps) {
  const actuals = data.map((d) => d.actual).filter((v): v is number => v !== null)

  const currentValue = actuals[actuals.length - 1] || 0
  const previousValue = actuals[actuals.length - 2] || currentValue
  const change = currentValue - previousValue
  const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0

  const min = Math.min(...actuals)
  const max = Math.max(...actuals)
  const avg = actuals.reduce((a, b) => a + b, 0) / actuals.length

  const lastForecast = forecastData[forecastData.length - 1]?.forecast || 0
  const forecastChange = lastForecast - currentValue
  const forecastChangePercent = currentValue !== 0 ? (forecastChange / currentValue) * 100 : 0

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
          <Database className="h-4 w-4 text-primary" aria-hidden="true" />
          Data Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Value */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Current Value</span>
            <div className={`flex items-center gap-1 text-xs ${change >= 0 ? "text-accent" : "text-destructive"}`}>
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3 w-3" aria-hidden="true" />
              )}
              <span>
                {changePercent >= 0 ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <span className="text-2xl font-semibold text-foreground">{currentValue.toLocaleString()}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <span className="block text-xs text-muted-foreground">Min</span>
            <span className="text-sm font-medium text-foreground">{min.toLocaleString()}</span>
          </div>
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <span className="block text-xs text-muted-foreground">Avg</span>
            <span className="text-sm font-medium text-foreground">{Math.round(avg).toLocaleString()}</span>
          </div>
          <div className="rounded-lg bg-secondary/30 p-2 text-center">
            <span className="block text-xs text-muted-foreground">Max</span>
            <span className="text-sm font-medium text-foreground">{max.toLocaleString()}</span>
          </div>
        </div>

        {/* Forecast End Value */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" aria-hidden="true" />
              End of Forecast
            </span>
            <span className={`text-xs ${forecastChange >= 0 ? "text-accent" : "text-destructive"}`}>
              {forecastChangePercent >= 0 ? "+" : ""}
              {forecastChangePercent.toFixed(1)}%
            </span>
          </div>
          <span className="text-xl font-semibold text-primary">{lastForecast.toLocaleString()}</span>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          {data.length} historical points • {forecastData.length} forecast points
        </div>
      </CardContent>
    </Card>
  )
}
