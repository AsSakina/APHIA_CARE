"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCashSessions } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import { Calendar, Clock, DollarSign } from "lucide-react"

export function CashSessionsHistory() {
  const closedSessions = mockCashSessions.filter(s => s.status === "closed")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Historique des Sessions ({closedSessions.length})</h3>
        <div className="space-y-2">
          {closedSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune session fermée</p>
          ) : (
            closedSessions.map((session) => {
              const difference = (session.closing_balance || 0) - session.opening_balance
              const isDiscrepancy = Math.abs(difference) > 0

              return (
                <Card key={session.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{session.register_number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Session fermée le {formatDate(session.closed_at || "")}
                        </p>
                      </div>
                      <Badge variant={isDiscrepancy ? "destructive" : "secondary"}>
                        {isDiscrepancy ? "Écart détecté" : "Équilibré"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Ouverture</p>
                        <p className="font-semibold text-sm">{formatCurrency(session.opening_balance)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fermeture</p>
                        <p className="font-semibold text-sm">{formatCurrency(session.closing_balance || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Différence</p>
                        <p className={`font-semibold text-sm ${difference >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(difference)}
                        </p>
                      </div>
                      <div className="flex items-end">
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          Voir Détails
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Ouvert par: {session.opened_by}</span>
                        <span>Fermé par: {session.closed_by}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
