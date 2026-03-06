"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createExpense } from "@/app/app/expenses/actions"
import type { ExpenseCategory, ExpenseType } from "@/lib/types"

const expenseTypes: { value: ExpenseType; label: string }[] = [
  { value: "RENT", label: "Loyer" },
  { value: "SALARY", label: "Salaires" },
  { value: "ELECTRICITY", label: "Électricité" },
  { value: "WATER", label: "Eau" },
  { value: "INTERNET", label: "Internet" },
  { value: "PHONE", label: "Téléphone" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "CLEANING", label: "Nettoyage" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "OFFICE_SUPPLIES", label: "Fournitures de bureau" },
  { value: "BANK_FEES", label: "Frais bancaires" },
  { value: "TAXES", label: "Taxes" },
  { value: "INSURANCE", label: "Assurance" },
  { value: "MARKETING", label: "Marketing" },
  { value: "TRAINING", label: "Formation" },
  { value: "OTHER", label: "Autres" },
]

interface ExpenseFormProps {
  categories: ExpenseCategory[]
}

export function ExpenseForm({ categories }: ExpenseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      expense_type: formData.get("expense_type") as ExpenseType,
      description: formData.get("description") as string,
      amount: Number(formData.get("amount")),
      expense_date: formData.get("expense_date") as string,
      expense_category_id: (formData.get("expense_category_id") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      await createExpense(data)
      toast.success("Dépense créée avec succès")
      router.push("/app/expenses")
    } catch {
      toast.error("Erreur lors de la création de la dépense")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Informations de la dépense</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expense_type">Type de dépense *</Label>
              <Select name="expense_type" required>
                <SelectTrigger id="expense_type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense_date">Date *</Label>
              <Input
                id="expense_date"
                name="expense_date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input id="description" name="description" placeholder="Description de la dépense" required />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input id="amount" name="amount" type="number" min="1" step="1" placeholder="0" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense_category_id">Catégorie comptable</Label>
              <Select name="expense_category_id">
                <SelectTrigger id="expense_category_id">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.code} - {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {isSubmitting ? "Enregistrement..." : "Créer la dépense"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
