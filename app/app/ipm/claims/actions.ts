"use server"

import { revalidatePath } from "next/cache"
import type { IpmClaimStatus, IpmClaim } from "@/lib/types"
import { mockIpmClaims, generateClaimId, getIpmById } from "@/lib/mock-data"

export async function createClaim(data: {
  ipm_id: string
  claim_number: string
  period_start: string
  period_end: string
  total_amount: number
  notes?: string
}): Promise<{ id: string }> {
  const now = new Date().toISOString()
  const ipm = getIpmById(data.ipm_id)

  const newClaim: IpmClaim = {
    id: generateClaimId(),
    ipm_id: data.ipm_id,
    ipm_name: ipm?.name,
    claim_number: data.claim_number,
    period_start: data.period_start,
    period_end: data.period_end,
    total_amount: data.total_amount,
    amount_accepted: 0,
    amount_paid: 0,
    status: "DRAFT",
    notes: data.notes,
    created_at: now,
  }

  mockIpmClaims.push(newClaim)
  revalidatePath("/app/ipm/claims", "page")
  revalidatePath("/app/ipm", "page")
  revalidatePath("/app", "page")

  return { id: newClaim.id }
}

export async function updateClaimStatus(
  id: string,
  status: IpmClaimStatus,
  data?: {
    amount_accepted?: number
    amount_paid?: number
  },
) {
  const claim = mockIpmClaims.find((c) => c.id === id)
  if (claim) {
    claim.status = status
    if (data?.amount_accepted !== undefined) claim.amount_accepted = data.amount_accepted
    if (data?.amount_paid !== undefined) claim.amount_paid = data.amount_paid

    const now = new Date().toISOString()
    if (status === "SENT" && !claim.sent_at) claim.sent_at = now
    if (status === "ACCEPTED" && !claim.accepted_at) claim.accepted_at = now
  }

  revalidatePath("/app/ipm/claims", "page")
  revalidatePath("/app/ipm", "page")
  revalidatePath("/app", "page")
}

export async function getClaims(): Promise<IpmClaim[]> {
  return mockIpmClaims
}

export async function getClaimById(id: string): Promise<IpmClaim | null> {
  return mockIpmClaims.find((c) => c.id === id) || null
}

export async function deleteClaim(id: string) {
  const index = mockIpmClaims.findIndex((c) => c.id === id)
  if (index > -1) {
    mockIpmClaims.splice(index, 1)
  }

  revalidatePath("/app/ipm/claims", "page")
  revalidatePath("/app/ipm", "page")
  revalidatePath("/app", "page")
}
