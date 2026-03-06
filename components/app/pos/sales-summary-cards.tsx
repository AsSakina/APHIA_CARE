"use client"

import { ShoppingCart, Wallet, TrendingUp, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"

interface SalesSummaryCardsProps {
  summary: {
    sales_today: number
    sales_this_month: number
    revenue_today: number
    revenue_this_month: number
    collected_today: number
    collected_this_month: number
    discounts_this_month: number
    ipm_coverage_this_month: number
  } | null
}

export function SalesSummaryCards({ summary }: SalesSummaryCardsProps) {
  if (!summary) return null

  const cards = [
    {
      title: "Ventes aujourd'hui",
      value: summary.sales_today,
      subvalue: formatCurrency(summary.revenue_today),
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Encaissé aujourd'hui",
      value: formatCurrency(summary.collected_today),
      subvalue: `${summary.sales_today} ventes`,
      icon: Wallet,
      color: "text-green-600",
    },
    {
      title: "CA du mois",
      value: formatCurrency(summary.revenue_this_month),
      subvalue: `${summary.sales_this_month} ventes`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Prise en charge IPM",
      value: formatCurrency(summary.ipm_coverage_this_month),
      subvalue: "Ce mois",
      icon: Building2,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`size-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subvalue}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
