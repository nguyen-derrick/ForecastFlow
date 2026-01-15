"use client"

import { useState, useEffect, useMemo } from "react"
import { ForecastLogo } from "@/components/forecast-logo"
import { KPICard } from "@/components/kpi-card"
import { TimeFilter } from "@/components/time-filter"
import { ScenarioControls } from "@/components/scenario-controls"
import { ForecastChart } from "@/components/forecast-chart"
import { InsightsPanel } from "@/components/insights-panel"
import { RevenueMixCard } from "@/components/revenue-mix-card"
import {
  generateFullYearData,
  calculateProjectedMetrics,
  calculateErrorMetrics,
  aggregateDataByPeriod,
  type MonthlyDataPoint,
  type ErrorMetrics,
} from "@/lib/forecast-utils"

const periodOptions = [
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

const quarterOptions = [
  { value: "all", label: "All" },
  { value: "q1-2025", label: "Q1 2025" },
  { value: "q2-2025", label: "Q2 2025" },
  { value: "q3-2025", label: "Q3 2025" },
  { value: "q4-2025", label: "Q4 2025" },
  { value: "q1-2026", label: "Q1 2026" },
  { value: "q2-2026", label: "Q2 2026" },
  { value: "q3-2026", label: "Q3 2026" },
  { value: "q4-2026", label: "Q4 2026" },
]

export default function ForecastFlowPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [rawData, setRawData] = useState<MonthlyDataPoint[]>([])
  const [metrics, setMetrics] = useState<ErrorMetrics>({ mae: 0, rmse: 0, mape: 0 })

  const [period, setPeriod] = useState("monthly")
  const [quarter, setQuarter] = useState("all")
  const [growthRate, setGrowthRate] = useState(2.5)
  const [forecastHorizon, setForecastHorizon] = useState(6)

  // Load full year data on mount
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const data = generateFullYearData()
      setRawData(data)
      const errorMetrics = calculateErrorMetrics(data)
      setMetrics(errorMetrics)
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const filteredData = useMemo(() => {
    if (rawData.length === 0) return []

    let filtered = [...rawData]

    // Filter by quarter if not "all"
    if (quarter !== "all") {
      const [q, yearStr] = quarter.split("-")
      const quarterNum = q.replace("q", "")
      const year = Number.parseInt(yearStr)
      filtered = filtered.filter((d) => d.quarter === `q${quarterNum}` && d.year === year)
    }

    // Aggregate by period
    return aggregateDataByPeriod(filtered, period)
  }, [rawData, period, quarter])

  // Calculate KPI metrics based on current settings and filtered data
  const kpiMetrics = useMemo(() => {
    const dataForMetrics = quarter === "all" ? rawData : filteredData
    if (dataForMetrics.length === 0) {
      return {
        projectedRevenue: 0,
        liftVsBase: 0,
        avgMonthlyGrowth: 0,
        forecastHorizon: 6,
        totalActual: 0,
        totalForecast: 0,
      }
    }
    return calculateProjectedMetrics(dataForMetrics, growthRate, forecastHorizon)
  }, [rawData, filteredData, quarter, growthRate, forecastHorizon])

  const dateRangeSubtitle = useMemo(() => {
    if (quarter === "all") return "Jan 2025 - Dec 2026"
    const [q, yearStr] = quarter.split("-")
    const quarterNames: Record<string, string> = {
      q1: "Jan - Mar",
      q2: "Apr - Jun",
      q3: "Jul - Sep",
      q4: "Oct - Dec",
    }
    return `${quarterNames[q]} ${yearStr}`
  }, [quarter])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-8 py-5 lg:px-12 border-b border-border/30 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <ForecastLogo />
      </header>

      <main className="px-8 pb-16 lg:px-12">
        {/* Hero / About Section */}
        <section id="about" className="py-10 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl text-balance">
            Revenue Forecasting & Scenario Analysis
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            <strong className="text-foreground">The Challenge:</strong> Finance teams spend countless hours in
            spreadsheets trying to project revenue, often relying on static assumptions that fail to capture market
            dynamics. Traditional forecasting methods lack the ability to quickly model multiple scenarios, leading to
            missed opportunities and poor resource allocation.
          </p>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            <strong className="text-foreground">ForecastFlow solves this</strong> by combining exponential smoothing
            algorithms with intuitive scenario modeling. Adjust growth assumptions in real-time, visualize confidence
            intervals, and understand the lift potential of different strategies—all backed by statistical accuracy
            metrics (MAE, RMSE, MAPE) so you can trust your forecasts.
          </p>
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-8" />

        {/* Filters Section - directly under description */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <TimeFilter options={periodOptions} value={period} onChange={setPeriod} />
            <div className="w-px h-8 bg-border/50" />
            <TimeFilter options={quarterOptions} value={quarter} onChange={setQuarter} />
          </div>
        </section>

        {/* KPI Cards - 4x1 horizontal layout */}
        <section className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            label="Projected FY Revenue"
            value={`$${kpiMetrics.projectedRevenue.toLocaleString()}`}
            subtitle={dateRangeSubtitle}
          />
          <KPICard
            label="Lift vs Base Case"
            value={`+${kpiMetrics.liftVsBase.toFixed(1)}%`}
            trendColor="green"
            subtitle="Scenario improvement"
          />
          <KPICard
            label="Avg Monthly Growth"
            value={`+${kpiMetrics.avgMonthlyGrowth.toFixed(1)}%`}
            trendColor="green"
            subtitle="Based on actuals"
          />
          <KPICard label="Forecast Horizon" value={`${forecastHorizon} months`} subtitle="Projection window" />
        </section>

        {/* Analytics Dashboard Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Analytics Dashboard
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        </div>

        {/* Main Dashboard Grid */}
        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Chart - primary focus, larger */}
          <ForecastChart data={filteredData} isLoading={isLoading} growthRate={growthRate} period={period} />

          {/* Side panels */}
          <div className="space-y-6">
            <ScenarioControls
              forecastHorizon={forecastHorizon}
              onHorizonChange={setForecastHorizon}
              smoothingFactor={growthRate}
              onSmoothingChange={setGrowthRate}
            />
            <RevenueMixCard />
            <InsightsPanel metrics={metrics} />
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="mt-16 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                ForecastFlow<sup className="text-[8px]">TM</sup> by{" "}
                <span className="font-medium text-foreground">Derrick Nguyen</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Built for data-driven decision making</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://github.com/nguyen-derrick"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <span className="text-border">|</span>
              <a
                href="https://www.linkedin.com/in/nguyen-derrick/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
