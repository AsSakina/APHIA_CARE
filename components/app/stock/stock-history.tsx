'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react'
import { mockProducts, mockStockQuantities } from '@/lib/mock-data'

export function StockHistoryPage() {
  const [stockHistory, setStockHistory] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'status'>('quantity')

  useEffect(() => {
    // Build stock history from current data
    const history = mockProducts.map((product) => {
      const quantity = mockStockQuantities.get(product.id) || 0
      const isLow = quantity < 10
      const isOut = quantity === 0

      return {
        id: product.id,
        name: product.name,
        dosage: product.dosage,
        quantity,
        status: isOut ? 'out' : isLow ? 'low' : 'ok',
      }
    })

    // Sort history
    if (sortBy === 'quantity') {
      history.sort((a, b) => a.quantity - b.quantity)
    } else if (sortBy === 'name') {
      history.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'status') {
      const statusOrder = { out: 0, low: 1, ok: 2 }
      history.sort((a, b) => statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder])
    }

    setStockHistory(history)
  }, [sortBy])

  const lowStockCount = stockHistory.filter((s) => s.status === 'low').length
  const outOfStockCount = stockHistory.filter((s) => s.status === 'out').length
  const totalValue = stockHistory.reduce((sum, s) => sum + s.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total en Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue}</div>
            <p className="text-xs text-muted-foreground mt-1">unités</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              &lt; 10 unités
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rupture de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">0 unité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockHistory.length}</div>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Details Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>État du Stock</CardTitle>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded border border-input px-3 py-1 text-sm"
            >
              <option value="quantity">Par Quantité</option>
              <option value="name">Par Nom</option>
              <option value="status">Par Statut</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Produit</th>
                  <th className="text-left py-2 px-2">Dosage</th>
                  <th className="text-center py-2 px-2">Quantité</th>
                  <th className="text-center py-2 px-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-2 font-medium">{item.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {item.dosage}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={
                          item.status === 'out'
                            ? 'text-destructive font-bold'
                            : item.status === 'low'
                              ? 'text-amber-600 font-bold'
                              : 'text-green-600'
                        }
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {item.status === 'out' ? (
                        <Badge variant="destructive" className="flex items-center justify-center gap-1 w-full">
                          <AlertCircle className="h-3 w-3" />
                          Rupture
                        </Badge>
                      ) : item.status === 'low' ? (
                        <Badge variant="outline" className="flex items-center justify-center gap-1 w-full bg-amber-50 text-amber-700 border-amber-200">
                          <TrendingDown className="h-3 w-3" />
                          Faible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center justify-center gap-1 w-full bg-green-50 text-green-700 border-green-200">
                          <TrendingUp className="h-3 w-3" />
                          OK
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
