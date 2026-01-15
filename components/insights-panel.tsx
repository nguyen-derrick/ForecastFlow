import type { ErrorMetrics } from "@/lib/forecast-utils"

interface InsightsPanelProps {
  metrics: ErrorMetrics
}

const insights = [
  "Pipeline conversion assumed steady at 28%",
  "Marketing spend reallocated toward paid search in May",
  "APAC ramp begins in Q3 with 12% lift",
  "Customer success headcount supports churn reduction",
]

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Scenario Insights</h3>
      <ul className="space-y-3">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
            <span className="text-sm text-muted-foreground leading-relaxed">{insight}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-white/30 bg-white/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Model Accuracy</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-bold text-foreground">{metrics.mae.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">MAE</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{metrics.rmse.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">RMSE</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600">{metrics.mape.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">MAPE</p>
          </div>
        </div>
      </div>
    </div>
  )
}
