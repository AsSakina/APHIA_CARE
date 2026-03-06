"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Filter, Download, Phone, Mail } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import Link from "next/link"

interface Receivable {
  id: string
  client_name: string
  client_type: "CREDIT" | "IPM"
  amount_due: number
  amount_paid: number
  balance: number
  date: string
  status: "pending" | "partial" | "overdue"
  phone?: string
  email?: string
}

const mockReceivables: Receivable[] = [
  {
    id: "rec-001",
    client_name: "Patients Privés - Crédit",
    client_type: "CREDIT",
    amount_due: 150000,
    amount_paid: 50000,
    balance: 100000,
    date: "2025-01-15",
    status: "partial",
    phone: "+250788123456",
    email: "patient@example.com",
  },
  {
    id: "rec-002",
    client_name: "RAMA MUTUELLE",
    client_type: "IPM",
    amount_due: 280000,
    amount_paid: 280000,
    balance: 0,
    date: "2025-01-10",
    status: "pending",
  },
  {
    id: "rec-003",
    client_name: "Clients Crédit Divers",
    client_type: "CREDIT",
    amount_due: 85000,
    amount_paid: 0,
    balance: 85000,
    date: "2024-12-20",
    status: "overdue",
    phone: "+250789654321",
  },
  {
    id: "rec-004",
    client_name: "CARABANK ASSURANCE",
    client_type: "IPM",
    amount_due: 320000,
    amount_paid: 180000,
    balance: 140000,
    date: "2024-12-15",
    status: "partial",
  },
  {
    id: "rec-005",
    client_name: "Entreprise XYZ - Crédit",
    client_type: "CREDIT",
    amount_due: 120000,
    amount_paid: 30000,
    balance: 90000,
    date: "2024-11-30",
    status: "overdue",
  },
]

export default function ReceivablesPage() {
  const [filter, setFilter] = useState<"all" | "ipm" | "credit">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = mockReceivables.filter((item) => {
    if (filter !== "all" && item.client_type !== (filter === "ipm" ? "IPM" : "CREDIT")) {
      return false
    }
    return item.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const stats = {
    total_due: filtered.reduce((sum, item) => sum + item.amount_due, 0),
    total_paid: filtered.reduce((sum, item) => sum + item.amount_paid, 0),
    total_balance: filtered.reduce((sum, item) => sum + item.balance, 0),
    overdue_count: filtered.filter((item) => item.status === "overdue").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">En attente</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Partielle</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Échue</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Créances clients</h1>
        <p className="text-muted-foreground">Suivi complet des créances clients, IPM/Mutuelles et revenus</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Montant dû total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_due)}</div>
            <p className="text-xs text-muted-foreground">De tous les clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Montant payé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.total_paid)}</div>
            <p className="text-xs text-muted-foreground">{Math.round((stats.total_paid / stats.total_due) * 100)}% payé</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Solde restant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.total_balance)}</div>
            <p className="text-xs text-muted-foreground">À recouvrir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Créances échues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue_count}</div>
            <p className="text-xs text-muted-foreground">Nécessitent action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">Tous ({mockReceivables.length})</TabsTrigger>
          <TabsTrigger value="ipm">IPM/Mutuelles ({mockReceivables.filter((i) => i.client_type === "IPM").length})</TabsTrigger>
          <TabsTrigger value="credit">Crédit clients ({mockReceivables.filter((i) => i.client_type === "CREDIT").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune créance trouvée</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((receivable) => (
                <Card key={receivable.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{receivable.client_name}</h3>
                          <Badge variant="secondary">
                            {receivable.client_type === "IPM" ? "IPM/Mutuelle" : "Crédit"}
                          </Badge>
                          {getStatusBadge(receivable.status)}
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center justify-between">
                            <span>Montant dû:</span>
                            <span className="font-medium text-foreground">{formatCurrency(receivable.amount_due)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Montant payé:</span>
                            <span className="font-medium text-green-600">{formatCurrency(receivable.amount_paid)}</span>
                          </div>
                          <div className="flex items-center justify-between border-t pt-2">
                            <span className="font-semibold">Solde:</span>
                            <span className="font-bold text-lg text-red-600">{formatCurrency(receivable.balance)}</span>
                          </div>
                          <div className="text-xs">Date: {new Date(receivable.date).toLocaleDateString("fr-FR")}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          Paiement
                        </Button>
                        {receivable.phone && (
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Phone className="h-4 w-4 mr-1" />
                            Appel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
