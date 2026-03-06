"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/format"
import { mockSales, mockSaleItems, getPatientById } from "@/lib/mock-data"
import { SaleDetailModal } from "./sale-detail-modal"
import { Calendar, Search, X } from "lucide-react"

interface FilteredSalesHistoryProps {
  initialData?: typeof mockSales
}

export function FilteredSalesHistory({ initialData }: FilteredSalesHistoryProps) {
  const [patientSearch, setPatientSearch] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("")
  const [selectedSale, setSelectedSale] = useState<typeof mockSales[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredSales = useMemo(() => {
    return mockSales.filter((sale) => {
      // Filter by patient
      if (patientSearch) {
        const patient = sale.patient_id ? getPatientById(sale.patient_id) : null
        const patientName = patient ? `${patient.first_name} ${patient.last_name}` : ""
        const patientCode = sale.patient_id || ""
        const searchLower = patientSearch.toLowerCase()

        if (!patientName.toLowerCase().includes(searchLower) && !patientCode.includes(searchLower)) {
          return false
        }
      }

      // Filter by date range
      if (startDate && new Date(sale.sale_date) < new Date(startDate)) {
        return false
      }
      if (endDate && new Date(sale.sale_date) > new Date(endDate)) {
        return false
      }

      // Filter by client type
      if (clientTypeFilter && sale.client_type !== clientTypeFilter) {
        return false
      }

      return true
    })
  }, [patientSearch, startDate, endDate, clientTypeFilter])

  const handleClearFilters = () => {
    setPatientSearch("")
    setStartDate("")
    setEndDate("")
    setClientTypeFilter("")
  }

  const getClientTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      COMPTANT: "Comptant",
      IPM_MUTUELLE: "IPM/Mutuelle",
      CLIENT_COMPTE: "Compte Client",
      CLIENT_CREDIT: "Crédit Client",
      PROFORMA: "Pro-forma",
    }
    return labels[type] || type
  }

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case "COMPTANT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "IPM_MUTUELLE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "CLIENT_CREDIT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer l'historique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Patient (code ou nom)</label>
              <Input
                placeholder="Rechercher..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date de début</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Date de fin</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Type de client</label>
              <select
                value={clientTypeFilter}
                onChange={(e) => setClientTypeFilter(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tous</option>
                <option value="COMPTANT">Comptant</option>
                <option value="IPM_MUTUELLE">IPM/Mutuelle</option>
                <option value="CLIENT_CREDIT">Crédit Client</option>
                <option value="CLIENT_COMPTE">Compte Client</option>
                <option value="PROFORMA">Pro-forma</option>
              </select>
            </div>
          </div>

          {(patientSearch || startDate || endDate || clientTypeFilter) && (
            <Button onClick={handleClearFilters} variant="outline" className="bg-transparent">
              <X className="mr-2 h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {filteredSales.length} vente{filteredSales.length !== 1 ? "s" : ""} trouvée{filteredSales.length !== 1 ? "s" : ""}
      </div>

      {/* Sales List */}
      <div className="space-y-2">
        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Aucune vente ne correspond aux critères de filtrage.
            </CardContent>
          </Card>
        ) : (
          filteredSales.map((sale) => {
            const patient = sale.patient_id ? getPatientById(sale.patient_id) : null
            const saleItems = mockSaleItems.filter((item) => item.sale_id === sale.id)

            return (
              <Card
                key={sale.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedSale(sale)
                  setIsModalOpen(true)
                }}
              >
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {/* Patient Info */}
                    <div>
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="font-medium">
                        {patient ? `${patient.first_name} ${patient.last_name}` : "Comptant"}
                      </p>
                      {patient && <p className="text-xs text-muted-foreground">{sale.patient_id}</p>}
                    </div>

                    {/* Sale Type */}
                    <div>
                      <p className="text-xs text-muted-foreground">Type de vente</p>
                      <Badge className={getClientTypeColor(sale.client_type)}>
                        {getClientTypeLabel(sale.client_type)}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(sale.sale_date)}</p>
                    </div>

                    {/* Products */}
                    <div>
                      <p className="text-xs text-muted-foreground">Produits ({saleItems.length})</p>
                      <div className="space-y-1">
                        {saleItems.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm">
                            {item.product_name} x{item.quantity}
                          </p>
                        ))}
                        {saleItems.length > 2 && <p className="text-xs text-muted-foreground">+{saleItems.length - 2} autre{saleItems.length - 2 !== 1 ? "s" : ""}</p>}
                      </div>
                    </div>

                    {/* Totals */}
                    <div>
                      <p className="text-xs text-muted-foreground">Montant total</p>
                      <p className="text-lg font-bold">{formatCurrency(sale.total_amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        Payé: {formatCurrency(sale.amount_paid)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Sale Detail Modal */}
      <SaleDetailModal
        saleId={selectedSale?.id || null}
        sale={selectedSale}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSale(null)
        }}
      />
    </div>
  )
}
