const revenueData = [
  { segment: "Enterprise", percentage: 44, color: "#6366f1" },
  { segment: "Mid-market", percentage: 32, color: "#8b5cf6" },
  { segment: "Self-serve", percentage: 24, color: "#a5b4fc" },
]

export function RevenueMixCard() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-5">Revenue Mix</h3>
      <div className="space-y-4">
        {revenueData.map((item) => (
          <div key={item.segment} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.segment}</span>
              <span className="font-semibold text-foreground">{item.percentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/40">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
