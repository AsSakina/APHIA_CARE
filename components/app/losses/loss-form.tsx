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
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"
import { createLoss } from "@/app/app/losses/actions"
import type { Product, AdjustmentReason } from "@/lib/types"

const adjustmentReasons: { value: AdjustmentReason; label: string }[] = [
  { value: "EXPIRED", label: "Produit périmé" },
  { value: "DAMAGED", label: "Produit endommagé" },
  { value: "VOL_PERDU", label: "Vol ou perdu de vue" }, // Renamed from THEFT
  { value: "DON", label: "Don" }, // New reason added
  { value: "OTHER", label: "Autre" },
]

interface LossFormProps {
  products: Product[]
}

export function LossForm({ products }: LossFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitCost, setUnitCost] = useState(0)

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId)
      if (product) setUnitCost(Number(product.purchase_price))
    }
  }, [selectedProductId, products])

  const totalLoss = quantity * unitCost

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      product_id: selectedProductId || undefined,
      adjustment_reason: formData.get("adjustment_reason") as AdjustmentReason,
      quantity,
      unit_cost: unitCost,
      loss_date: formData.get("loss_date") as string,
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      await createLoss(data)
      toast.success("Perte enregistrée avec succès")
      router.push("/app/losses")
    } catch {
      toast.error("Erreur lors de l'enregistrement de la perte")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Informations de la perte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_id">Produit</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger id="product_id">
                  <SelectValue placeholder="Sélectionnez un produit" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.code ? `${product.code} - ` : ""}
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustment_reason">Raison *</Label>
              <Select name="adjustment_reason" required defaultValue="EXPIRED">
                <SelectTrigger id="adjustment_reason">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adjustmentReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit_cost">Coût unitaire (FCFA) *</Label>
              <Input
                id="unit_cost"
                type="number"
                min="0"
                step="1"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loss_date">Date de la perte *</Label>
              <Input
                id="loss_date"
                name="loss_date"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div className="p-4 bg-destructive/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Perte totale calculée</span>
              <span className="text-lg font-bold text-destructive">{formatCurrency(totalLoss)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Détails supplémentaires (lot, date de péremption, circonstances...)"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer la perte"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
