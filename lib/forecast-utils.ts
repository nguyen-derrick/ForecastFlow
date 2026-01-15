// Forecast utility functions

export interface DataPoint {
  date: string
  actual: number | null
  forecast: number | null
  upperBound: number | null
  lowerBound: number | null
  month?: string
}

export interface MonthlyDataPoint {
  month: string
  date: string
  actual: number | null
  forecast: number | null
  base: number | null
  upperBound: number | null
  lowerBound: number | null
  quarter: string
  year: number
}

export interface ErrorMetrics {
  mae: number
  rmse: number
  mape: number
}

function getQuarter(monthIndex: number): string {
  if (monthIndex < 3) return "q1"
  if (monthIndex < 6) return "q2"
  if (monthIndex < 9) return "q3"
  return "q4"
}

export function generateFullYearData(): MonthlyDataPoint[] {
  const data: MonthlyDataPoint[] = []

  const monthlyRevenue = [
    // 2025 actual data (Jan - Dec)
    { month: "Jan 2025", revenue: 82000, isActual: true },
    { month: "Feb 2025", revenue: 78500, isActual: true },
    { month: "Mar 2025", revenue: 91200, isActual: true },
    { month: "Apr 2025", revenue: 88000, isActual: true },
    { month: "May 2025", revenue: 95000, isActual: true },
    { month: "Jun 2025", revenue: 102500, isActual: true },
    { month: "Jul 2025", revenue: 94200, isActual: true },
    { month: "Aug 2025", revenue: 89800, isActual: true },
    { month: "Sep 2025", revenue: 108000, isActual: true },
    { month: "Oct 2025", revenue: 115500, isActual: true },
    { month: "Nov 2025", revenue: 121000, isActual: true },
    { month: "Dec 2025", revenue: 134000, isActual: true },
    // 2026 forecast data (Jan - Dec) - extended through Q4
    { month: "Jan 2026", revenue: 128000, isActual: false },
    { month: "Feb 2026", revenue: 125000, isActual: false },
    { month: "Mar 2026", revenue: 142000, isActual: false },
    { month: "Apr 2026", revenue: 138500, isActual: false },
    { month: "May 2026", revenue: 148000, isActual: false },
    { month: "Jun 2026", revenue: 162000, isActual: false },
    { month: "Jul 2026", revenue: 155000, isActual: false },
    { month: "Aug 2026", revenue: 151000, isActual: false },
    { month: "Sep 2026", revenue: 172000, isActual: false },
    { month: "Oct 2026", revenue: 185000, isActual: false },
    { month: "Nov 2026", revenue: 195000, isActual: false },
    { month: "Dec 2026", revenue: 218000, isActual: false },
  ]

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const baseMultiplier = 0.92

  monthlyRevenue.forEach((item, index) => {
    const [monthStr, yearStr] = item.month.split(" ")
    const year = Number.parseInt(yearStr)
    const monthIndex = monthNames.indexOf(monthStr)
    const quarter = getQuarter(monthIndex)

    const baseValue = item.isActual ? item.revenue * 0.95 : item.revenue * baseMultiplier
    const forecastIndex = item.isActual ? 0 : index - 11
    const uncertainty = item.isActual ? 0 : forecastIndex * 0.025
    const upperBound = item.isActual ? null : Math.round(item.revenue * (1 + 0.08 + uncertainty))
    const lowerBound = item.isActual ? null : Math.round(item.revenue * (1 - 0.05 - uncertainty))

    data.push({
      month: monthStr,
      date: item.month,
      actual: item.isActual ? item.revenue : null,
      forecast: item.isActual ? null : item.revenue,
      base: Math.round(baseValue),
      upperBound,
      lowerBound,
      quarter,
      year,
    })
  })

  return data
}

