'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockSales, mockSaleItems, mockProducts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/format'
import { BarChart, BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react'

export function SalesReportPage() {
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    // Build sales report
    const totalSales = mockSales.length
    const totalRevenue = mockSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0)
    const totalItems = mockSaleItems.length

    const topProducts = mockProducts
      .map((product) => {
        const itemsSold = mockSaleItems
          .filter((si) => si.product_id === product.id)
          .reduce((sum, si) => sum + si.quantity, 0)
        const revenue = mockSaleItems
          .filter((si) => si.product_id === product.id)
          .reduce((sum, si) => sum + (si.unit_price * si.quantity), 0)

        return {
          id: product.id,
          name: product.name,
          dosage: product.dosage,
          itemsSold,
          revenue,
        }
      })
      .filter((p) => p.itemsSold > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    const recentSales = mockSales
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((sale) => ({
        ...sale,
        items: mockSaleItems.filter((si) => si.sale_id === sale.id),
      }))

    setReportData({
      totalSales,
      totalRevenue,
      totalItems,
      topProducts,
      recentSales,
    })
  }, [])

  if (!reportData) {
    return <div>Chargement...</div>
  }

  const avgSaleValue = reportData.totalSales > 0 ? reportData.totalRevenue / reportData.totalSales : 0

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Total de Ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenu Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(reportData.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Moy: {formatCurrency(avgSaleValue)}/vente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Articles Vendus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Moy: {(reportData.totalItems / reportData.totalSales).toFixed(1)}/vente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taux Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les paniers finalisés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Produits Vendus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.topProducts.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.dosage}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{product.itemsSold}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>10 Dernières Ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.recentSales.map((sale: any) => (
              <div key={sale.id} className="flex items-center justify-between p-3 border-b pb-3 last:border-b-0">
                <div>
                  <div className="font-medium">Vente #{sale.sale_number}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString('fr-FR')} à{' '}
                    {new Date(sale.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs mt-1">
                    {sale.items.length} article{sale.items.length > 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">
                    {formatCurrency(sale.total_amount)}
                  </div>
                  <Badge variant={sale.status === 'completed' ? 'default' : 'outline'}>
                    {sale.status === 'completed' ? 'Finalisée' : 'En attente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
