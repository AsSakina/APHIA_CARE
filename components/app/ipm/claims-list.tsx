import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/app/status-badge"
import { mockIpmClaims, getIpmById } from "@/lib/mock-data"
import type { IpmClaim } from "@/lib/types"

function getClaims(): IpmClaim[] {
  return mockIpmClaims.map((claim) => ({
    ...claim,
    ipm_name: claim.ipm_name || getIpmById(claim.ipm_id)?.name,
  }))
}

export async function ClaimsList() {
  const claims = getClaims()

  if (claims.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucune créance enregistrée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liste des créances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">N° Créance</th>
                <th className="text-left py-3 font-medium">IPM</th>
                <th className="text-left py-3 font-medium">Période</th>
                <th className="text-right py-3 font-medium">Montant</th>
                <th className="text-right py-3 font-medium">Accepté</th>
                <th className="text-right py-3 font-medium">Payé</th>
                <th className="text-center py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 font-mono text-sm">{claim.claim_number}</td>
                  <td className="py-3">{claim.ipm_name}</td>
                  <td className="py-3 text-muted-foreground">
                    {formatDate(claim.period_start)} - {formatDate(claim.period_end)}
                  </td>
                  <td className="py-3 text-right">{formatCurrency(Number(claim.total_amount))}</td>
                  <td className="py-3 text-right">
                    {Number(claim.amount_accepted) > 0 ? (
                      formatCurrency(Number(claim.amount_accepted))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-emerald-600">
                    {Number(claim.amount_paid) > 0 ? (
                      formatCurrency(Number(claim.amount_paid))
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <StatusBadge status={claim.status} />
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
