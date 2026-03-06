"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/format"

interface MonthlyTrendChartProps {
  data: { month: string; expenses: number; sales: number }[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    expenses: Number(item.expenses) || 0,
    sales: Number(item.sales) || 0,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tendance mensuelle</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tendance mensuelle</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: "Ventes",
              color: "hsl(var(--chart-1))",
            },
            expenses: {
              label: "Dépenses",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px] w-full"
        >
          <LineChart data={chartData} margin={{ left: 0, right: 20 }}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="font-medium mb-1">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name === "sales" ? "Ventes" : "Dépenses"}: {formatCurrency(Number(entry.value) || 0)}
                      </p>
                    ))}
                  </div>
                )
              }}
            />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expenses" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
