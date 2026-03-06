'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/format'
import { mockSaleItems, getPatientById, getProductById, mockStockQuantities } from '@/lib/mock-data'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SaleDetailModalProps {
  saleId: string | null
  sale: any
  isOpen: boolean
  onClose: () => void
}

export function SaleDetailModal({ saleId, sale, isOpen, onClose }: SaleDetailModalProps) {
  if (!sale) return null

  const saleItems = mockSaleItems.filter((item) => item.sale_id === sale.id)
  const patient = sale.patient_id ? getPatientById(sale.patient_id) : null

  const getClientTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      COMPTANT: 'Comptant',
      IPM_MUTUELLE: 'IPM/Mutuelle',
      CLIENT_COMPTE: 'Compte Client',
      CLIENT_CREDIT: 'Crédit Client',
      PROFORMA: 'Pro-forma',
    }
    return labels[type] || type
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Rupture', color: 'bg-red-100 text-red-800 dark:bg-red-900' }
    if (quantity < 10) return { label: 'Faible', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900' }
    return { label: 'OK', color: 'bg-green-100 text-green-800 dark:bg-green-900' }
  }

  const calculateTotalBeforeDiscount = () => {
    return saleItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Détail de la vente
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Vente du {formatDate(sale.sale_date)} - N° {sale.sale_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sale Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Patient</p>
                  <p className="text-sm font-medium">
                    {patient
                      ? `${patient.first_name} ${patient.last_name}`
                      : 'Vente comptant'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Type de vente</p>
                  <Badge className="mt-1">{getClientTypeLabel(sale.client_type)}</Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Statut</p>
                  <Badge
                    variant="outline"
                    className="mt-1"
                  >
                    {sale.is_validated ? 'Validée' : 'En attente'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Caisse</p>
                  <p className="text-sm">{sale.cash_register_id || 'Par défaut'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Sold */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produits vendus ({saleItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saleItems.map((item) => {
                  const product = getProductById(item.product_id)
                  const currentStock = mockStockQuantities.get(item.product_id) || 0
                  const stockStatus = getStockStatus(currentStock)

                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Code: {product?.code || 'N/A'}
                          </p>
                        </div>
                        <Badge variant="outline">{item.quantity} unité(s)</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">PU</p>
                          <p className="font-medium">{formatCurrency(item.unit_price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Remise</p>
                          <p className="font-medium">
                            {item.discount_percentage > 0
                              ? `-${item.discount_percentage}%`
                              : 'Aucune'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sous-total</p>
                          <p className="font-bold">
                            {formatCurrency(
                              item.unit_price * item.quantity *
                                (1 - item.discount_percentage / 100)
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Current Stock Info */}
                      <div className="bg-muted p-3 rounded-md border border-muted-foreground/20">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Stock actuel
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {currentStock} unité{currentStock !== 1 ? 's' : ''}
                          </span>
                          <Badge
                            className={`${stockStatus.color}`}
                          >
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Totals Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm text-muted-foreground">Sous-total</span>
                <span className="font-medium">{formatCurrency(calculateTotalBeforeDiscount())}</span>
              </div>

              {sale.discount_amount > 0 && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Remise globale</span>
                  <span className="font-medium text-red-600">-{formatCurrency(sale.discount_amount)}</span>
                </div>
              )}

              {sale.ipm_amount > 0 && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">IPM/Mutuelle</span>
                  <span className="font-medium">{formatCurrency(sale.ipm_amount)}</span>
                </div>
              )}

              {sale.patient_amount > 0 && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-muted-foreground">Part patient</span>
                  <span className="font-medium">{formatCurrency(sale.patient_amount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-base font-bold pt-2">
                <span>Montant total</span>
                <span>{formatCurrency(sale.total_amount)}</span>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t">
                <span className="text-muted-foreground">Montant payé</span>
                <span className="font-medium">{formatCurrency(sale.amount_paid)}</span>
              </div>

              {sale.change_amount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Monnaie</span>
                  <span className="font-medium text-green-600">{formatCurrency(sale.change_amount)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
