import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/app/status-badge"
import { ArrowLeft, CreditCard } from "lucide-react"
import type { Expense, Payment } from "@/lib/types"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

const expenseTypeLabels: Record<string, string> = {
  MEDICATION_PURCHASE: "Achats médicaments",
  RENT: "Loyer",
  SALARY: "Salaires",
  ELECTRICITY: "Électricité",
  WATER: "Eau",
  INTERNET: "Internet",
  PHONE: "Téléphone",
  MAINTENANCE: "Maintenance",
  CLEANING: "Nettoyage",
  TRANSPORT: "Transport",
  OFFICE_SUPPLIES: "Fournitures de bureau",
  BANK_FEES: "Frais bancaires",
  TAXES: "Taxes",
  INSURANCE: "Assurance",
  MARKETING: "Marketing",
  TRAINING: "Formation",
  OTHER: "Autres",
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(str: string): boolean {
  return UUID_REGEX.test(str)
}

async function getExpense(id: string) {
  if (!isValidUUID(id)) {
    return undefined
  }
  try {
    const result = await sql`
      SELECT 
        e.*,
        ec.name as category_name,
        ec.code as category_code
      FROM expenses e
      LEFT JOIN expense_account_categories ec ON e.expense_category_id = ec.id
      WHERE e.id = ${id} AND e.deleted_at IS NULL
    `
    return result[0] as Expense | undefined
  } catch {
    return undefined
  }
}

async function getExpensePayments(expenseId: string) {
  if (!isValidUUID(expenseId)) {
    return []
  }
  try {
    const result = await sql`
      SELECT * FROM payments
      WHERE expense_id = ${expenseId} AND deleted_at IS NULL
      ORDER BY payment_date DESC
    `
    return result as Payment[]
  } catch {
    return []
  }
}

export default async function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await headers()

  const { id } = await params
  const expense = await getExpense(id)

  if (!expense) {
    notFound()
  }

  const payments = await getExpensePayments(id)
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const remaining = Number(expense.amount) - totalPaid

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/expenses">
            <ArrowLeft className="size-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Détail de la dépense</h1>
          <p className="text-muted-foreground">{expense.description}</p>
        </div>
        <StatusBadge status={expense.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{expenseTypeLabels[expense.expense_type] || expense.expense_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(expense.expense_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Catégorie</span>
              <span className="font-medium">
                {expense.category_code ? `${expense.category_code} - ${expense.category_name}` : "-"}
              </span>
            </div>
            {expense.notes && (
              <div>
                <span className="text-muted-foreground block mb-1">Notes</span>
                <span className="text-sm">{expense.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Montants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Montant total</span>
              <span className="font-bold text-lg">{formatCurrency(Number(expense.amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total payé</span>
              <span className="font-medium text-emerald-600">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="text-muted-foreground">Reste à payer</span>
              <span className={`font-bold ${remaining > 0 ? "text-destructive" : "text-emerald-600"}`}>
                {formatCurrency(remaining)}
              </span>
            </div>
            {expense.status === "VALIDATED" && remaining > 0 && (
              <Button asChild className="w-full mt-4">
                <Link href={`/app/payments/new?expense_id=${expense.id}`}>
                  <CreditCard className="size-4 mr-2" />
                  Effectuer un paiement
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{formatCurrency(Number(payment.amount))}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(payment.payment_date)} - {payment.payment_method}
                    </div>
                  </div>
                  {payment.reference && <span className="text-sm text-muted-foreground">{payment.reference}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
