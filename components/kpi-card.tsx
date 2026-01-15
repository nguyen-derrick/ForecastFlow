interface KPICardProps {
  label: string
  value: string
  subtitle?: string
  trend?: string
  trendColor?: "green" | "red" | "default"
}

export function KPICard({ label, value, subtitle, trend, trendColor = "default" }: KPICardProps) {
  const trendColorClass = {
    green: "text-emerald-600",
    red: "text-red-500",
    default: "text-foreground",
  }[trendColor]

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-200">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${trendColorClass}`}>{value}</p>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      {trend && <p className={`mt-1 text-sm font-medium ${trendColorClass}`}>{trend}</p>}
    </div>
  )
}
