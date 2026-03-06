import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/format"
import { getSaleById } from "../actions"
import type { ClientType, PaymentMethod } from "@/lib/types"
import { PrintInvoiceButton } from "@/components/app/pos/print-invoice-button"

export const dynamic = "force-dynamic"

export default async function SaleDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const sale = await getSaleById(id)

  if (!sale) {
    notFound()
  }

  const clientTypeLabels: Record<ClientType, string> = {
    COMPTANT: "Comptant",
    IPM_MUTUELLE: "IPM / Mutuelle",
    CLIENT_COMPTE: "Client avec compte",
    CLIENT_CREDIT: "Client à crédit",
    PROFORMA: "Pro-forma",
  }

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: "Espèces",
    CARD: "Carte bancaire",
    CHEQUE: "Chèque",
    TRANSFER: "Virement",
    MOBILE_MONEY: "Mobile Money",
    MIXED: "Mixte",
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="bg-transparent">
            <Link href="/app/pos/history">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{sale.sale_number}</h1>
              {sale.is_proforma && (
                <Badge variant="secondary">
                  <FileText className="mr-1 size-3" />
                  Pro-forma
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">Détails de la vente</p>
          </div>
        </div>
        <PrintInvoiceButton sale={sale} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sale Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="text-center">Qté</TableHead>
                  <TableHead className="text-right">Prix unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">{item.product_code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                      {item.is_unit_sale && <span className="ml-1 text-xs text-muted-foreground">(unité)</span>}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.line_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              {sale.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Remise</span>
                  <span>-{formatCurrency(sale.discount_amount)}</span>
                </div>
              )}
              {sale.tolerance_amount > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Tolérance</span>
                  <span>-{formatCurrency(sale.tolerance_amount)}</span>
                </div>
              )}
              {sale.ipm_coverage_amount > 0 && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Prise en charge IPM</span>
                  <span>-{formatCurrency(sale.ipm_coverage_amount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(sale.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Montant payé</span>
                <span className={sale.amount_paid < sale.patient_amount ? "text-orange-600" : "text-green-600"}>
                  {formatCurrency(sale.amount_paid)}
                </span>
              </div>
              {sale.patient_amount - sale.amount_paid > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Reste à payer</span>
                  <span>{formatCurrency(sale.patient_amount - sale.amount_paid)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sale Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(sale.sale_date)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type de client</p>
                <p className="font-medium">{clientTypeLabels[sale.client_type]}</p>
              </div>
              {sale.patient_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{sale.patient_name}</p>
                </div>
              )}
              {sale.ipm_name && (
                <div>
                  <p className="text-sm text-muted-foreground">IPM</p>
                  <p className="font-medium">{sale.ipm_name}</p>
                </div>
              )}
              {sale.payment_method && (
                <div>
                  <p className="text-sm text-muted-foreground">Mode de paiement</p>
                  <p className="font-medium">{paymentMethodLabels[sale.payment_method]}</p>
                </div>
              )}
              {sale.payment_reference && (
                <div>
                  <p className="text-sm text-muted-foreground">Référence</p>
                  <p className="font-medium">{sale.payment_reference}</p>
                </div>
              )}
              {sale.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{sale.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
