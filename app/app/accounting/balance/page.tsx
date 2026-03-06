import { Suspense } from "react"
import { AccountingBalance } from "@/components/app/accounting/accounting-balance"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function BalancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Balance par catégorie</h1>
        <p className="text-muted-foreground">Soldes des comptes par catégorie comptable</p>
      </div>
      <Suspense fallback={<ExpensesListSkeleton />}>
        <AccountingBalance />
      </Suspense>
    </div>
  )
}
