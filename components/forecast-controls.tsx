"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, TrendingUp, Sliders } from "lucide-react"

interface ForecastControlsProps {
  timeFrame: string
  onTimeFrameChange: (value: string) => void
  forecastHorizon: number
  onHorizonChange: (value: number) => void
  smoothingFactor: number
  onSmoothingChange: (value: number) => void
}

export function ForecastControls({
  timeFrame,
  onTimeFrameChange,
  forecastHorizon,
  onHorizonChange,
  smoothingFactor,
  onSmoothingChange,
}: ForecastControlsProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
          <Sliders className="h-4 w-4 text-primary" aria-hidden="true" />
          Forecast Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Frame Selection */}
        <div className="space-y-2">
          <Label htmlFor="timeframe-select" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            Historical Data Range
          </Label>
          <Select value={timeFrame} onValueChange={onTimeFrameChange}>
            <SelectTrigger id="timeframe-select" className="bg-secondary border-border">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All data</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Forecast Horizon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="horizon-slider" className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Forecast Horizon
            </Label>
            <span className="text-sm font-medium text-foreground">{forecastHorizon} days</span>
          </div>
          <Slider
            id="horizon-slider"
            min={7}
            max={60}
            step={1}
            value={[forecastHorizon]}
            onValueChange={([value]) => onHorizonChange(value)}
            className="w-full"
            aria-label={`Forecast horizon: ${forecastHorizon} days`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>7 days</span>
            <span>60 days</span>
          </div>
        </div>

        {/* Smoothing Factor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="smoothing-slider" className="text-sm text-muted-foreground">
              Smoothing Factor (α)
            </Label>
            <span className="font-mono text-sm font-medium text-foreground">{smoothingFactor.toFixed(2)}</span>
          </div>
          <Slider
            id="smoothing-slider"
            min={0.1}
            max={0.9}
            step={0.05}
            value={[smoothingFactor]}
            onValueChange={([value]) => onSmoothingChange(value)}
            className="w-full"
            aria-label={`Smoothing factor: ${smoothingFactor.toFixed(2)}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More smooth</span>
            <span>More reactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
