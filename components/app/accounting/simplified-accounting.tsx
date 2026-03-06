import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, CreditCard, Building2, Users } from "lucide-react"

interface MonthlyData {
  period: string
  chiffre_affaires: number
  ventes_encaissees: number
  depenses: number
  ipm_a_recevoir: number
  credits_a_recevoir: number
}

async function getSimplifiedAccounting(): Promise<MonthlyData[]> {
  const session = await getSession()
  if (!session?.pharmacyId) return []

  const pharmacyId = session.pharmacyId

  // Get monthly data for last 12 months
  const result = await sql`
    WITH months AS (
      SELECT generate_series(
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
        DATE_TRUNC('month', CURRENT_DATE),
        '1 month'
      ) AS period
    ),
    sales_data AS (
      SELECT 
        DATE_TRUNC('month', sale_date) AS period,
        COALESCE(SUM(total_amount), 0) AS chiffre_affaires,
        COALESCE(SUM(amount_paid), 0) AS ventes_encaissees,
        COALESCE(SUM(CASE WHEN ipm_id IS NOT NULL THEN ipm_coverage_amount - amount_paid + patient_amount ELSE 0 END), 0) AS ipm_a_recevoir,
        COALESCE(SUM(CASE WHEN client_type = 'CLIENT_CREDIT' THEN patient_amount - amount_paid ELSE 0 END), 0) AS credits_a_recevoir
      FROM sales
      WHERE pharmacy_id = ${pharmacyId} AND is_proforma = false
      GROUP BY DATE_TRUNC('month', sale_date)
    ),
    expenses_data AS (
      SELECT 
        DATE_TRUNC('month', expense_date) AS period,
        COALESCE(SUM(amount), 0) AS depenses
      FROM expenses
      WHERE pharmacy_id = ${pharmacyId} AND status IN ('VALIDATED', 'PAID')
      GROUP BY DATE_TRUNC('month', expense_date)
    )
    SELECT 
      m.period,
      COALESCE(s.chiffre_affaires, 0) AS chiffre_affaires,
      COALESCE(s.ventes_encaissees, 0) AS ventes_encaissees,
      COALESCE(e.depenses, 0) AS depenses,
      COALESCE(s.ipm_a_recevoir, 0) AS ipm_a_recevoir,
      COALESCE(s.credits_a_recevoir, 0) AS credits_a_recevoir
    FROM months m
    LEFT JOIN sales_data s ON m.period = s.period
    LEFT JOIN expenses_data e ON m.period = e.period
    ORDER BY m.period DESC
  `

  return result as MonthlyData[]
}

async function getCurrentMonthSummary() {
  const session = await getSession()
  if (!session?.pharmacyId) return null

  const pharmacyId = session.pharmacyId

  const result = await sql`
    SELECT
      COALESCE((
        SELECT SUM(total_amount) FROM sales 
        WHERE pharmacy_id = ${pharmacyId} 
          AND is_proforma = false 
          AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)
      ), 0) AS chiffre_affaires,
      COALESCE((
        SELECT SUM(amount_paid) FROM sales 
        WHERE pharmacy_id = ${pharmacyId} 
          AND is_proforma = false 
          AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)
      ), 0) AS ventes_encaissees,
      COALESCE((
        SELECT SUM(amount) FROM expenses 
        WHERE pharmacy_id = ${pharmacyId} 
          AND status IN ('VALIDATED', 'PAID') 
          AND expense_date >= DATE_TRUNC('month', CURRENT_DATE)
      ), 0) AS depenses,
      COALESCE((
        SELECT SUM(ipm_coverage_amount) FROM sales 
        WHERE pharmacy_id = ${pharmacyId} 
          AND is_proforma = false 
          AND ipm_id IS NOT NULL
          AND sale_date >= DATE_TRUNC('month', CURRENT_DATE)
      ), 0) AS ipm_total,
      COALESCE((
        SELECT SUM(patient_amount - amount_paid) FROM sales 
        WHERE pharmacy_id = ${pharmacyId} 
          AND is_proforma = false 
          AND client_type = 'CLIENT_CREDIT'
          AND patient_amount > amount_paid
      ), 0) AS credits_a_recevoir
  `

  return result[0]
}

export async function SimplifiedAccounting() {
  const [monthlyData, currentMonth] = await Promise.all([getSimplifiedAccounting(), getCurrentMonthSummary()])

  const ca = Number(currentMonth?.chiffre_affaires || 0)
  const ventes = Number(currentMonth?.ventes_encaissees || 0)
  const depenses = Number(currentMonth?.depenses || 0)
  const solde = ventes - depenses
  const ipmTotal = Number(currentMonth?.ipm_total || 0)
  const credits = Number(currentMonth?.credits_a_recevoir || 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards - This Month */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires (CA)</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ca)}</div>
            <p className="text-xs text-muted-foreground">Total des ventes ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes encaissées</CardTitle>
            <Wallet className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(ventes)}</div>
            <p className="text-xs text-muted-foreground">Montant réellement reçu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(depenses)}</div>
            <p className="text-xs text-muted-foreground">Dépenses validées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde</CardTitle>
            <CreditCard className={`size-4 ${solde >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${solde >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(solde)}
            </div>
            <p className="text-xs text-muted-foreground">Ventes - Dépenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Receivables Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créances IPM</CardTitle>
            <Building2 className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(ipmTotal)}</div>
            <p className="text-xs text-muted-foreground">Montant à recevoir des IPM/Mutuelles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédits patients</CardTitle>
            <Users className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(credits)}</div>
            <p className="text-xs text-muted-foreground">Montant à recevoir des patients à crédit</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique mensuel</CardTitle>
          <CardDescription>Vue d'ensemble des 12 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Période</th>
                  <th className="text-right py-3 font-medium">CA</th>
                  <th className="text-right py-3 font-medium">Encaissé</th>
                  <th className="text-right py-3 font-medium">Dépenses</th>
                  <th className="text-right py-3 font-medium">Solde</th>
                  <th className="text-right py-3 font-medium">IPM à recevoir</th>
                  <th className="text-right py-3 font-medium">Crédits</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  monthlyData.map((row) => {
                    const rowCa = Number(row.chiffre_affaires)
                    const rowVentes = Number(row.ventes_encaissees)
                    const rowDepenses = Number(row.depenses)
                    const rowSolde = rowVentes - rowDepenses
                    const rowIpm = Number(row.ipm_a_recevoir)
                    const rowCredits = Number(row.credits_a_recevoir)

                    return (
                      <tr key={row.period} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 font-medium">
                          {new Date(row.period).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                        </td>
                        <td className="py-3 text-right">{formatCurrency(rowCa)}</td>
                        <td className="py-3 text-right text-green-600">{formatCurrency(rowVentes)}</td>
                        <td className="py-3 text-right text-red-600">{formatCurrency(rowDepenses)}</td>
                        <td
                          className={`py-3 text-right font-medium ${rowSolde >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(rowSolde)}
                        </td>
                        <td className="py-3 text-right text-blue-600">{formatCurrency(rowIpm)}</td>
                        <td className="py-3 text-right text-orange-600">{formatCurrency(rowCredits)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
