"use client"

import { useMemo } from "react"
import { Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts"
import { Loader2, TrendingUp, BarChart3 } from "lucide-react"
import type { MonthlyDataPoint } from "@/lib/forecast-utils"

interface ForecastChartProps {
  data: MonthlyDataPoint[]
  isLoading: boolean
  growthRate?: number
  period?: string
}

const COLORS = {
  actual: "#6366f1",
  forecast: "#10b981",
  base: "#94a3b8",
  confidence: "#a5b4fc",
  grid: "#e2e8f0",
  text: "#64748b",
}

export function ForecastChart({ data, isLoading, growthRate = 2.5, period = "monthly" }: ForecastChartProps) {
  const chartData = useMemo(() => {
    return data.map((point) => {
      const adjustedForecast = point.forecast ? Math.round(point.forecast * (1 + (growthRate - 2.5) / 100)) : null
      const adjustedBase =
        point.base && !point.actual ? Math.round(point.base * (1 + ((growthRate - 2.5) / 100) * 0.8)) : point.base
      const adjustedUpper = point.upperBound ? Math.round(point.upperBound * (1 + (growthRate - 2.5) / 100)) : null
      const adjustedLower = point.lowerBound ? Math.round(point.lowerBound * (1 + (growthRate - 2.5) / 100)) : null

      return {
        ...point,
        forecast: adjustedForecast,
        base: adjustedBase,
        upperBound: adjustedUpper,
        lowerBound: adjustedLower,
        displayDate: point.date,
      }
    })
  }, [data, growthRate])

  const tableData = useMemo(() => {
    return chartData.map((point) => {
      const actualValue = point.actual || 0
      const scenarioValue = point.forecast || point.actual || 0
      const baseValue = point.base || 0
      const lift = baseValue > 0 ? ((scenarioValue - baseValue) / baseValue) * 100 : 0

      return {
        month: point.date,
        actual: point.actual,
        base: baseValue,
        scenario: scenarioValue,
        lift: lift,
        isForecast: point.forecast !== null,
      }
    })
  }, [chartData])

  const periodLabel = period === "yearly" ? "Year" : period === "quarterly" ? "Quarter" : "Month"
  const dataRangeLabel = useMemo(() => {
    if (chartData.length === 0) return ""
    if (chartData.length === 1) return chartData[0].date
    return `${chartData[0].date} - ${chartData[chartData.length - 1].date}`
  }, [chartData])

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Forecast vs Actuals</h3>
        </div>
        <div className="flex h-[520px] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" aria-label="Loading chart" />
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Forecast vs Actuals</h3>
        </div>
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          No data available for the selected filters
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Forecast vs Actuals</h3>
            <p className="text-sm text-muted-foreground">
              {dataRangeLabel} ({chartData.length}{" "}
              {period === "yearly" ? "years" : period === "quarterly" ? "quarters" : "months"})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-muted-foreground">Actuals</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-slate-400" style={{ borderStyle: "dashed" }} />
            <span className="text-muted-foreground">Base</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Scenario</span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div
        className="h-[400px] w-full"
        role="img"
        aria-label="Time series forecast chart showing actual values, forecast, and confidence bands"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.actual} stopOpacity={0.25} />
                <stop offset="95%" stopColor={COLORS.actual} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.6} vertical={false} />

            <XAxis
              dataKey="displayDate"
              stroke={COLORS.text}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: COLORS.text }}
              dy={10}
              interval={period === "monthly" ? 1 : 0}
              angle={period === "monthly" && chartData.length > 12 ? -45 : 0}
              textAnchor={period === "monthly" && chartData.length > 12 ? "end" : "middle"}
            />

            <YAxis
              stroke={COLORS.text}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: COLORS.text }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={55}
              dx={-5}
              domain={["auto", "auto"]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "#1e293b", fontWeight: 600, marginBottom: 8, fontSize: 14 }}
              itemStyle={{ color: COLORS.text, fontSize: 13, padding: "2px 0" }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  actual: "Actual",
                  forecast: "Scenario",
                  base: "Base",
                  upperBound: "Upper Bound",
                  lowerBound: "Lower Bound",
                }
                return [`$${value?.toLocaleString() ?? "N/A"}`, labels[name] || name]
              }}
            />

            {/* Confidence band for forecasts */}
            <Area
              type="monotone"
              dataKey="upperBound"
              stroke="none"
              fill="url(#confidenceBand)"
              name="upperBound"
              legendType="none"
              connectNulls={false}
            />

            {/* Actual values area */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke={COLORS.actual}
              strokeWidth={2.5}
              fill="url(#actualGradient)"
              name="actual"
              connectNulls={false}
              dot={{ r: 4, fill: COLORS.actual, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: COLORS.actual, strokeWidth: 2, stroke: "#fff" }}
            />

            {/* Base case line */}
            <Line
              type="monotone"
              dataKey="base"
              stroke={COLORS.base}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="base"
              connectNulls
              dot={false}
              activeDot={{ r: 4, fill: COLORS.base }}
            />

            {/* Forecast/Scenario line */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#10b981"
              strokeWidth={2.5}
              name="forecast"
              connectNulls={false}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {periodLabel}ly Breakdown
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </div>

      {/* Data table */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
                <th className="px-4 py-3.5 text-left font-semibold text-foreground">{periodLabel}</th>
                <th className="px-4 py-3.5 text-right font-semibold text-foreground">Actual</th>
                <th className="px-4 py-3.5 text-right font-semibold text-foreground">Base</th>
                <th className="px-4 py-3.5 text-right font-semibold text-foreground">Scenario</th>
                <th className="px-4 py-3.5 text-right font-semibold text-foreground">Lift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors hover:bg-white/60 ${row.isForecast ? "bg-emerald-50/30" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {row.month}
                      {row.isForecast && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 font-semibold">
                          FORECAST
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {row.actual ? `$${row.actual.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    ${row.base.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                    ${row.scenario.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.lift >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {row.lift >= 0 ? "+" : ""}
                      {row.lift.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Table footer with totals */}
            <tfoot>
              <tr className="border-t-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 font-semibold">
                <td className="px-4 py-3.5 text-foreground">
                  Total ({tableData.length} {periodLabel.toLowerCase()}s)
                </td>
                <td className="px-4 py-3.5 text-right text-foreground tabular-nums">
                  $
                  {tableData
                    .filter((r) => r.actual)
                    .reduce((sum, r) => sum + (r.actual || 0), 0)
                    .toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right text-muted-foreground tabular-nums">
                  ${tableData.reduce((sum, r) => sum + r.base, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right text-foreground tabular-nums">
                  ${tableData.reduce((sum, r) => sum + r.scenario, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {tableData.reduce((sum, r) => sum + r.base, 0) > 0 && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600">
                      +
                      {(
                        ((tableData.reduce((sum, r) => sum + r.scenario, 0) -
                          tableData.reduce((sum, r) => sum + r.base, 0)) /
                          tableData.reduce((sum, r) => sum + r.base, 0)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
