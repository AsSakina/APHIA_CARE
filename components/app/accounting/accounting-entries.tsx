import { sql } from "@/lib/db"
import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AccountingEntry } from "@/lib/types"

async function getEntries() {
  try {
    const entries = await sql`
      SELECT 
        ae.*,
        ec.code as category_code,
        ec.name as category_name
      FROM accounting_entries ae
      LEFT JOIN expense_account_categories ec ON ae.category_id = ec.id
      ORDER BY ae.entry_date DESC, ae.created_at DESC
      LIMIT 100
    `
    return entries as AccountingEntry[]
  } catch {
    return []
  }
}

export async function AccountingEntries() {
  const entries = await getEntries()

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucune écriture comptable</p>
          <p className="text-sm text-muted-foreground">
            Les écritures sont générées automatiquement lors de la validation des dépenses et des paiements.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Journal des écritures</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-center py-3 font-medium">Type</th>
                <th className="text-left py-3 font-medium">Catégorie</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Référence</th>
                <th className="text-right py-3 font-medium">Débit</th>
                <th className="text-right py-3 font-medium">Crédit</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">{formatDate(entry.entry_date)}</td>
                  <td className="py-3 text-center">
                    <Badge variant={entry.entry_type === "DEBIT" ? "default" : "secondary"}>{entry.entry_type}</Badge>
                  </td>
                  <td className="py-3">
                    {entry.category_code ? <span className="font-mono text-xs">{entry.category_code}</span> : "-"}
                  </td>
                  <td className="py-3 max-w-[200px] truncate">{entry.description || "-"}</td>
                  <td className="py-3 text-muted-foreground text-xs">{entry.reference_type}</td>
                  <td className="py-3 text-right">
                    {entry.entry_type === "DEBIT" ? (
                      <span className="font-medium">{formatCurrency(Number(entry.amount))}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {entry.entry_type === "CREDIT" ? (
                      <span className="font-medium">{formatCurrency(Number(entry.amount))}</span>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
