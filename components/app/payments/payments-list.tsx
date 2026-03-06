import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockPayments } from "@/lib/mock-data"
import type { Payment } from "@/lib/types"

const paymentMethodLabels: Record<string, string> = {
  CASH: "Espèces",
  CARD: "Carte",
  CHEQUE: "Chèque",
  TRANSFER: "Virement",
  MOBILE_MONEY: "Mobile Money",
  MIXED: "Mixte",
}

function getPayments(): Payment[] {
  return mockPayments
}

export async function PaymentsList() {
  const payments = getPayments()

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucun paiement enregistré</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liste des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Type</th>
                <th className="text-left py-3 font-medium">Destinataire</th>
                <th className="text-left py-3 font-medium">Référence</th>
                <th className="text-center py-3 font-medium">Méthode</th>
                <th className="text-right py-3 font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">{formatDate(payment.payment_date)}</td>
                  <td className="py-3">
                    {payment.expense_id ? (
                      <Badge variant="outline">Dépense</Badge>
                    ) : payment.supplier_document_id ? (
                      <Badge variant="outline">Fournisseur</Badge>
                    ) : (
                      <Badge variant="outline">Autre</Badge>
                    )}
                  </td>
                  <td className="py-3">
                    {payment.expense_description || payment.supplier_name || "-"}
                    {payment.document_number && (
                      <span className="text-muted-foreground ml-1">({payment.document_number})</span>
                    )}
                  </td>
                  <td className="py-3 text-muted-foreground">{payment.reference || "-"}</td>
                  <td className="py-3 text-center">
                    <Badge variant="secondary">{paymentMethodLabels[payment.payment_method]}</Badge>
                  </td>
                  <td className="py-3 text-right font-medium">{formatCurrency(Number(payment.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
