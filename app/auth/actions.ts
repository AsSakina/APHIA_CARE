"use server"

import { redirect } from "next/navigation"

type LoginResult = {
  error?: string
  success?: boolean
  redirectTo?: string
  errorType?: "credentials" | "inactive" | "locked" | "validation" | "server" | "database"
  remainingAttempts?: number
  lockedUntil?: string
}

type RegisterResult = {
  error?: string
  success?: boolean
  redirectTo?: string
  errorType?: "validation" | "exists" | "server" | "database"
  fieldErrors?: { [key: string]: string }
}

// OFFLINE MODE: Login always succeeds and redirects to /app/pos
export async function login(_prevState: LoginResult | null, _formData: FormData): Promise<LoginResult> {
  // Simulate a small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, redirectTo: "/app/pos" }
}

// OFFLINE MODE: Register always succeeds and redirects to /app/pos
export async function register(_prevState: RegisterResult | null, _formData: FormData): Promise<RegisterResult> {
  // Simulate a small delay for UX
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, redirectTo: "/app/pos" }
}

// OFFLINE MODE: Logout redirects to login
export async function logout(): Promise<void> {
  redirect("/auth/login")
}
