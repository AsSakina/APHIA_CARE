"use server"

import { revalidatePath } from "next/cache"
import type { AdjustmentReason, FinancialLoss } from "@/lib/types"
import { mockLosses, generateLossId, getProductById } from "@/lib/mock-data"

export async function createLoss(data: {
  product_id?: string
  adjustment_reason: AdjustmentReason
  quantity: number
  unit_cost: number
  loss_date: string
  notes?: string
}): Promise<{ id: string }> {
  const now = new Date().toISOString()
  const product = data.product_id ? getProductById(data.product_id) : null

  const newLoss: FinancialLoss = {
    id: generateLossId(),
    product_id: data.product_id,
    product_name: product?.name,
    adjustment_reason: data.adjustment_reason,
    quantity: data.quantity,
    unit_cost: data.unit_cost,
    total_loss: data.quantity * data.unit_cost,
    loss_date: data.loss_date,
    notes: data.notes,
    created_at: now,
  }

  mockLosses.push(newLoss)
  revalidatePath("/app/losses", "page")
  revalidatePath("/app", "page")

  return { id: newLoss.id }
}

export async function deleteLoss(id: string) {
  const index = mockLosses.findIndex((l) => l.id === id)
  if (index > -1) {
    mockLosses.splice(index, 1)
  }

  revalidatePath("/app/losses", "page")
  revalidatePath("/app", "page")
}

export async function getLosses(): Promise<FinancialLoss[]> {
  return mockLosses
}

export async function getLossById(id: string): Promise<FinancialLoss | null> {
  return mockLosses.find((l) => l.id === id) || null
}
