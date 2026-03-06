"use server"

import { revalidatePath } from "next/cache"
import { currentPharmacy } from "@/lib/mock-data"

export async function updatePharmacy(
  _pharmacyId: string,
  data: {
    name: string
    address?: string
    phone?: string
    email?: string
    tax_id?: string
    license_number?: string
  },
) {
  try {
    // OFFLINE MODE: Update mock pharmacy
    currentPharmacy.name = data.name
    if (data.address !== undefined) currentPharmacy.address = data.address
    if (data.phone !== undefined) currentPharmacy.phone = data.phone
    if (data.email !== undefined) currentPharmacy.email = data.email
    if (data.tax_id !== undefined) currentPharmacy.tax_id = data.tax_id
    if (data.license_number !== undefined) currentPharmacy.license_number = data.license_number

    revalidatePath("/app/pharmacy")
    revalidatePath("/app")
    return { success: true }
  } catch (error) {
    console.error("Update pharmacy error:", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

export async function getPharmacy() {
  return currentPharmacy
}
