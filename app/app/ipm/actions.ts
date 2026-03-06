"use server"

import { revalidatePath } from "next/cache"
import type { Ipm } from "@/lib/types"
import { mockIpms, generateIpmId } from "@/lib/mock-data"

export async function createIpm(data: {
  name: string
  code?: string
  contact_name?: string
  phone?: string
  email?: string
  coverage_rate?: number
  payment_delay_days?: number
  notes?: string
}): Promise<{ id: string }> {
  const now = new Date().toISOString()
  const newIpm: Ipm = {
    id: generateIpmId(),
    name: data.name,
    code: data.code,
    contact_name: data.contact_name,
    phone: data.phone,
    email: data.email,
    coverage_rate: data.coverage_rate || 80,
    payment_delay_days: data.payment_delay_days || 30,
    notes: data.notes,
    is_active: true,
    created_at: now,
  }

  mockIpms.push(newIpm)
  revalidatePath("/app/ipm", "page")
  return { id: newIpm.id }
}

export async function updateIpm(
  id: string,
  data: {
    name?: string
    code?: string
    contact_name?: string
    phone?: string
    email?: string
    coverage_rate?: number
    payment_delay_days?: number
    notes?: string
    is_active?: boolean
  },
) {
  const ipm = mockIpms.find((i) => i.id === id)
  if (ipm) {
    if (data.name) ipm.name = data.name
    if (data.code !== undefined) ipm.code = data.code
    if (data.contact_name !== undefined) ipm.contact_name = data.contact_name
    if (data.phone !== undefined) ipm.phone = data.phone
    if (data.email !== undefined) ipm.email = data.email
    if (data.coverage_rate !== undefined) ipm.coverage_rate = data.coverage_rate
    if (data.payment_delay_days !== undefined) ipm.payment_delay_days = data.payment_delay_days
    if (data.notes !== undefined) ipm.notes = data.notes
    if (data.is_active !== undefined) ipm.is_active = data.is_active
  }

  revalidatePath("/app/ipm", "page")
}

export async function deleteIpm(id: string) {
  const index = mockIpms.findIndex((i) => i.id === id)
  if (index > -1) {
    mockIpms.splice(index, 1)
  }

  revalidatePath("/app/ipm", "page")
}

export async function getIpms(): Promise<Ipm[]> {
  return mockIpms
}

export async function getIpmById(id: string): Promise<Ipm | null> {
  return mockIpms.find((i) => i.id === id) || null
}
