import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react"
import { mockProducts, mockStockQuantities, getStockEntries, getStockLosses } from "@/lib/mock-data"

interface StockMovement {
  id: string
  product_id: string
  product_name: string
  product_code: string
  quantity: number
  unit_cost: number
  movement_type: string
  reference_type: string
  reference_id: string
  notes: string
  created_at: string
  icon: "up" | "down" | "loss"
}

function getStockMovements(): StockMovement[] {
  const movements: StockMovement[] = []
  const entries = getStockEntries()
  const losses = getStockLosses()

  // Add stock entries
  entries.forEach((entry) => {
    movements.push({
      id: entry.id,
      product_id: entry.product_id,
      product_name: entry.product_name,
      product_code: entry.product_code || "",
      quantity: entry.quantity_received,
      unit_cost: entry.unit_price,
      movement_type: "ENTRY",
      reference_type: "Entrée",
      reference_id: entry.invoice_number || "N/A",
      notes: entry.supplier ? `Fournisseur: ${entry.supplier}` : "",
      created_at: entry.created_at,
      icon: "up" as const,
    })
  })

  // Add stock losses
  losses.forEach((loss) => {
    movements.push({
      id: loss.id,
      product_id: loss.product_id,
      product_name: loss.product_name,
      product_code: loss.product_code || "",
      quantity: -loss.quantity_lost,
      unit_cost: 0,
      movement_type: "LOSS",
      reference_type: `Perte (${loss.reason})`,
      reference_id: loss.id.substring(0, 8),
      notes: loss.notes || loss.reason,
      created_at: loss.created_at,
      icon: "loss" as const,
    })
  })

  // Add some mock sales movements for demo
  const now = new Date()
  mockProducts.slice(0, 3).forEach((product, index) => {
    movements.push({
      id: `mov-sale-${product.id}`,
      product_id: product.id,
      product_name: product.name,
      product_code: product.code || "",
      quantity: -(5 + index * 2),
      unit_cost: product.purchase_price,
      movement_type: "SALE",
      reference_type: "Vente",
      reference_id: `VTE-${index}`,
      notes: "Vente comptant",
      created_at: new Date(now.getTime() - index * 24 * 60 * 60 * 1000).toISOString(),
      icon: "down" as const,
    })
  })

  // Sort by date descending
  return movements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function StockMovementsList() {
  const movements = getStockMovements()

  if (movements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucun mouvement de stock</p>
          <p className="text-sm text-muted-foreground">
            Les mouvements sont générés automatiquement lors des ventes et des réapprovisionnements.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Derniers mouvements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Type</th>
                <th className="text-left py-3 font-medium">Produit</th>
                <th className="text-right py-3 font-medium">Quantité</th>
                <th className="text-right py-3 font-medium">Coût unitaire</th>
                <th className="text-right py-3 font-medium">Valeur</th>
                <th className="text-left py-3 font-medium">Référence</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => {
                const qty = Number(movement.quantity)
                const isEntry = qty > 0
                const value = Math.abs(qty) * Number(movement.unit_cost)

                return (
                  <tr key={movement.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3">{formatDate(movement.created_at)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {movement.icon === "up" && <ArrowUpCircle className="size-4 text-green-600" />}
                        {movement.icon === "down" && <ArrowDownCircle className="size-4 text-red-600" />}
                        {movement.icon === "loss" && <AlertCircle className="size-4 text-orange-600" />}
                        <Badge variant={movement.icon === "up" ? "default" : movement.icon === "loss" ? "outline" : "secondary"}>
                          {movement.reference_type}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <span className="font-medium">{movement.product_name}</span>
                        {movement.product_code && (
                          <span className="ml-2 text-xs text-muted-foreground">({movement.product_code})</span>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 text-right font-medium ${movement.icon === "up" ? "text-green-600" : "text-red-600"}`}>
                      {movement.icon === "up" ? "+" : ""}
                      {qty}
                    </td>
                    <td className="py-3 text-right">{formatCurrency(Number(movement.unit_cost))}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(value)}</td>
                    <td className="py-3 text-xs text-muted-foreground">{movement.notes || movement.reference_type}</td>
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
