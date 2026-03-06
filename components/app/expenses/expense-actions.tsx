"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, CreditCard, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Expense } from "@/lib/types"
import { validateExpense, deleteExpense } from "@/app/app/expenses/actions"

interface ExpenseActionsProps {
  expense: Expense
}

export function ExpenseActions({ expense }: ExpenseActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleValidate = async () => {
    if (!expense.expense_category_id) {
      toast.error("La dépense doit avoir une catégorie avant validation")
      return
    }
    setIsLoading(true)
    try {
      await validateExpense(expense.id)
      toast.success("Dépense validée")
      router.refresh()
    } catch {
      toast.error("Erreur lors de la validation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) return
    setIsLoading(true)
    try {
      await deleteExpense(expense.id)
      toast.success("Dépense supprimée")
      router.refresh()
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          <MoreHorizontal className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/app/expenses/${expense.id}`)}>
          <Eye className="size-4 mr-2" />
          Voir détails
        </DropdownMenuItem>
        {expense.status === "PENDING" && (
          <DropdownMenuItem onClick={handleValidate}>
            <CheckCircle className="size-4 mr-2" />
            Valider
          </DropdownMenuItem>
        )}
        {expense.status === "VALIDATED" && (
          <DropdownMenuItem onClick={() => router.push(`/app/payments/new?expense_id=${expense.id}`)}>
            <CreditCard className="size-4 mr-2" />
            Payer
          </DropdownMenuItem>
        )}
        {(expense.status === "DRAFT" || expense.status === "PENDING") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="size-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
