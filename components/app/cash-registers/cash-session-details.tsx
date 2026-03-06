"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCashSessions, mockCashMovements } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import { ArrowUpRight, ArrowDownLeft, Banknote, CreditCard, Smartphone } from "lucide-react"

export function CashSessionDetails({ sessionId }: { sessionId?: string }) {
  const session = sessionId ? mockCashSessions.find(s => s.id === sessionId) : mockCashSessions.find(s => s.status === "open")
  const movements = sessionId ? mockCashMovements.filter(m => m.session_id === sessionId) : []

  if (!session) {
    return <div className="text-sm text-muted-foreground">Aucune session active</div>
  }

  const cashMovements = movements.filter(m => m.payment_method === "CASH")
  const cardMovements = movements.filter(m => m.payment_method === "CARD")
  const mobileMovements = movements.filter(m => m.payment_method === "MOBILE_MONEY")

  const totalCash = cashMovements.reduce((sum, m) => sum + m.amount, 0)
  const totalCard = cardMovements.reduce((sum, m) => sum + m.amount, 0)
  const totalMobile = mobileMovements.reduce((sum, m) => sum + m.amount, 0)

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Session {session.register_number}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ouvert le {formatDate(session.opened_at)} par {session.opened_by}
              </p>
            </div>
            <Badge variant={session.status === "open" ? "default" : "secondary"}>
              {session.status === "open" ? "En cours" : "Fermée"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Solde initial</p>
              <p className="text-lg font-semibold">{formatCurrency(session.opening_balance)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Solde actuel</p>
              <p className="text-lg font-semibold">{formatCurrency(session.closing_balance || session.opening_balance)}</p>
            </div>
          </div>
          {session.closed_at && (
            <p className="text-xs text-muted-foreground">
              Fermée le {formatDate(session.closed_at)} par {session.closed_by}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm">Espèces</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalCash)}</p>
            <p className="text-xs text-muted-foreground mt-1">{cashMovements.length} mouvements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm">Cartes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalCard)}</p>
            <p className="text-xs text-muted-foreground mt-1">{cardMovements.length} mouvements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm">Mobile Money</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(totalMobile)}</p>
            <p className="text-xs text-muted-foreground mt-1">{mobileMovements.length} mouvements</p>
          </CardContent>
        </Card>
      </div>

      {/* Movements History */}
      <Card>
        <CardHeader>
          <CardTitle>Mouvements de caisse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun mouvement enregistré</p>
            ) : (
              movements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {movement.type === "sale" ? (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{movement.type}</p>
                      <p className="text-xs text-muted-foreground">{movement.description || formatDate(movement.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(movement.amount)}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
