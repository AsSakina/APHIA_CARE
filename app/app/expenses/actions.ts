"use server"

import { revalidatePath } from "next/cache"
import type { ExpenseType, ExpenseStatus, Expense } from "@/lib/types"
import { mockExpenses, generateExpenseId } from "@/lib/mock-data"

export async function createExpense(data: {
  expense_type: ExpenseType
  description: string
  amount: number
  expense_date: string
  expense_category_id?: string
  notes?: string
}): Promise<{ id: string }> {
  const now = new Date().toISOString()
  const newExpense: Expense = {
    id: generateExpenseId(),
    expense_type: data.expense_type,
    description: data.description,
    amount: data.amount,
    expense_date: data.expense_date,
    expense_category_id: data.expense_category_id,
    notes: data.notes,
    status: "DRAFT",
    created_at: now,
  }

  mockExpenses.push(newExpense)
  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")
  return { id: newExpense.id }
}

export async function updateExpense(
  id: string,
  data: {
    expense_type?: ExpenseType
    description?: string
    amount?: number
    expense_date?: string
    expense_category_id?: string
    notes?: string
    status?: ExpenseStatus
  },
) {
  const expense = mockExpenses.find((e) => e.id === id)
  if (expense) {
    if (data.expense_type) expense.expense_type = data.expense_type
    if (data.description) expense.description = data.description
    if (data.amount) expense.amount = data.amount
    if (data.expense_date) expense.expense_date = data.expense_date
    if (data.expense_category_id) expense.expense_category_id = data.expense_category_id
    if (data.notes !== undefined) expense.notes = data.notes
    if (data.status) expense.status = data.status
  }

  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")
}

export async function validateExpense(id: string) {
  const expense = mockExpenses.find((e) => e.id === id)
  if (expense) {
    expense.status = "VALIDATED"
    expense.validated_at = new Date().toISOString()
  }

  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")
}

export async function deleteExpense(id: string) {
  const index = mockExpenses.findIndex((e) => e.id === id)
  if (index > -1) {
    mockExpenses.splice(index, 1)
  }

  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")
}

// Get all expenses (for listing)
export async function getExpenses(): Promise<Expense[]> {
  return mockExpenses
}

// Get expense by ID
export async function getExpenseById(id: string): Promise<Expense | null> {
  return mockExpenses.find((e) => e.id === id) || null
}
