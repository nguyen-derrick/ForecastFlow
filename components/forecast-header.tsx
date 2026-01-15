"use client"

import { ForecastLogo } from "./forecast-logo"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ForecastHeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export function ForecastHeader({ onRefresh, isLoading }: ForecastHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <ForecastLogo />

      <nav className="flex items-center gap-2" aria-label="Main actions">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRefresh}
                disabled={isLoading}
                aria-label="Refresh forecast data"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh data</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Help">
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </header>
  )
}
