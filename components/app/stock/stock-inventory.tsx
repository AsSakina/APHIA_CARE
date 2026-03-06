"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, AlertTriangle, TrendingUp, TrendingDown, Edit2, Check, X } from "lucide-react"
import { mockProducts, mockStockQuantities } from "@/lib/mock-data"
import { adjustStockQuantity } from "@/app/app/stock/actions"
import { toast } from "sonner"

interface StockItem {
  product_id: string
  product_code: string
  product_name: string
  category: string
  unit_price: number
  purchase_price: number
  current_stock: number
  total_in: number
  total_out: number
}

function getStockInventory(): StockItem[] {
  return mockProducts
    .filter((p) => p.is_active)
    .map((p) => {
      const currentStock = mockStockQuantities.get(p.id) || 0
      return {
        product_id: p.id,
        product_code: p.code || "",
        product_name: p.name,
        category: p.category || "Non catégorisé",
        unit_price: p.unit_price,
        purchase_price: p.purchase_price,
        current_stock: currentStock,
        total_in: currentStock + 50, // Mock: assume some entries
        total_out: 50, // Mock: assume some exits
      }
    })
}

interface StockItemEditProps {
  item: StockItem
  onUpdate: (productId: string, newQuantity: number) => void
}

function StockItemRow({ item, onUpdate }: StockItemEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.current_stock.toString())

  const stockValue = item.current_stock * item.purchase_price
  let statusColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"

  if (item.current_stock <= 0) {
    statusColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  } else if (item.current_stock <= 5) {
    statusColor = "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
  }

  async function handleSave() {
    const newQuantity = Number.parseInt(editValue)
    if (Number.isNaN(newQuantity)) {
      toast.error("Quantité invalide")
      return
    }

    const result = await adjustStockQuantity(item.product_id, newQuantity)
    if (result.success) {
      toast.success("Stock mis à jour")
      onUpdate(item.product_id, newQuantity)
      setIsEditing(false)
    } else {
      toast.error(result.error || "Erreur lors de la mise à jour")
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center justify-between gap-2 p-4 border rounded-md bg-muted">
        <div className="flex-1">
          <p className="font-medium">{item.product_name}</p>
          <p className="text-sm text-muted-foreground">{item.product_code}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24"
            min="0"
          />
          <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
            <Check className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsEditing(false)
              setEditValue(item.current_stock.toString())
            }}
            className="h-8 w-8 p-0 bg-transparent"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 border rounded-md">
      <div className="flex-1">
        <p className="font-medium">{item.product_name}</p>
        <p className="text-sm text-muted-foreground">{item.product_code}</p>
      </div>
      <div className="flex items-center gap-4 text-right">
        <div>
          <p className={`text-lg font-bold rounded px-2 py-1 ${statusColor}`}>{item.current_stock}</p>
          <p className="text-xs text-muted-foreground">Stock actuel</p>
        </div>
        <div>
          <p className="text-sm font-medium">{formatCurrency(stockValue)}</p>
          <p className="text-xs text-muted-foreground">Valeur estimée</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="bg-transparent"
        >
          <Edit2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function StockInventory() {
  const [inventory, setInventory] = useState(getStockInventory())

  const handleInventoryUpdate = (productId: string, newQuantity: number) => {
    setInventory(
      inventory.map((item) =>
        item.product_id === productId ? { ...item, current_stock: newQuantity } : item,
      ),
    )
  }

  const totalProducts = inventory.length
  const totalValue = inventory.reduce((sum, item) => sum + Number(item.current_stock) * Number(item.purchase_price), 0)
  const lowStockCount = inventory.filter(
    (item) => Number(item.current_stock) <= 5 && Number(item.current_stock) > 0,
  ).length
  const outOfStockCount = inventory.filter((item) => Number(item.current_stock) <= 0).length

  // Group by category
  const byCategory = inventory.reduce(
    (acc, item) => {
      const cat = item.category || "Non catégorisé"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, StockItem[]>,
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total produits</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produits actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
            <TrendingUp className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">Au prix d'achat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock faible</CardTitle>
            <AlertTriangle className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Produits à réapprovisionner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rupture de stock</CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Produits épuisés</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory by Category */}
      {Object.entries(byCategory).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>{items.length} produits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.map((item) => (
              <StockItemRow key={item.product_id} item={item} onUpdate={handleInventoryUpdate} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
