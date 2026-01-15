"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, TableIcon } from "lucide-react"
import type { DataPoint } from "@/lib/forecast-utils"

interface ActualVsForecastTableProps {
  forecastData: DataPoint[]
}

export function ActualVsForecastTable({ forecastData }: ActualVsForecastTableProps) {
  const [page, setPage] = useState(0)
  const pageSize = 7
  const totalPages = Math.ceil(forecastData.length / pageSize)

  const paginatedData = forecastData.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
          <TableIcon className="h-4 w-4 text-primary" aria-hidden="true" />
          Forecast Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-right text-muted-foreground">Forecast</TableHead>
                <TableHead className="text-right text-muted-foreground">Lower</TableHead>
                <TableHead className="text-right text-muted-foreground">Upper</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((point) => (
                <TableRow key={point.date} className="border-border">
                  <TableCell className="font-medium text-foreground">
                    {new Date(point.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {point.forecast?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {point.lowerBound?.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {point.upperBound?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
