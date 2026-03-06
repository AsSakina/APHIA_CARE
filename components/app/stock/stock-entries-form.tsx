"use client"

import React, { useRef } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"
import { createStockEntry } from "@/app/app/stock/actions"
import { mockProducts } from "@/lib/mock-data"

export function StockEntriesForm() {
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState("")
  const [formData, setFormData] = useState({
    productId: "",
    quantityReceived: "",
    unitPrice: "",
    supplier: "",
    invoiceNumber: "",
    entryDate: new Date().toISOString().split("T")[0],
  })

  // Barcode scanner
  useBarcodeScanner({
    onScan: (barcode) => {
      const product = mockProducts.find((p) => p.code === barcode)
      if (product) {
        setFormData({ ...formData, productId: product.id })
        toast.success(`Produit sélectionné: ${product.name}`)
      } else {
        toast.error(`Produit non trouvé: ${barcode}`)
      }
      setBarcodeInput("")
      setTimeout(() => barcodeInputRef.current?.focus(), 100)
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const product = mockProducts.find((p) => p.id === formData.productId)
    if (!product || !formData.quantityReceived || !formData.unitPrice) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      setIsSubmitting(false)
      return
    }

    const result = await createStockEntry(
      formData.productId,
      product.name,
      Number.parseInt(formData.quantityReceived),
      Number.parseFloat(formData.unitPrice),
      formData.supplier || undefined,
      formData.invoiceNumber || undefined,
      formData.entryDate,
    )

    if (result.success) {
      toast.success("Entrée de stock créée")
      setFormData({
        productId: "",
        quantityReceived: "",
        unitPrice: "",
        supplier: "",
        invoiceNumber: "",
        entryDate: new Date().toISOString().split("T")[0],
      })
    } else {
      toast.error(result.error || "Erreur lors de la création")
    }
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle entrée de stock</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hidden Barcode Input */}
        <Input
          ref={barcodeInputRef}
          type="hidden"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          data-barcode-input="true"
          autoFocus
        />
        
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
              <Label>Quantité reçue *</Label>
              <Input
                type="number"
                min="1"
                value={formData.quantityReceived}
                onChange={(e) => setFormData({ ...formData, quantityReceived: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Prix unitaire (FCFA) *</Label>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Fournisseur</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nom du fournisseur"
              />
            </div>

            <div className="space-y-2">
              <Label>Numéro de facture</Label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="Ex: FAC-2024-001"
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Création..." : "Créer l'entrée"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
