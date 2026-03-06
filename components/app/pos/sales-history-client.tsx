"use client"

import { useState, useTransition } from "react"
import { SalesHistoryList } from "./sales-history-list"
import { getSales } from "@/app/app/pos/history/actions"
import type { Sale, Ipm, Patient } from "@/lib/types"

interface SalesHistoryClientProps {
  initialSales: Sale[]
  ipms: Ipm[]
  patients: Patient[]
}

export function SalesHistoryClient({ initialSales, ipms, patients }: SalesHistoryClientProps) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [isPending, startTransition] = useTransition()

  async function handleFilter(filters: {
    startDate?: string
    endDate?: string
    patientId?: string
    ipmId?: string
    isIpm?: boolean
  }) {
    startTransition(async () => {
      const newSales = await getSales({
        startDate: filters.startDate,
        endDate: filters.endDate,
        patientId: filters.patientId === "all" ? undefined : filters.patientId,
        ipmId: filters.ipmId === "all" ? undefined : filters.ipmId,
        isIpm: filters.isIpm,
      })
      setSales(newSales)
    })
  }

  return (
    <div className={isPending ? "opacity-50" : ""}>
      <SalesHistoryList sales={sales} ipms={ipms} patients={patients} onFilter={handleFilter} />
    </div>
  )
}
