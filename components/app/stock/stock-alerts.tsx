'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, TrendingDown } from 'lucide-react'
import { getStockAlerts } from '@/app/app/stock/actions'
import Link from 'next/link'

export function StockAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getStockAlerts()
        setAlerts(data || [])
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical')
  const warningAlerts = alerts.filter((a) => a.severity === 'warning')

  if (isLoading) {
    return <div className="p-4">Chargement des alertes...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Alertes Critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ruptures de stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-amber-600" />
              Alertes d'Avertissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Stock faible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total d'Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Actives</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Ruptures de Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/30 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-destructive">{alert.product_name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    asChild
                  >
                    <Link href={`/app/stock?product=${alert.product_id}`}>
                      Réapprovisionner
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warningAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-amber-100/50 border border-amber-300 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-amber-900">{alert.product_name}</div>
                    <div className="text-sm text-amber-700 mt-1">
                      {alert.message}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="text-amber-700 border-amber-300 hover:bg-amber-100 bg-transparent"
                  >
                    <Link href={`/app/stock?product=${alert.product_id}`}>
                      Commander
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">Aucune alerte de stock</div>
              <p className="text-sm text-muted-foreground">
                Tous vos produits sont bien stockés
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
