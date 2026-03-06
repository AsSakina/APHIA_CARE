import { Suspense } from "react"
import { headers } from "next/headers"
import { SimplifiedAccounting } from "@/components/app/accounting/simplified-accounting"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default async function AccountingPage() {
  await headers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Comptabilité simplifiée</h1>
        <p className="text-muted-foreground">Vue d'ensemble des finances opérationnelles</p>
      </div>
      <Suspense fallback={<ExpensesListSkeleton />}>
        <SimplifiedAccounting />
      </Suspense>
    </div>
  )
}
