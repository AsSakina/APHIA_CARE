"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/format"

const expenseTypeLabels: Record<string, string> = {
  MEDICATION_PURCHASE: "Achats",
  RENT: "Loyer",
  SALARY: "Salaires",
  ELECTRICITY: "Électricité",
  WATER: "Eau",
  INTERNET: "Internet",
  PHONE: "Téléphone",
  MAINTENANCE: "Maintenance",
  CLEANING: "Nettoyage",
  TRANSPORT: "Transport",
  OFFICE_SUPPLIES: "Fournitures",
  BANK_FEES: "Frais bancaires",
  TAXES: "Taxes",
  INSURANCE: "Assurance",
  MARKETING: "Marketing",
  TRAINING: "Formation",
  OTHER: "Autres",
}

interface ExpensesByTypeChartProps {
  data: { expense_type: string; total: number }[]
}

export function ExpensesByTypeChart({ data }: ExpensesByTypeChartProps) {
  const chartData = data.map((item) => ({
    type: expenseTypeLabels[item.expense_type] || item.expense_type,
    total: Number(item.total) || 0,
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dépenses par type</CardTitle>
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
        <CardTitle className="text-lg">Dépenses par type</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            total: {
              label: "Montant",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] w-full"
        >
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="type" width={80} tick={{ fontSize: 12 }} />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="font-medium">{data.payload?.type}</p>
                    <p className="text-muted-foreground">{formatCurrency(Number(data.value) || 0)}</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
