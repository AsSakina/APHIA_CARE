"use client"

import { useState, useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Lock, Unlock, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/format"
import {
  getSalesHistoryByRegisterId,
  searchSalesHistory,
  getAllSalesHistory,
} from "@/app/app/pos/history/actions"
import type { CashRegister, SalesHistoryRecord } from "@/lib/types"

interface CashRegisterDetailsProps {
  initialRegisters: CashRegister[]
  initialSalesHistory: SalesHistoryRecord[]
}

export function CashRegisterDetails({
  initialRegisters,
  initialSalesHistory,
}: CashRegisterDetailsProps) {
  const [selectedRegisterId, setSelectedRegisterId] = useState<string>(
    initialRegisters[0]?.id || ""
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [salesHistory, setSalesHistory] = useState<SalesHistoryRecord[]>(
    initialSalesHistory
  )
  const [isPending, startTransition] = useTransition()

  const selectedRegister = initialRegisters.find((r) => r.id === selectedRegisterId)

  async function handleRegisterChange(registerId: string) {
    setSelectedRegisterId(registerId)
    setSearchQuery("")
    startTransition(async () => {
      const records = await getSalesHistoryByRegisterId(registerId)
      setSalesHistory(records)
    })
  }

  async function handleSearch(query: string) {
    setSearchQuery(query)
    startTransition(async () => {
      if (!query.trim()) {
        if (selectedRegisterId) {
          const records = await getSalesHistoryByRegisterId(selectedRegisterId)
          setSalesHistory(records)
        } else {
          const records = await getAllSalesHistory()
          setSalesHistory(records)
        }
      } else {
        const records = await searchSalesHistory(query)
        setSalesHistory(records)
      }
    })
  }

  const registerSales = selectedRegisterId
    ? salesHistory.filter((s) => s.register_id === selectedRegisterId)
    : salesHistory

  const totalSales = registerSales.length
  const totalRevenue = registerSales.reduce((sum, s) => sum + s.total_amount, 0)
  const totalCollected = registerSales.reduce((sum, s) => sum + s.amount_paid, 0)
  const totalDiscount = registerSales.reduce((sum, s) => sum + s.discount_amount, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="size-4" />
              Nombre de ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">avant remises</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="size-4" />
              Collecté
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</div>
            <p className="text-xs text-muted-foreground">montant reçu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="size-4" />
              Remise totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalDiscount)}</div>
            <p className="text-xs text-muted-foreground">réductions appliquées</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Caisse</label>
              <Select value={selectedRegisterId} onValueChange={handleRegisterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une caisse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les caisses</SelectItem>
                  {initialRegisters.map((register) => (
                    <SelectItem key={register.id} value={register.id}>
                      {register.register_number} - {register.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Recherche (Patient)</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Code, Prénom ou Nom du patient"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Historique des ventes
            {selectedRegister && ` - ${selectedRegister.register_number}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending && <div className="text-center text-muted-foreground">Chargement...</div>}
          {!isPending && registerSales.length === 0 && (
            <div className="text-center text-muted-foreground">Aucune vente trouvée</div>
          )}
          {!isPending && registerSales.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">N° Vente</th>
                    <th className="px-4 py-2 text-left font-medium">Patient</th>
                    <th className="px-4 py-2 text-left font-medium">Type Client</th>
                    <th className="px-4 py-2 text-left font-medium">Produits</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                    <th className="px-4 py-2 text-right font-medium">Payé</th>
                    <th className="px-4 py-2 text-left font-medium">Paiement</th>
                    <th className="px-4 py-2 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registerSales.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2 font-mono text-xs">{record.sale_number}</td>
                      <td className="px-4 py-2">
                        <div className="text-sm">
                          <div className="font-medium">
                            {record.patient_first_name} {record.patient_last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{record.patient_code}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="outline">{record.client_type}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <div className="max-w-xs">
                          {record.products_sold.slice(0, 2).map((p, idx) => (
                            <div key={idx} className="text-xs">
                              {p.product_name} (x{p.quantity})
                            </div>
                          ))}
                          {record.products_sold.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{record.products_sold.length - 2} plus...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatCurrency(record.total_amount)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatCurrency(record.amount_paid)}
                      </td>
                      <td className="px-4 py-2 text-sm">{record.payment_method || "-"}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">
                        {new Date(record.sale_date).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
