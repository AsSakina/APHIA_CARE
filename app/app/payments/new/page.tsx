import { PaymentForm } from "@/components/app/payments/payment-form"
import { mockExpenses } from "@/lib/mock-data"
import type { Expense } from "@/lib/types"

interface SupplierDocument {
  id: string
  supplier_id: string
  supplier_name: string
  document_type: string
  document_number: string
  document_date: string
  total_amount: number
  amount_paid: number
  remaining: number
}

function getPendingExpenses(): Expense[] {
  return mockExpenses.filter((e) => e.status === "VALIDATED")
}

function getPendingSupplierDocuments(): SupplierDocument[] {
  // Mock supplier documents
  return [
    {
      id: "doc-1",
      supplier_id: "sup-1",
      supplier_name: "Pharma Distribution",
      document_type: "INVOICE",
      document_number: "FAC-2024-001",
      document_date: "2024-01-15",
      total_amount: 250000,
      amount_paid: 100000,
      remaining: 150000,
    },
    {
      id: "doc-2",
      supplier_id: "sup-2",
      supplier_name: "MédiStock Sénégal",
      document_type: "INVOICE",
      document_number: "FAC-2024-042",
      document_date: "2024-01-20",
      total_amount: 180000,
      amount_paid: 80000,
      remaining: 100000,
    },
  ]
}

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ expense_id?: string; supplier_document_id?: string }>
}) {
  const params = await searchParams
  const expenses = getPendingExpenses()
  const supplierDocuments = getPendingSupplierDocuments()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau paiement</h1>
        <p className="text-muted-foreground">Enregistrez un paiement sortant (décaissement)</p>
      </div>
      <PaymentForm
        expenses={expenses}
        supplierDocuments={supplierDocuments}
        preselectedExpenseId={params.expense_id}
        preselectedDocumentId={params.supplier_document_id}
      />
    </div>
  )
}
