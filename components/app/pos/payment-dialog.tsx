"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Banknote, Smartphone, Building, CheckCircle, Printer, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"
import type { Cart, PaymentMethod, Sale, PaymentSplit } from "@/lib/types"
import { validateCartWithPaymentSplits } from "@/app/app/pos/actions"
import { decrementStockAfterSale } from "@/app/app/pos/actions"
import { InvoiceTemplate } from "./invoice-template"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: Cart
  cartItems: {
    id: string
    product_id: string
    product_name?: string
    quantity: number
    is_unit_sale: boolean
    unit_price: number
    line_total: number
  }[]
  onSuccess: () => void
}

export function PaymentDialog({ open, onOpenChange, cart, cartItems, onSuccess }: PaymentDialogProps) {
  const router = useRouter()
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([])
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<Exclude<PaymentMethod, "MIXED">>("CASH")
  const [currentAmount, setCurrentAmount] = useState("")
  const [currentReference, setCurrentReference] = useState("")
  const [toleranceAmount, setToleranceAmount] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [saleNumber, setSaleNumber] = useState("")
  const [saleId, setSaleId] = useState("")

  const isProforma = cart.client_type === "PROFORMA"
  const amountDue = cart.patient_amount
  const totalPaid = paymentSplits.reduce((sum, split) => sum + split.amount, 0)
  const tolerance = Number.parseFloat(toleranceAmount) || 0
  const change = totalPaid - amountDue + tolerance

  // Create a Sale object for the invoice
  const saleForInvoice: Sale = {
    id: saleId,
    sale_number: saleNumber,
    client_type: cart.client_type,
    patient_id: cart.patient_id,
    patient_name: cart.patient_name,
    ipm_id: cart.ipm_id,
    ipm_name: cart.ipm_name,
    subtotal: cart.subtotal,
    discount_amount: cart.discount_amount,
    tolerance_amount: tolerance,
    total_amount: cart.total_amount,
    ipm_coverage_amount: cart.ipm_coverage_amount,
    patient_amount: cart.patient_amount,
    amount_paid: isProforma ? 0 : Math.min(totalPaid, amountDue),
    payment_method: paymentSplits.length === 1 ? paymentSplits[0].method : "MIXED",
    payment_splits: paymentSplits,
    sale_date: new Date().toISOString(),
    is_proforma: isProforma,
    created_at: new Date().toISOString(),
    items: cartItems.map((item, index) => ({
      id: `temp-${index}`,
      sale_id: saleId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      is_unit_sale: item.is_unit_sale,
      unit_price: item.unit_price,
      unit_cost: 0,
      line_total: item.line_total,
    })),
  }

  function handleAddPaymentMethod() {
    const amount = Number.parseFloat(currentAmount) || 0
    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à 0")
      return
    }

    const newSplit: PaymentSplit = {
      method: currentPaymentMethod,
      amount,
      reference: currentReference || undefined,
    }

    setPaymentSplits([...paymentSplits, newSplit])
    setCurrentAmount("")
    setCurrentReference("")
    toast.success(`${currentPaymentMethod} ajouté: ${formatCurrency(amount)}`)
  }

  function handleRemovePaymentMethod(index: number) {
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index))
  }

  async function handleValidate() {
    setIsLoading(true)

    // Validate payment splits
    if (paymentSplits.length === 0) {
      toast.error("Veuillez ajouter au moins un mode de paiement")
      setIsLoading(false)
      return
    }

    // For non-credit sales, validate amount
    if (!isProforma && cart.client_type !== "CLIENT_CREDIT") {
      const effectiveTotal = totalPaid + tolerance
      if (effectiveTotal < amountDue) {
        toast.error("Le montant total reçu est insuffisant")
        setIsLoading(false)
        return
      }
    }

    const result = await validateCartWithPaymentSplits(
      cart.id,
      paymentSplits,
      tolerance,
    )

    if (result.success) {
      // Decrement stock after successful sale
      if (!isProforma && result.saleId) {
        const stockResult = await decrementStockAfterSale(result.saleId)
        if (!stockResult.success) {
          console.error("Stock update failed:", stockResult.error)
          // Don't block the sale if stock update fails, just log it
        } else {
          toast.success("Stock mis à jour")
        }
      }

      setIsSuccess(true)
      setSaleNumber(result.saleNumber || "")
      setSaleId(result.saleId || "")
      toast.success("Vente validée avec succès")
    } else {
      toast.error(result.error || "Erreur lors de la validation")
    }
    setIsLoading(false)
  }

  function handleClose() {
    if (isSuccess) {
      onSuccess()
      router.refresh()
    }
    setIsSuccess(false)
    onOpenChange(false)
  }

  function handlePrintInvoice() {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const invoiceContent = invoiceRef.current?.innerHTML || ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${saleNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
    }

    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.print()
        printWindow.close()
      }
    }, 1000)
  }

  const paymentMethods = [
    { value: "CASH", label: "Espèces", icon: Banknote },
    { value: "CARD", label: "Carte", icon: CreditCard },
    { value: "MOBILE_MONEY", label: "Mobile Money", icon: Smartphone },
    { value: "TRANSFER", label: "Virement", icon: Building },
  ]

  const paymentMethodOptions = [
    { value: "CASH" as const, label: "Espèces", icon: Banknote },
    { value: "CARD" as const, label: "Carte", icon: CreditCard },
    { value: "CHEQUE" as const, label: "Chèque", icon: Building },
    { value: "TRANSFER" as const, label: "Virement", icon: Building },
    { value: "MOBILE_MONEY" as const, label: "Mobile Money", icon: Smartphone },
    { value: "IPM" as const, label: "IPM", icon: Building },
    { value: "CREDIT" as const, label: "Crédit", icon: CreditCard },
  ]

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="mb-4 size-16 text-green-500" />
            <h2 className="mb-2 text-xl font-bold">Vente validée!</h2>
            <p className="mb-4 text-muted-foreground">Numéro: {saleNumber}</p>
            {change > 0 && !isProforma && cart.client_type !== "CLIENT_CREDIT" && (
              <div className="rounded-md bg-green-50 dark:bg-green-950 p-4 text-green-800 dark:text-green-200 mb-4">
                <p className="text-sm">Monnaie à rendre</p>
                <p className="text-2xl font-bold">{formatCurrency(change)}</p>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handlePrintInvoice} className="bg-transparent">
                <Printer className="mr-2 size-4" />
                Imprimer la facture
              </Button>
              <Button onClick={handleClose}>Fermer</Button>
            </div>
          </div>
          {/* Hidden invoice for printing */}
          <div className="hidden">
            <InvoiceTemplate ref={invoiceRef} sale={{ ...saleForInvoice, sale_number: saleNumber }} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isProforma ? "Valider le pro-forma" : "Encaissement - Modes de paiement multiples"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-md bg-muted p-4">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              {cart.discount_amount > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Remise</span>
                  <span>-{formatCurrency(cart.discount_amount)}</span>
                </div>
              )}
              {cart.ipm_coverage_amount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Prise en charge IPM</span>
                  <span>-{formatCurrency(cart.ipm_coverage_amount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>À payer</span>
                <span>{formatCurrency(amountDue)}</span>
              </div>
            </div>
          </div>

          {!isProforma && cart.client_type !== "CLIENT_CREDIT" && (
            <>
              {/* Payment Splits Summary */}
              {paymentSplits.length > 0 && (
                <div className="rounded-md border bg-card p-4">
                  <h3 className="font-semibold mb-3">Modes de paiement sélectionnés</h3>
                  <div className="space-y-2">
                    {paymentSplits.map((split, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{split.method}</p>
                          {split.reference && <p className="text-xs text-muted-foreground">{split.reference}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{formatCurrency(split.amount)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePaymentMethod(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
                    <span>Total payé:</span>
                    <span>{formatCurrency(totalPaid)}</span>
                  </div>
                </div>
              )}

              {/* Add Payment Method */}
              <div className="rounded-md border bg-card p-4 space-y-4">
                <h3 className="font-semibold">Ajouter un mode de paiement</h3>
                
                <div className="space-y-2">
                  <Label>Mode de paiement</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {paymentMethodOptions.map((method) => {
                      const MethodIcon = method.icon
                      return (
                        <div key={method.value} className="relative">
                          <input
                            type="radio"
                            id={method.value}
                            value={method.value}
                            checked={currentPaymentMethod === method.value}
                            onChange={(e) => setCurrentPaymentMethod(e.target.value as Exclude<PaymentMethod, "MIXED">)}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={method.value}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-muted bg-background p-3 text-sm font-medium transition-all hover:border-primary hover:bg-accent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground"
                          >
                            <MethodIcon className="size-4" />
                            <span className="text-xs sm:text-sm">{method.label}</span>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Montant (FCFA)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>

                {currentPaymentMethod !== "CASH" && (
                  <div className="space-y-2">
                    <Label>Référence (optionnel)</Label>
                    <Input
                      value={currentReference}
                      onChange={(e) => setCurrentReference(e.target.value)}
                      placeholder="Numéro de transaction..."
                    />
                  </div>
                )}

                <Button onClick={handleAddPaymentMethod} className="w-full">
                  <Plus className="mr-2 size-4" />
                  Ajouter ce mode de paiement
                </Button>
              </div>

              {/* Tolerance */}
              <div className="space-y-2">
                <Label>Tolérance d'arrondi (FCFA)</Label>
                <Input
                  type="number"
                  min="0"
                  value={toleranceAmount}
                  onChange={(e) => setToleranceAmount(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Différence tolérée (sera enregistrée comme perte)</p>
              </div>

              {/* Change/Remaining */}
              {totalPaid > 0 && (
                <>
                  {change > 0 && (
                    <div className="rounded-md bg-green-50 dark:bg-green-950 p-3 text-center text-green-800 dark:text-green-200">
                      <p className="text-sm">Monnaie à rendre</p>
                      <p className="text-xl font-bold">{formatCurrency(change)}</p>
                    </div>
                  )}
                  {change < 0 && tolerance === 0 && (
                    <div className="rounded-md bg-orange-50 dark:bg-orange-950 p-3 text-center text-orange-800 dark:text-orange-200">
                      <p className="text-sm">Montant manquant</p>
                      <p className="text-xl font-bold">{formatCurrency(Math.abs(change))}</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {cart.client_type === "CLIENT_CREDIT" && (
            <div className="rounded-md bg-orange-50 dark:bg-orange-950 p-4 text-center text-orange-800 dark:text-orange-200">
              <p className="font-medium">Vente à crédit</p>
              <p className="text-sm">Le montant sera enregistré comme créance client</p>
            </div>
          )}

          {isProforma && (
            <div className="rounded-md bg-muted p-4 text-center">
              <p className="font-medium">Pro-forma</p>
              <p className="text-sm text-muted-foreground">Aucun impact financier ni mouvement de stock</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button className="flex-1" onClick={handleValidate} disabled={isLoading || (paymentSplits.length === 0 && !isProforma && cart.client_type !== "CLIENT_CREDIT")}>
              {isLoading ? "Validation..." : "Valider la vente"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
