import { headers } from "next/headers"
import { ExpenseForm } from "@/components/app/expenses/expense-form"
import type { ExpenseCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

function getCategories(): ExpenseCategory[] {
  // Mock expense categories
  return [
    { id: "cat-1", code: "601", name: "Achats de médicaments", parent_id: null },
    { id: "cat-2", code: "612", name: "Loyer et charges locatives", parent_id: null },
    { id: "cat-3", code: "641", name: "Rémunération du personnel", parent_id: null },
    { id: "cat-4", code: "606", name: "Fournitures diverses", parent_id: null },
    { id: "cat-5", code: "625", name: "Transport et déplacements", parent_id: null },
    { id: "cat-6", code: "627", name: "Services bancaires", parent_id: null },
  ]
}

export default async function NewExpensePage() {
  await headers()

  const categories = getCategories()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle dépense</h1>
        <p className="text-muted-foreground">Enregistrez une nouvelle dépense opérationnelle</p>
      </div>
      <ExpenseForm categories={categories} />
    </div>
  )
}
