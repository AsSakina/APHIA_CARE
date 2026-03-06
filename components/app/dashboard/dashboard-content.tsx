import { formatCurrency } from "@/lib/format"
import { DataCard } from "@/components/app/data-card"
import {
  Receipt,
  CreditCard,
  TrendingDown,
  Building2,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpensesByTypeChart } from "./expenses-by-type-chart"
import { MonthlyTrendChart } from "./monthly-trend-chart"
import { getMockDashboardSummary } from "@/lib/mock-data"

export async function DashboardContent() {
  // OFFLINE MODE: Use mock data
  const summary = getMockDashboardSummary()

  // Mock expenses by type for chart
  const expensesByType = [
    { expense_type: "MEDICATION_PURCHASE", total: 450000 },
    { expense_type: "SALARY", total: 280000 },
    { expense_type: "RENT", total: 150000 },
    { expense_type: "ELECTRICITY", total: 45000 },
    { expense_type: "TRANSPORT", total: 35000 },
    { expense_type: "OTHER", total: 25000 },
  ]

  // Mock monthly data for trend chart
  const monthlyData = [
    { month: "Oct", expenses: 120000, sales: 750000 },
    { month: "Nov", expenses: 135000, sales: 820000 },
    { month: "Déc", expenses: 145000, sales: 950000 },
    { month: "Jan", expenses: 125000, sales: 850000 },
  ]

  // Mock supplier debt
  const supplierDebt = [
    {
      supplier_id: "sup-1",
      supplier_name: "Pharma Distribution",
      document_count: 5,
      total_debt: 450000,
      total_paid: 300000,
      outstanding_amount: 150000,
      debt_0_30_days: 100000,
      debt_31_60_days: 30000,
      debt_61_90_days: 15000,
      debt_over_90_days: 5000,
    },
    {
      supplier_id: "sup-2",
      supplier_name: "MédiStock Sénégal",
      document_count: 3,
      total_debt: 280000,
      total_paid: 180000,
      outstanding_amount: 100000,
      debt_0_30_days: 80000,
      debt_31_60_days: 15000,
      debt_61_90_days: 5000,
      debt_over_90_days: 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Ventes ce mois"
          value={formatCurrency(Number(summary.sales_this_month) || 0)}
          icon={ShoppingCart}
          description="Chiffre d'affaires"
        />
        <DataCard
          title="Encaissements"
          value={formatCurrency(Number(summary.cash_collected_this_month) || 0)}
          icon={Wallet}
          description="Paiements reçus"
        />
        <DataCard
          title="Dépenses ce mois"
          value={formatCurrency(Number(summary.expenses_this_month) || 0)}
          icon={Receipt}
          description={`${formatCurrency(Number(summary.expenses_pending) || 0)} en attente`}
        />
        <DataCard
          title="Paiements sortants"
          value={formatCurrency(Number(summary.payments_this_month) || 0)}
          icon={CreditCard}
          description="Décaissements ce mois"
        />
      </div>

      {/* Second Row - Receivables & Liabilities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Dette fournisseurs"
          value={formatCurrency(Number(summary.total_supplier_debt) || 0)}
          icon={AlertTriangle}
          description="Total à payer"
        />
        <DataCard
          title="Créances IPM"
          value={formatCurrency(Number(summary.ipm_receivables) || 0)}
          icon={Building2}
          description="À recevoir des mutuelles"
        />
        <DataCard
          title="Créances patients"
          value={formatCurrency(Number(summary.patient_receivables) || 0)}
          icon={Users}
          description="Ventes à crédit"
        />
        <DataCard
          title="Pertes ce mois"
          value={formatCurrency(Number(summary.losses_this_month) || 0)}
          icon={TrendingDown}
          description="Pertes de stock"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <ExpensesByTypeChart data={expensesByType} />
        <MonthlyTrendChart data={monthlyData} />
      </div>

      {/* Supplier Debt Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dettes fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          {supplierDebt.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune dette fournisseur enregistrée</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Fournisseur</th>
                    <th className="text-right py-2 font-medium">Total</th>
                    <th className="text-right py-2 font-medium">Payé</th>
                    <th className="text-right py-2 font-medium">Reste</th>
                    <th className="text-right py-2 font-medium">0-30j</th>
                    <th className="text-right py-2 font-medium">31-60j</th>
                    <th className="text-right py-2 font-medium">{">"} 90j</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierDebt.map((debt) => (
                    <tr key={debt.supplier_id} className="border-b last:border-0">
                      <td className="py-2">{debt.supplier_name}</td>
                      <td className="text-right py-2">{formatCurrency(Number(debt.total_debt) || 0)}</td>
                      <td className="text-right py-2">{formatCurrency(Number(debt.total_paid) || 0)}</td>
                      <td className="text-right py-2 font-medium">
                        {formatCurrency(Number(debt.outstanding_amount) || 0)}
                      </td>
                      <td className="text-right py-2 text-muted-foreground">
                        {formatCurrency(Number(debt.debt_0_30_days) || 0)}
                      </td>
                      <td className="text-right py-2 text-muted-foreground">
                        {formatCurrency(Number(debt.debt_31_60_days) || 0)}
                      </td>
                      <td className="text-right py-2 text-destructive">
                        {formatCurrency(Number(debt.debt_over_90_days) || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
