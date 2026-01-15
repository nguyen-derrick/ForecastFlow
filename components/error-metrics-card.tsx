"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart3, Info } from "lucide-react"
import type { ErrorMetrics } from "@/lib/forecast-utils"

interface ErrorMetricsCardProps {
  metrics: ErrorMetrics
  isLoading: boolean
}

function MetricItem({
  label,
  value,
  unit,
  description,
  quality,
}: {
  label: string
  value: number
  unit: string
  description: string
  quality: "good" | "moderate" | "poor"
}) {
  const qualityColors = {
    good: "bg-accent/20 text-accent border-accent/30",
    moderate: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    poor: "bg-destructive/20 text-destructive border-destructive/30",
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-secondary/50 p-3">
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex cursor-help items-center gap-1 text-xs text-muted-foreground">
                {label}
                <Info className="h-3 w-3" aria-hidden="true" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge variant="outline" className={`text-xs ${qualityColors[quality]}`}>
          {quality}
        </Badge>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-foreground">{value.toLocaleString()}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  )
}

export function ErrorMetricsCard({ metrics, isLoading }: ErrorMetricsCardProps) {
  // Determine quality based on metric values
  const getMAEQuality = (mae: number): "good" | "moderate" | "poor" => {
    if (mae < 50) return "good"
    if (mae < 100) return "moderate"
    return "poor"
  }

  const getRMSEQuality = (rmse: number): "good" | "moderate" | "poor" => {
    if (rmse < 75) return "good"
    if (rmse < 150) return "moderate"
    return "poor"
  }

  const getMAPEQuality = (mape: number): "good" | "moderate" | "poor" => {
    if (mape < 10) return "good"
    if (mape < 20) return "moderate"
    return "poor"
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
          <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
          Error Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-3">
            <MetricItem
              label="MAE"
              value={metrics.mae}
              unit=""
              description="Mean Absolute Error: Average absolute difference between actual and predicted values. Lower is better."
              quality={getMAEQuality(metrics.mae)}
            />
            <MetricItem
              label="RMSE"
              value={metrics.rmse}
              unit=""
              description="Root Mean Square Error: Penalizes larger errors more heavily. Lower is better."
              quality={getRMSEQuality(metrics.rmse)}
            />
            <MetricItem
              label="MAPE"
              value={metrics.mape}
              unit="%"
              description="Mean Absolute Percentage Error: Error as a percentage of actual values. Lower is better."
              quality={getMAPEQuality(metrics.mape)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
