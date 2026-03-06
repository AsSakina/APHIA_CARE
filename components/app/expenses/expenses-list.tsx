import { formatCurrency, formatDate } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/app/status-badge"
import { ExpenseActions } from "./expense-actions"
import { mockExpenses } from "@/lib/mock-data"
import type { Expense } from "@/lib/types"

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

function getExpenses(): Expense[] {
  return mockExpenses
}

export async function ExpensesList() {
  const expenses = getExpenses()

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">Aucune dépense enregistrée</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Liste des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Type</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Catégorie</th>
                <th className="text-right py-3 font-medium">Montant</th>
                <th className="text-center py-3 font-medium">Statut</th>
                <th className="text-right py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3">{formatDate(expense.expense_date)}</td>
                  <td className="py-3">{expenseTypeLabels[expense.expense_type] || expense.expense_type}</td>
                  <td className="py-3 max-w-[200px] truncate">{expense.description}</td>
                  <td className="py-3 text-muted-foreground">
                    {expense.category_code ? `${expense.category_code} - ${expense.category_name}` : "-"}
                  </td>
                  <td className="py-3 text-right font-medium">{formatCurrency(Number(expense.amount))}</td>
                  <td className="py-3 text-center">
                    <StatusBadge status={expense.status} />
                  </td>
                  <td className="py-3 text-right">
                    <ExpenseActions expense={expense} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
