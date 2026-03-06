import { sql } from "@/lib/db"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryBalance {
  category_id: string
  category_code: string
  category_name: string
  total_debit: number
  total_credit: number
  balance: number
}

async function getBalances() {
  try {
    const balances = await sql`
      SELECT * FROM v_accounting_balance_by_category
      ORDER BY category_code
    `
    return balances as CategoryBalance[]
  } catch {
    return []
  }
}

export async function AccountingBalance() {
  const balances = await getBalances()

  const totalDebit = balances.reduce((sum, b) => sum + Number(b.total_debit), 0)
  const totalCredit = balances.reduce((sum, b) => sum + Number(b.total_credit), 0)
  const totalBalance = balances.reduce((sum, b) => sum + Number(b.balance), 0)

  if (balances.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucun solde disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balance des comptes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Code</th>
                <th className="text-left py-3 font-medium">Catégorie</th>
                <th className="text-right py-3 font-medium">Débit</th>
                <th className="text-right py-3 font-medium">Crédit</th>
                <th className="text-right py-3 font-medium">Solde</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((balance) => (
                <tr key={balance.category_id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 font-mono text-sm">{balance.category_code}</td>
                  <td className="py-3">{balance.category_name}</td>
                  <td className="py-3 text-right">
                    {Number(balance.total_debit) > 0 ? formatCurrency(Number(balance.total_debit)) : "-"}
                  </td>
                  <td className="py-3 text-right">
                    {Number(balance.total_credit) > 0 ? formatCurrency(Number(balance.total_credit)) : "-"}
                  </td>
                  <td className="py-3 text-right font-medium">
                    <span className={Number(balance.balance) < 0 ? "text-destructive" : ""}>
                      {formatCurrency(Number(balance.balance))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td className="py-3" colSpan={2}>
                  TOTAL
                </td>
                <td className="py-3 text-right">{formatCurrency(totalDebit)}</td>
                <td className="py-3 text-right">{formatCurrency(totalCredit)}</td>
                <td className="py-3 text-right">
                  <span className={totalBalance < 0 ? "text-destructive" : ""}>{formatCurrency(totalBalance)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
