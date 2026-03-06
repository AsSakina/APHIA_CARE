"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/format"
import { getIpmReceivables, getTotalIpmReceivables } from "@/lib/mock-data"
import { AlertCircle, Check, Clock } from "lucide-react"

export function IpmReceivables() {
  const receivables = getIpmReceivables()
  const totalBalance = getTotalIpmReceivables()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check className="h-4 w-4 text-green-600" />
      case "partial":
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: "Payée",
      partial: "Partielle",
      pending: "En attente",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "partial":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Créances IPM totales</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalBalance)}</p>
            <p className="text-sm text-muted-foreground mt-2">{receivables.length} mutuelles</p>
          </div>
        </CardContent>
      </Card>

      {/* Receivables List */}
      {receivables.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucune créance IPM pour le moment.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {receivables.map((receivable) => (
            <Card key={receivable.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{receivable.ipm_name}</CardTitle>
                    <CardDescription>{receivable.sale_ids.length} vente(s)</CardDescription>
                  </div>
                  <Badge className={getStatusColor(receivable.status)}>
                    {getStatusIcon(receivable.status)}
                    <span className="ml-2">{getStatusLabel(receivable.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Montant facturé</p>
                    <p className="text-2xl font-bold">{formatCurrency(receivable.amount_due)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Montant payé</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(receivable.amount_paid)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Solde à recevoir</p>
                    <p className={`text-2xl font-bold ${receivable.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(receivable.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taux de paiement</p>
                    <p className="text-2xl font-bold">
                      {receivable.amount_due > 0
                        ? `${Math.round((receivable.amount_paid / receivable.amount_due) * 100)}%`
                        : "0%"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
