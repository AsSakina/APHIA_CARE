import { sql } from "@/lib/db"
import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/app/data-card"
import { ShoppingCart, Wallet, Building2, Users } from "lucide-react"

const saleTypeLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  COMPTANT: { label: "Comptant", variant: "default" },
  MUTUELLE_IPM: { label: "IPM", variant: "secondary" },
  CREDIT_PATIENT: { label: "Crédit", variant: "outline" },
  BON_PATIENT: { label: "Bon", variant: "outline" },
  PROFORMA: { label: "Proforma", variant: "outline" },
  RETAIL_UNIT: { label: "Détail", variant: "secondary" },
}

interface SalesRecord {
  sale_number: string
  sale_date: string
  sale_type: string
  total_amount: number
  discount_amount: number
  amount_paid: number
  patient_name?: string
  ipm_name?: string
}

interface SalesSummary {
  total_sales: number
  total_cash: number
  total_ipm: number
  total_credit: number
}

async function getSalesData() {
  try {
    const sales = await sql`
      SELECT 
        s.sale_number,
        s.sale_date,
        s.sale_type,
        s.total_amount,
        s.discount_amount,
        s.amount_paid,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        i.name as ipm_name
      FROM sales_financial_records s
      LEFT JOIN patients p ON s.patient_id = p.id
      LEFT JOIN ipms i ON s.ipm_id = i.id
      WHERE s.deleted_at IS NULL
      ORDER BY s.sale_date DESC, s.created_at DESC
      LIMIT 50
    `

    const summaryResult = await sql`
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_sales,
        COALESCE(SUM(CASE WHEN sale_type = 'COMPTANT' THEN amount_paid ELSE 0 END), 0) as total_cash,
        COALESCE(SUM(CASE WHEN sale_type = 'MUTUELLE_IPM' THEN ipm_coverage_amount ELSE 0 END), 0) as total_ipm,
        COALESCE(SUM(CASE WHEN sale_type = 'CREDIT_PATIENT' THEN patient_amount ELSE 0 END), 0) as total_credit
      FROM sales_financial_records
      WHERE deleted_at IS NULL AND sale_type != 'PROFORMA'
        AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)
    `

    return {
      sales: sales as SalesRecord[],
      summary: summaryResult[0] as SalesSummary,
    }
  } catch {
    return {
      sales: [],
      summary: { total_sales: 0, total_cash: 0, total_ipm: 0, total_credit: 0 },
    }
  }
}

export async function SalesRevenue() {
  const { sales, summary } = await getSalesData()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <DataCard
          title="Ventes ce mois"
          value={formatCurrency(Number(summary.total_sales))}
          icon={ShoppingCart}
          description="Chiffre d'affaires"
        />
        <DataCard
          title="Encaissements comptant"
          value={formatCurrency(Number(summary.total_cash))}
          icon={Wallet}
          description="Paiements immédiats"
        />
        <DataCard
          title="Part IPM"
          value={formatCurrency(Number(summary.total_ipm))}
          icon={Building2}
          description="Couverture mutuelles"
        />
        <DataCard
          title="Ventes à crédit"
          value={formatCurrency(Number(summary.total_credit))}
          icon={Users}
          description="À recouvrer"
        />
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des ventes</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune vente enregistrée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">N° Vente</th>
                    <th className="text-left py-3 font-medium">Date</th>
                    <th className="text-center py-3 font-medium">Type</th>
                    <th className="text-left py-3 font-medium">Client</th>
                    <th className="text-right py-3 font-medium">Montant</th>
                    <th className="text-right py-3 font-medium">Remise</th>
                    <th className="text-right py-3 font-medium">Payé</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => {
                    const typeConfig = saleTypeLabels[sale.sale_type] || {
                      label: sale.sale_type,
                      variant: "outline" as const,
                    }
                    return (
                      <tr key={sale.sale_number} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-mono text-sm">{sale.sale_number}</td>
                        <td className="py-3">{formatDate(sale.sale_date)}</td>
                        <td className="py-3 text-center">
                          <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                        </td>
                        <td className="py-3">{sale.patient_name || sale.ipm_name || "-"}</td>
                        <td className="py-3 text-right">{formatCurrency(Number(sale.total_amount))}</td>
                        <td className="py-3 text-right text-muted-foreground">
                          {Number(sale.discount_amount) > 0 ? `-${formatCurrency(Number(sale.discount_amount))}` : "-"}
                        </td>
                        <td className="py-3 text-right font-medium text-emerald-600">
                          {formatCurrency(Number(sale.amount_paid))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
