'use client'

import React from "react"

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader } from 'lucide-react'
import { recordStockEntry } from '@/app/app/pos/actions'
import type { Product } from '@/lib/types'

interface StockEntryFormProps {
  products: Product[]
  onSuccess?: () => void
}

export function StockEntryForm({ products, onSuccess }: StockEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct) {
      toast.error('Veuillez sélectionner un produit')
      return
    }

    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Veuillez entrer une quantité valide')
      return
    }

    if (!reference.trim()) {
      toast.error('Veuillez entrer une référence (BL, etc)')
      return
    }

    setIsLoading(true)

    try {
      const result = await recordStockEntry({
        product_id: selectedProduct.id,
        quantity: parseInt(quantity),
        reference: reference.trim(),
        notes: notes.trim(),
      })

      if (result.success) {
        toast.success(`${quantity} ${selectedProduct.name} ajouté(s) au stock`)
        setSelectedProduct(null)
        setQuantity('')
        setReference('')
        setNotes('')
        onSuccess?.()
      } else {
        toast.error(result.error || 'Erreur lors de l\'enregistrement')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement du stock')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une Entrée de Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Produit</label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const prod = products.find((p) => p.id === e.target.value)
                setSelectedProduct(prod || null)
              }}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Sélectionner un produit...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.dosage})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantité</label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Ex: 50"
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium mb-2">Référence (BL, etc)</label>
            <Input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: BL-2025-001"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optionnel)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Livraison Pharmacie Hub, lot 12345"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !selectedProduct}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer le Stock'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
