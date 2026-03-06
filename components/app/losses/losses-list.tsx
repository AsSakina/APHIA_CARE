import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockLosses } from "@/lib/mock-data"
import type { FinancialLoss } from "@/lib/types"

const reasonLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ENTRY_ERROR: { label: "Erreur de saisie", variant: "outline" },
  EXPIRED: { label: "Périmé", variant: "destructive" },
  DAMAGED: { label: "Endommagé", variant: "destructive" },
  THEFT: { label: "Vol", variant: "destructive" },
  UNRECORDED_EXIT: { label: "Sortie non enregistrée", variant: "secondary" },
  INVENTORY_CORRECTION: { label: "Correction inventaire", variant: "outline" },
  OTHER: { label: "Autre", variant: "outline" },
}

function getLosses(): FinancialLoss[] {
  return mockLosses
}

export async function LossesList() {
  const losses = getLosses()

  if (losses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucune perte enregistrée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historique des pertes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Produit</th>
                <th className="text-center py-3 font-medium">Raison</th>
                <th className="text-right py-3 font-medium">Quantité</th>
                <th className="text-right py-3 font-medium">Coût unitaire</th>
                <th className="text-right py-3 font-medium">Perte totale</th>
              </tr>
            </thead>
            <tbody>
              {losses.map((loss) => {
                const reason = reasonLabels[loss.adjustment_reason] || {
                  label: loss.adjustment_reason,
                  variant: "outline" as const,
                }
                return (
                  <tr key={loss.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3">{formatDate(loss.loss_date)}</td>
                    <td className="py-3">{loss.product_name || "-"}</td>
                    <td className="py-3 text-center">
                      <Badge variant={reason.variant}>{reason.label}</Badge>
                    </td>
                    <td className="py-3 text-right">{loss.quantity}</td>
                    <td className="py-3 text-right text-muted-foreground">{formatCurrency(Number(loss.unit_cost))}</td>
                    <td className="py-3 text-right font-medium text-destructive">
                      {formatCurrency(Number(loss.total_loss))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
