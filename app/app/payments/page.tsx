import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PaymentsList } from "@/components/app/payments/payments-list"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">Historique des paiements sortants (décaissements)</p>
        </div>
        <Button asChild>
          <Link href="/app/payments/new">
            <Plus className="size-4 mr-2" />
            Nouveau paiement
          </Link>
        </Button>
      </div>
      <Suspense fallback={<ExpensesListSkeleton />}>
        <PaymentsList />
      </Suspense>
    </div>
  )
}
