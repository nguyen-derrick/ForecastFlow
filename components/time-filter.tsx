"use client"

import { cn } from "@/lib/utils"

interface TimeFilterProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimeFilter({ options, value, onChange, className }: TimeFilterProps) {
  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-full bg-white/50 p-1 backdrop-blur-sm", className)}
      role="group"
      aria-label="Time filter"
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            value === option.value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
