"use server"

import { revalidatePath } from "next/cache"
import type { PaymentMethod, Payment } from "@/lib/types"
import { mockPayments, generatePaymentId } from "@/lib/mock-data"

export async function createPayment(data: {
  payment_method: PaymentMethod
  amount: number
  payment_date: string
  reference?: string
  expense_id?: string
  supplier_document_id?: string
  notes?: string
}): Promise<{ id: string }> {
  // Validate single target constraint
  if (data.expense_id && data.supplier_document_id) {
    throw new Error("Payment cannot be linked to both expense and supplier document")
  }

  const now = new Date().toISOString()
  const newPayment: Payment = {
    id: generatePaymentId(),
    payment_method: data.payment_method,
    amount: data.amount,
    payment_date: data.payment_date,
    reference: data.reference,
    expense_id: data.expense_id,
    supplier_document_id: data.supplier_document_id,
    notes: data.notes,
    created_at: now,
  }

  mockPayments.push(newPayment)
  revalidatePath("/app/payments", "page")
  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")

  return { id: newPayment.id }
}

export async function deletePayment(id: string) {
  const index = mockPayments.findIndex((p) => p.id === id)
  if (index > -1) {
    mockPayments.splice(index, 1)
  }

  revalidatePath("/app/payments", "page")
  revalidatePath("/app/expenses", "page")
  revalidatePath("/app", "page")
}

export async function getPayments(): Promise<Payment[]> {
  return mockPayments
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return mockPayments.find((p) => p.id === id) || null
}