export function filterDataByPeriodAndQuarter(
  data: MonthlyDataPoint[],
  period: string,
  quarter: string,
): MonthlyDataPoint[] {
  let filtered = [...data]

  // Filter by quarter if not "all"
  if (quarter !== "all") {
    const quarterYear = quarter.includes("2025") ? 2025 : 2026
    const quarterNum = quarter.replace(/[^0-9]/g, "").charAt(0)
    const quarterKey = `q${quarterNum}`

    filtered = filtered.filter((d) => d.quarter === quarterKey && d.year === quarterYear)
  }

  // For yearly view, aggregate to quarters (simplified - just return all)
  // For quarterly view, return the specific quarter
  // For monthly view, return monthly data
  return filtered
}

export function aggregateDataByPeriod(data: MonthlyDataPoint[], period: string): MonthlyDataPoint[] {
  if (period === "monthly") return data

  if (period === "quarterly") {
    const quarters: Record<string, MonthlyDataPoint> = {}

    data.forEach((d) => {
      const key = `${d.quarter.toUpperCase()} ${d.year}`
      if (!quarters[key]) {
        quarters[key] = {
          month: d.quarter.toUpperCase(),
          date: key,
          actual: 0,
          forecast: 0,
          base: 0,
          upperBound: null,
          lowerBound: null,
          quarter: d.quarter,
          year: d.year,
        }
      }
      quarters[key].actual = (quarters[key].actual || 0) + (d.actual || 0)
      quarters[key].forecast = (quarters[key].forecast || 0) + (d.forecast || 0)
      quarters[key].base = (quarters[key].base || 0) + (d.base || 0)
    })

    return Object.values(quarters).map((q) => ({
      ...q,
      actual: q.actual === 0 ? null : q.actual,
      forecast: q.forecast === 0 ? null : q.forecast,
    }))
  }

  if (period === "yearly") {
    const years: Record<number, MonthlyDataPoint> = {}

    data.forEach((d) => {
      if (!years[d.year]) {
        years[d.year] = {
          month: d.year.toString(),
          date: d.year.toString(),
          actual: 0,
          forecast: 0,
          base: 0,
          upperBound: null,
          lowerBound: null,
          quarter: "all",
          year: d.year,
        }
      }
      years[d.year].actual = (years[d.year].actual || 0) + (d.actual || 0)
      years[d.year].forecast = (years[d.year].forecast || 0) + (d.forecast || 0)
      years[d.year].base = (years[d.year].base || 0) + (d.base || 0)
    })

    return Object.values(years).map((y) => ({
      ...y,
      actual: y.actual === 0 ? null : y.actual,
      forecast: y.forecast === 0 ? null : y.forecast,
    }))
  }

  return data
}

export function calculateProjectedMetrics(data: MonthlyDataPoint[], growthRate: number, forecastHorizon: number) {
  const actuals = data.filter((d) => d.actual !== null)
  const forecasts = data.filter((d) => d.forecast !== null)

  const adjustedForecasts = forecasts.map((f, idx) => ({
    ...f,
    forecast: f.forecast ? Math.round(f.forecast * (1 + (growthRate - 2.5) / 100)) : null,
    base: f.base ? Math.round(f.base * (1 + ((growthRate - 2.5) / 100) * 0.8)) : null,
  }))

  const totalActual = actuals.reduce((sum, d) => sum + (d.actual || 0), 0)
  const totalForecast = adjustedForecasts.reduce((sum, d) => sum + (d.forecast || 0), 0)
  const totalBase = adjustedForecasts.reduce((sum, d) => sum + (d.base || 0), 0)

  const projectedRevenue = totalActual + totalForecast
  const baseRevenue = totalActual + totalBase
  const liftVsBase = baseRevenue > 0 ? ((projectedRevenue - baseRevenue) / baseRevenue) * 100 : 0

  let totalGrowth = 0
  for (let i = 1; i < actuals.length; i++) {
    const prev = actuals[i - 1].actual || 1
    const curr = actuals[i].actual || 0
    totalGrowth += ((curr - prev) / prev) * 100
  }
  const avgMonthlyGrowth = actuals.length > 1 ? totalGrowth / (actuals.length - 1) : 0

  return {
    projectedRevenue,
    liftVsBase: Math.round(liftVsBase * 10) / 10,
    avgMonthlyGrowth: Math.round(avgMonthlyGrowth * 10) / 10,
    forecastHorizon,
    totalActual,
    totalForecast,
  }
}

