"use server"

import { revalidatePath } from "next/cache"
import type { Patient } from "@/lib/types"
import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Factory function to create Supabase client
function createSupabaseClient() {
  return supabaseCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )
}

export async function getAllClients(): Promise<Patient[]> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Get clients error:", error)
      return []
    }

    return data as Patient[]
  } catch (error) {
    console.error("[v0] Get clients error:", error)
    return []
  }
}

export async function getClientById(clientId: string): Promise<Patient | null> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", clientId)
      .single()

    if (error) {
      console.error("[v0] Get client error:", error)
      return null
    }

    return data as Patient
  } catch (error) {
    console.error("[v0] Get client error:", error)
    return null
  }
}

export async function createClient(data: {
  first_name: string
  last_name: string
  phone?: string
  email?: string
  address?: string
  date_of_birth?: string
  can_receive_credit?: boolean
  credit_limit?: number
}): Promise<{
  success: boolean
  client?: Patient
  error?: string
}> {
  try {
    const supabase = createSupabaseClient()
    const newClient = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      date_of_birth: data.date_of_birth || null,
      can_receive_credit: data.can_receive_credit ?? false,
      credit_limit: data.credit_limit || 0,
      current_credit_balance: 0,
    }

    const { data: createdClient, error } = await supabase
      .from("patients")
      .insert([newClient])
      .select()
      .single()

    if (error) {
      console.error("[v0] Create client error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/app/clients")
    return { success: true, client: createdClient as Patient }
  } catch (error) {
    console.error("[v0] Create client error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la création",
    }
  }
}

export async function updateClient(
  clientId: string,
  data: Partial<Patient>
): Promise<{
  success: boolean
  client?: Patient
  error?: string
}> {
  try {
    const supabase = createSupabaseClient()
    const { data: updatedClient, error } = await supabase
      .from("patients")
      .update(data)
      .eq("id", clientId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Update client error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/app/clients")
    return { success: true, client: updatedClient as Patient }
  } catch (error) {
    console.error("[v0] Update client error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
    }
  }
}

export async function deleteClient(clientId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createSupabaseClient()
    // Soft delete - set deleted_at timestamp
    const { error } = await supabase
      .from("patients")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", clientId)

    if (error) {
      console.error("[v0] Delete client error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/app/clients")
    return { success: true }
  } catch (error) {
    console.error("[v0] Delete client error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la suppression",
    }
  }
}

export async function toggleClientCredit(
  clientId: string,
  canReceiveCredit: boolean,
  creditLimit?: number
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createSupabaseClient()
    const updateData: any = {
      can_receive_credit: canReceiveCredit,
    }

    if (creditLimit !== undefined) {
      updateData.credit_limit = creditLimit
    }

    const { error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", clientId)

    if (error) {
      console.error("[v0] Toggle client credit error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/app/clients")
    return { success: true }
  } catch (error) {
    console.error("[v0] Toggle client credit error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
    }
  }
}

// Mock functions for testing
const mockPatients: Patient[] = []

export async function mockGetClientById(clientId: string): Promise<Patient | null> {
  try {
    return mockPatients.find((p) => p.id === clientId) || null
  } catch (error) {
    console.error("Get client error:", error)
    return null
  }
}

export async function mockCreateClient(data: {
  first_name: string
  last_name: string
  phone?: string
  email?: string
  address?: string
  date_of_birth?: string
  can_receive_credit?: boolean
  credit_limit?: number
}): Promise<{
  success: boolean
  client?: Patient
  error?: string
}> {
  try {
    const newClient: Patient = {
      id: `patient-${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      date_of_birth: data.date_of_birth,
      can_receive_credit: data.can_receive_credit ?? false,
      credit_limit: data.credit_limit || 0,
      current_credit_balance: 0,
    }

    mockPatients.push(newClient)
    revalidatePath("/app/clients")
    
    return { success: true, client: newClient }
  } catch (error) {
    console.error("[v0] Create client error:", error)
    return { success: false, error: "Erreur lors de la création du client" }
  }
}

export async function mockUpdateClient(
  clientId: string,
  data: Partial<Patient>
): Promise<{
  success: boolean
  client?: Patient
  error?: string
}> {
  try {
    const client = mockPatients.find((p) => p.id === clientId)
    if (!client) {
      return { success: false, error: "Client non trouvé" }
    }

    Object.assign(client, data)
    revalidatePath("/app/clients")

    return { success: true, client }
  } catch (error) {
    console.error("[v0] Update client error:", error)
    return { success: false, error: "Erreur lors de la mise à jour du client" }
  }
}

export async function mockDeleteClient(clientId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const index = mockPatients.findIndex((p) => p.id === clientId)
    if (index === -1) {
      return { success: false, error: "Client non trouvé" }
    }

    mockPatients.splice(index, 1)
    revalidatePath("/app/clients")

    return { success: true }
  } catch (error) {
    console.error("[v0] Delete client error:", error)
    return { success: false, error: "Erreur lors de la suppression du client" }
  }
}
