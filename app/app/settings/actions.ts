"use server"

import { currentUser } from "@/lib/mock-data"

type ProfileResult = {
  error?: string
  success?: boolean
  fieldErrors?: { [key: string]: string }
}

type PasswordResult = {
  error?: string
  success?: boolean
}

type DeleteResult = {
  error?: string
}

// Update profile (OFFLINE MODE: Updates mock user)
export async function updateProfile(_prevState: ProfileResult | null, formData: FormData): Promise<ProfileResult> {
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string

  const fieldErrors: { [key: string]: string } = {}

  if (!firstName?.trim()) {
    fieldErrors.firstName = "Le prénom est requis"
  }
  if (!lastName?.trim()) {
    fieldErrors.lastName = "Le nom est requis"
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Veuillez corriger les erreurs",
      fieldErrors,
    }
  }

  // Update mock user (simulated)
  currentUser.firstName = firstName.trim()
  currentUser.lastName = lastName.trim()
  if (username) currentUser.username = username.toLowerCase().trim()
  if (email) currentUser.email = email.toLowerCase().trim()
  if (phone) currentUser.phone = phone.trim()

  return { success: true }
}

// Change password (OFFLINE MODE: Always succeeds for demo)
export async function changePassword(_prevState: PasswordResult | null, formData: FormData): Promise<PasswordResult> {
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmNewPassword = formData.get("confirmNewPassword") as string

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return { error: "Tous les champs sont requis" }
  }

  if (newPassword !== confirmNewPassword) {
    return { error: "Les nouveaux mots de passe ne correspondent pas" }
  }

  if (newPassword.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères" }
  }

  // OFFLINE MODE: Always succeed
  return { success: true }
}

// Delete account (OFFLINE MODE: Shows error as we can't actually delete in demo)
export async function deleteAccount(_prevState: DeleteResult | null, formData: FormData): Promise<DeleteResult> {
  const confirmation = formData.get("confirmation") as string

  if (confirmation !== "SUPPRIMER") {
    return { error: "Confirmation incorrecte" }
  }

  // OFFLINE MODE: Can't actually delete in demo mode
  return { error: "La suppression de compte n'est pas disponible en mode démo" }
}
