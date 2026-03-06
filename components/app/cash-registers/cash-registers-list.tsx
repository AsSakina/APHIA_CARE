"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCashRegisters, mockCashSessions } from "@/lib/mock-data"
import { formatCurrency, formatDate } from "@/lib/format"
import { Clock, DollarSign, User } from "lucide-react"

export function CashRegistersList() {
  const activeSessions = mockCashSessions.filter(s => s.status === "open")
  const closedSessions = mockCashSessions.filter(s => s.status === "closed")

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Caisses Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCashRegisters.filter(r => r.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Sessions ouvertes: {activeSessions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solde Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(activeSessions.reduce((sum, s) => sum + (s.closing_balance || s.opening_balance), 0))}
            </div>
            <p className="text-xs text-muted-foreground">Solde de toutes les caisses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Fermées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedSessions.length}</div>
            <p className="text-xs text-muted-foreground">Historique des caisses</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Registers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Caisses Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCashRegisters.map((register) => {
            const session = activeSessions.find(s => s.register_id === register.id)
            return (
              <Card key={register.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{register.name}</CardTitle>
                      <CardDescription>{register.register_number}</CardDescription>
                    </div>
                    <Badge variant={register.is_active ? "default" : "secondary"}>
                      {register.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{register.managers.join(", ")}</span>
                    </div>
                    {session && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Ouvert depuis {formatDate(session.opened_at)}</span>
                      </div>
                    )}
                  </div>
                  
                  {session && (
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Solde:</span>
                        <span className="font-semibold">{formatCurrency(session.closing_balance || session.opening_balance)}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          Voir Mouvements
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1">
                          Fermer Caisse
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!session && (
                    <Button size="sm" className="w-full">
                      Ouvrir Caisse
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