// Generate sample time series data (daily - kept for compatibility)
export function generateSampleData(days = 90): DataPoint[] {
  const data: DataPoint[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const baseValue = 1000
  const trend = 2.5
  const seasonalAmplitude = 150

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    const seasonal = Math.sin((i / 7) * Math.PI * 2) * seasonalAmplitude
    const noise = (Math.random() - 0.5) * 100
    const actual = baseValue + trend * i + seasonal + noise

    data.push({
      date: date.toISOString().split("T")[0],
      actual: Math.round(actual * 100) / 100,
      forecast: null,
      upperBound: null,
      lowerBound: null,
    })
  }

  return data
}

// Simple exponential smoothing forecast
export function generateForecast(historicalData: DataPoint[], horizonDays = 14, alpha = 0.3): DataPoint[] {
  const actuals = historicalData.map((d) => d.actual).filter((v): v is number => v !== null)

  if (actuals.length === 0) return []

  let smoothed = actuals[0]
  const smoothedValues: number[] = [smoothed]

  for (let i = 1; i < actuals.length; i++) {
    smoothed = alpha * actuals[i] + (1 - alpha) * smoothed
    smoothedValues.push(smoothed)
  }

  const errors = actuals.map((actual, i) => actual - smoothedValues[i])
  const mse = errors.reduce((sum, e) => sum + e * e, 0) / errors.length
  const standardError = Math.sqrt(mse)

  const lastDate = new Date(historicalData[historicalData.length - 1].date)
  const lastSmoothed = smoothedValues[smoothedValues.length - 1]

  const recentPeriod = Math.min(14, smoothedValues.length)
  const recentValues = smoothedValues.slice(-recentPeriod)
  const trend = (recentValues[recentValues.length - 1] - recentValues[0]) / recentPeriod

  const forecastData: DataPoint[] = []

  for (let i = 1; i <= horizonDays; i++) {
    const forecastDate = new Date(lastDate)
    forecastDate.setDate(forecastDate.getDate() + i)

    const forecastValue = lastSmoothed + trend * i
    const confidenceMultiplier = 1.96 * Math.sqrt(i)
    const margin = standardError * confidenceMultiplier

    forecastData.push({
      date: forecastDate.toISOString().split("T")[0],
      actual: null,
      forecast: Math.round(forecastValue * 100) / 100,
      upperBound: Math.round((forecastValue + margin) * 100) / 100,
      lowerBound: Math.round((forecastValue - margin) * 100) / 100,
    })
  }

  return forecastData
}

// Calculate error metrics
export function calculateErrorMetrics(data: MonthlyDataPoint[]): ErrorMetrics {
  const actuals = data.filter((d) => d.actual !== null && d.base !== null)

  if (actuals.length < 3) {
    return { mae: 45.2, rmse: 52.8, mape: 3.2 }
  }

  const errors: number[] = []
  const percentErrors: number[] = []

  actuals.forEach((point) => {
    if (point.actual && point.base) {
      const error = point.actual - point.base
      errors.push(error)
      percentErrors.push(Math.abs(error / point.actual) * 100)
    }
  })

  const mae = errors.reduce((sum, e) => sum + Math.abs(e), 0) / errors.length
  const mse = errors.reduce((sum, e) => sum + e * e, 0) / errors.length
  const rmse = Math.sqrt(mse)
  const mape = percentErrors.reduce((sum, e) => sum + e, 0) / percentErrors.length

  return {
    mae: Math.round(mae) / 100,
    rmse: Math.round(rmse) / 100,
    mape: Math.round(mape * 10) / 10,
  }
}

// Filter data by time frame
export function filterDataByTimeFrame(data: DataPoint[], timeFrame: "7d" | "14d" | "30d" | "90d" | "all"): DataPoint[] {
  if (timeFrame === "all") return data

  const days = Number.parseInt(timeFrame)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return data.filter((d) => new Date(d.date) >= cutoffDate)
}
