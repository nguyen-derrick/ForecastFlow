"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"

interface ScenarioControlsProps {
  forecastHorizon: number
  onHorizonChange: (value: number) => void
  smoothingFactor: number // This is now growthRate (%)
  onSmoothingChange: (value: number) => void
}

export function ScenarioControls({
  forecastHorizon,
  onHorizonChange,
  smoothingFactor: growthRate,
  onSmoothingChange: onGrowthChange,
}: ScenarioControlsProps) {
  const extraFundedGrowth = (growthRate * 0.4).toFixed(1)
  const marketingSpend = Math.round(growthRate * 6)
  const elasticity = (1 + growthRate / 10).toFixed(1)

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Scenario Controls</h3>
      </div>

      {/* Metrics display */}
      <div className="space-y-1 rounded-xl overflow-hidden border border-border/30">
        <div className="flex items-center justify-between bg-white/40 px-5 py-3.5 border-b border-border/20">
          <span className="text-sm text-muted-foreground">Base growth per month</span>
          <span className="font-semibold text-emerald-600">+{growthRate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between bg-white/40 px-5 py-3.5 border-b border-border/20">
          <span className="text-sm text-muted-foreground">Extra funded growth</span>
          <span className="font-semibold text-emerald-600">+{extraFundedGrowth}%</span>
        </div>
        <div className="flex items-center justify-between bg-white/40 px-5 py-3.5 border-b border-border/20">
          <span className="text-sm text-muted-foreground">Marketing spend change</span>
          <span className="font-semibold text-emerald-600">+{marketingSpend}%</span>
        </div>
        <div className="flex items-center justify-between bg-white/40 px-5 py-3.5">
          <span className="text-sm text-muted-foreground">Elasticity</span>
          <span className="font-semibold text-foreground">{elasticity}x</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-5 pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="horizon-slider" className="text-sm text-muted-foreground">
              Forecast Horizon
            </Label>
            <span className="text-sm font-semibold text-foreground">{forecastHorizon} months</span>
          </div>
          <Slider
            id="horizon-slider"
            min={3}
            max={12}
            step={1}
            value={[forecastHorizon]}
            onValueChange={([value]) => onHorizonChange(value)}
            className="w-full"
            aria-label={`Forecast horizon: ${forecastHorizon} months`}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>3 mo</span>
            <span>12 mo</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="growth-slider" className="text-sm text-muted-foreground">
              Growth Rate Assumption
            </Label>
            <span className="font-mono text-sm font-semibold text-foreground">{growthRate.toFixed(1)}%</span>
          </div>
          <Slider
            id="growth-slider"
            min={0.5}
            max={5}
            step={0.1}
            value={[growthRate]}
            onValueChange={([value]) => onGrowthChange(value)}
            className="w-full"
            aria-label={`Growth rate: ${growthRate.toFixed(1)}%`}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Conservative (0.5%)</span>
            <span>Aggressive (5%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
