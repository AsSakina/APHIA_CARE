"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, FileText, Search, Filter, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Sale, ClientType, Ipm, Patient } from "@/lib/types"

interface SalesHistoryListProps {
  sales: Sale[]
  ipms?: Ipm[]
  patients?: Patient[]
  onFilter?: (filters: {
    startDate?: string
    endDate?: string
    patientId?: string
    ipmId?: string
    isIpm?: boolean
  }) => void
}

export function SalesHistoryList({ sales, ipms = [], patients = [], onFilter }: SalesHistoryListProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedIpm, setSelectedIpm] = useState("")
  const [ipmFilter, setIpmFilter] = useState<string>("all") // "all", "ipm", "non-ipm"
  const [searchQuery, setSearchQuery] = useState("")

  const clientTypeLabels: Record<ClientType, string> = {
    COMPTANT: "Comptant",
    IPM_MUTUELLE: "IPM",
    CLIENT_COMPTE: "Compte",
    CLIENT_CREDIT: "Crédit",
    PROFORMA: "Pro-forma",
  }

  const clientTypeColors: Record<ClientType, string> = {
    COMPTANT: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    IPM_MUTUELLE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    CLIENT_COMPTE: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    CLIENT_CREDIT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    PROFORMA: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  }

  function handleApplyFilters() {
    if (onFilter) {
      onFilter({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        patientId: selectedPatient || undefined,
        ipmId: selectedIpm || undefined,
        isIpm: ipmFilter === "ipm" ? true : ipmFilter === "non-ipm" ? false : undefined,
      })
    }
  }

  function handleClearFilters() {
    setStartDate("")
    setEndDate("")
    setSelectedPatient("")
    setSelectedIpm("")
    setIpmFilter("all")
    setSearchQuery("")
    if (onFilter) {
      onFilter({})
    }
  }

  // Client-side search filtering
  const filteredSales = sales.filter((sale) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      sale.sale_number.toLowerCase().includes(query) ||
      sale.patient_name?.toLowerCase().includes(query) ||
      sale.ipm_name?.toLowerCase().includes(query)
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historique des ventes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 size-4" />
            Filtres
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 rounded-lg border bg-muted/50 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date début</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date fin</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              {/* IPM Filter */}
              <div className="space-y-2">
                <Label>Type de vente</Label>
                <Select value={ipmFilter} onValueChange={setIpmFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les ventes</SelectItem>
                    <SelectItem value="ipm">Ventes IPM uniquement</SelectItem>
                    <SelectItem value="non-ipm">Ventes hors IPM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* IPM Selection */}
              {ipmFilter === "ipm" && ipms.length > 0 && (
                <div className="space-y-2">
                  <Label>IPM spécifique</Label>
                  <Select value={selectedIpm} onValueChange={setSelectedIpm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les IPM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les IPM</SelectItem>
                      {ipms.map((ipm) => (
                        <SelectItem key={ipm.id} value={ipm.id}>
                          {ipm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Patient Selection */}
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les patients</SelectItem>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Réinitialiser
              </Button>
              <Button size="sm" onClick={handleApplyFilters}>
                Appliquer
              </Button>
            </div>
          </div>
        )}

        {/* Quick Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par n° vente, patient, IPM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Vente</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Payé</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune vente trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {sale.is_proforma && <FileText className="size-4 text-muted-foreground" />}
                      {sale.ipm_id && <Building2 className="size-4 text-blue-500" />}
                      {sale.sale_number}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(sale.sale_date)}</TableCell>
                  <TableCell>
                    <Badge className={clientTypeColors[sale.client_type]}>{clientTypeLabels[sale.client_type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      {sale.patient_name || (sale.client_type === "COMPTANT" ? "Client comptant" : "-")}
                      {sale.ipm_name && (
                        <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">({sale.ipm_name})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.total_amount)}</TableCell>
                  <TableCell className="text-right">
                    <span className={sale.amount_paid < sale.patient_amount ? "text-orange-600" : "text-green-600"}>
                      {formatCurrency(sale.amount_paid)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/app/pos/history/${sale.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
