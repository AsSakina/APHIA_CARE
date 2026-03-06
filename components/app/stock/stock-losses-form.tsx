"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createStockLoss } from "@/app/app/stock/actions"
import { mockProducts } from "@/lib/mock-data"
import type { LossReason } from "@/lib/types"

export function StockLossesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productId: "",
    quantityLost: "",
    reason: "EXPIRED" as LossReason,
    notes: "",
    lossDate: new Date().toISOString().split("T")[0],
  })

  const lossReasons: { value: LossReason; label: string }[] = [
    { value: "EXPIRED", label: "Péremption" },
    { value: "DONATION", label: "Don" },
    { value: "THEFT_LOST", label: "Vol / Perdu de vue" },
    { value: "OTHER", label: "Autre" },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const product = mockProducts.find((p) => p.id === formData.productId)
    if (!product || !formData.quantityLost) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      setIsSubmitting(false)
      return
    }

    const result = await createStockLoss(
      formData.productId,
      product.name,
      Number.parseInt(formData.quantityLost),
      formData.reason,
      formData.notes || undefined,
      formData.lossDate,
    )

    if (result.success) {
      toast.success("Perte de stock enregistrée")
      setFormData({
        productId: "",
        quantityLost: "",
        reason: "EXPIRED",
        notes: "",
        lossDate: new Date().toISOString().split("T")[0],
      })
    } else {
      toast.error(result.error || "Erreur lors de l'enregistrement")
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle perte de stock</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Produit *</Label>
              <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.filter((p) => p.is_active).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantité perdue *</Label>
              <Input
                type="number"
                min="1"
                value={formData.quantityLost}
                onChange={(e) => setFormData({ ...formData, quantityLost: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Raison *</Label>
              <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value as LossReason })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une raison" />
                </SelectTrigger>
                <SelectContent>
                  {lossReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.lossDate}
                onChange={(e) => setFormData({ ...formData, lossDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes / Observations</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Détails supplémentaires (optionnel)..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enregistrement..." : "Enregistrer la perte"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
