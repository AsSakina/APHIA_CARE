"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"
import { createPayment } from "@/app/app/payments/actions"
import type { Expense, PaymentMethod } from "@/lib/types"

interface SupplierDocument {
  id: string
  supplier_name: string
  document_type: string
  document_number: string
  total_amount: number
  amount_paid: number
  remaining: number
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Espèces" },
  { value: "CARD", label: "Carte bancaire" },
  { value: "CHEQUE", label: "Chèque" },
  { value: "TRANSFER", label: "Virement bancaire" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
]

interface PaymentFormProps {
  expenses: Expense[]
  supplierDocuments: SupplierDocument[]
  preselectedExpenseId?: string
  preselectedDocumentId?: string
}

export function PaymentForm({
  expenses,
  supplierDocuments,
  preselectedExpenseId,
  preselectedDocumentId,
}: PaymentFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentType, setPaymentType] = useState<"expense" | "supplier">(preselectedDocumentId ? "supplier" : "expense")
  const [selectedExpenseId, setSelectedExpenseId] = useState(preselectedExpenseId || "")
  const [selectedDocumentId, setSelectedDocumentId] = useState(preselectedDocumentId || "")
  const [suggestedAmount, setSuggestedAmount] = useState(0)

  useEffect(() => {
    if (paymentType === "expense" && selectedExpenseId) {
      const expense = expenses.find((e) => e.id === selectedExpenseId)
      if (expense) setSuggestedAmount(Number(expense.amount))
    } else if (paymentType === "supplier" && selectedDocumentId) {
      const doc = supplierDocuments.find((d) => d.id === selectedDocumentId)
      if (doc) setSuggestedAmount(Number(doc.remaining))
    } else {
      setSuggestedAmount(0)
    }
  }, [paymentType, selectedExpenseId, selectedDocumentId, expenses, supplierDocuments])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      payment_method: formData.get("payment_method") as PaymentMethod,
      amount: Number(formData.get("amount")),
      payment_date: formData.get("payment_date") as string,
      reference: (formData.get("reference") as string) || undefined,
      expense_id: paymentType === "expense" ? selectedExpenseId || undefined : undefined,
      supplier_document_id: paymentType === "supplier" ? selectedDocumentId || undefined : undefined,
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      await createPayment(data)
      toast.success("Paiement enregistré avec succès")
      router.push("/app/payments")
    } catch {
      toast.error("Erreur lors de l'enregistrement du paiement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Informations du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Type Selection */}
          <div className="space-y-3">
            <Label>Type de paiement</Label>
            <RadioGroup
              value={paymentType}
              onValueChange={(v) => setPaymentType(v as "expense" | "supplier")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="font-normal cursor-pointer">
                  Paiement de dépense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supplier" id="supplier" />
                <Label htmlFor="supplier" className="font-normal cursor-pointer">
                  Paiement fournisseur
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Expense Selection */}
          {paymentType === "expense" && (
            <div className="space-y-2">
              <Label>Dépense à payer</Label>
              <Select value={selectedExpenseId} onValueChange={setSelectedExpenseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une dépense" />
                </SelectTrigger>
                <SelectContent>
                  {expenses.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Aucune dépense en attente
                    </SelectItem>
                  ) : (
                    expenses.map((expense) => (
                      <SelectItem key={expense.id} value={expense.id}>
                        {expense.description} - {formatCurrency(Number(expense.amount))}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Supplier Document Selection */}
          {paymentType === "supplier" && (
            <div className="space-y-2">
              <Label>Document fournisseur</Label>
              <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un document" />
                </SelectTrigger>
                <SelectContent>
                  {supplierDocuments.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Aucun document en attente
                    </SelectItem>
                  ) : (
                    supplierDocuments.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.supplier_name} - {doc.document_number} (Reste: {formatCurrency(Number(doc.remaining))})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Méthode de paiement *</Label>
              <Select name="payment_method" required defaultValue="CASH">
                <SelectTrigger id="payment_method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_date">Date du paiement *</Label>
              <Input
                id="payment_date"
                name="payment_date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Montant (FCFA) *
                {suggestedAmount > 0 && (
                  <span className="text-muted-foreground ml-2 font-normal">
                    (Suggéré: {formatCurrency(suggestedAmount)})
                  </span>
                )}
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                required
                defaultValue={suggestedAmount > 0 ? suggestedAmount : undefined}
                key={suggestedAmount}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input id="reference" name="reference" placeholder="N° chèque, réf. virement..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Notes additionnelles (optionnel)" rows={3} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer le paiement"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
