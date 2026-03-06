import { formatCurrency, formatPercent } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockIpms } from "@/lib/mock-data"

function getIpmsWithBalances() {
  // Return IPMs with mock balance data
  return mockIpms.map((ipm) => ({
    ipm_id: ipm.id,
    ipm_name: ipm.name,
    ipm_code: ipm.code,
    coverage_rate: ipm.coverage_rate || 80,
    payment_delay_days: ipm.payment_delay_days || 30,
    is_active: ipm.is_active,
    claim_count: Math.floor(Math.random() * 10) + 1,
    total_claimed: Math.floor(Math.random() * 500000) + 100000,
    total_accepted: Math.floor(Math.random() * 400000) + 80000,
    total_paid: Math.floor(Math.random() * 300000) + 50000,
    outstanding_amount: Math.floor(Math.random() * 150000) + 20000,
  }))
}

export async function IpmList() {
  const ipms = getIpmsWithBalances()

  if (ipms.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucun IPM enregistré</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liste des IPM / Mutuelles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Code</th>
                <th className="text-left py-3 font-medium">Nom</th>
                <th className="text-center py-3 font-medium">Taux</th>
                <th className="text-center py-3 font-medium">Délai</th>
                <th className="text-right py-3 font-medium">Créances</th>
                <th className="text-right py-3 font-medium">Encaissé</th>
                <th className="text-right py-3 font-medium">En attente</th>
                <th className="text-center py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {ipms.map((ipm) => (
                <tr key={ipm.ipm_id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 font-mono text-sm">{ipm.ipm_code || "-"}</td>
                  <td className="py-3 font-medium">{ipm.ipm_name}</td>
                  <td className="py-3 text-center">{formatPercent(Number(ipm.coverage_rate))}</td>
                  <td className="py-3 text-center text-muted-foreground">{ipm.payment_delay_days}j</td>
                  <td className="py-3 text-right">{formatCurrency(Number(ipm.total_claimed))}</td>
                  <td className="py-3 text-right text-emerald-600">{formatCurrency(Number(ipm.total_paid))}</td>
                  <td className="py-3 text-right font-medium">
                    {Number(ipm.outstanding_amount) > 0 ? (
                      <span className="text-amber-600">{formatCurrency(Number(ipm.outstanding_amount))}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={ipm.is_active ? "default" : "secondary"}>
                      {ipm.is_active ? "Actif" : "Inactif"}
                    </Badge>
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
