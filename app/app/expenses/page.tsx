import { Suspense } from "react"
import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExpensesList } from "@/components/app/expenses/expenses-list"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default async function ExpensesPage() {
  await headers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dépenses</h1>
          <p className="text-muted-foreground">Gérez les dépenses opérationnelles de votre pharmacie</p>
        </div>
        <Button asChild>
          <Link href="/app/expenses/new">
            <Plus className="size-4 mr-2" />
            Nouvelle dépense
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ExpensesListSkeleton />}>
        <ExpensesList />
      </Suspense>
    </div>
  )
}
