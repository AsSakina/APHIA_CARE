import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClaimsList } from "@/components/app/ipm/claims-list"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Créances IPM / Mutuelles</h1>
          <p className="text-muted-foreground">Suivi des créances auprès des mutuelles et organismes</p>
        </div>
        <Button asChild>
          <Link href="/app/ipm/claims/new">
            <Plus className="size-4 mr-2" />
            Nouvelle créance
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ExpensesListSkeleton />}>
        <ClaimsList />
      </Suspense>
    </div>
  )
}
