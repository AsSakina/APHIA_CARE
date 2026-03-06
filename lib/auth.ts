import type { Pharmacy, PharmacyRole } from "./types"
import { currentUser, currentPharmacy } from "./mock-data"

// User type
export interface User {
  id: string
  email: string
  username?: string
  first_name: string
  last_name: string
  role: "admin" | "manager" | "pharmacist" | "user"
  pharmacy_id?: string
  pharmacy_role?: PharmacyRole
  pharmacy_name?: string
  is_active: boolean
  phone?: string
  avatar_url?: string
  created_at?: string
  last_login_at?: string
}

// Session payload type
export interface SessionPayload {
  userId: string
  email: string
  username?: string
  role: string
  pharmacyId?: string
  pharmacyRole?: string
  expiresAt: Date
}

export interface LoginAttempt {
  count: number
  lastAttempt: number
  lockedUntil?: number
}

// OFFLINE MODE: Always return mock user
export async function getCurrentUser(): Promise<User | null> {
  return currentUser as User
}

export async function getCurrentPharmacy(): Promise<Pharmacy | null> {
  return currentPharmacy as Pharmacy
}

export async function getPharmacyId(): Promise<string | null> {
  return currentPharmacy.id
}

// OFFLINE MODE: Mock session that always returns valid
export async function getSession(): Promise<SessionPayload | null> {
  return {
    userId: currentUser.id,
    email: currentUser.email,
    username: currentUser.username,
    role: currentUser.role,
    pharmacyId: currentUser.pharmacy_id,
    pharmacyRole: currentUser.pharmacy_role,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }
}

// OFFLINE MODE: No-op functions
export async function deleteSession(): Promise<void> {
  // No-op in offline mode
}

export async function setSessionCookie(_token: string): Promise<void> {
  // No-op in offline mode
}

export async function createSession(_user: User): Promise<string> {
  return "mock-token-offline"
}

export async function verifySession(_token: string): Promise<SessionPayload | null> {
  return getSession()
}

export async function hashPassword(_password: string): Promise<string> {
  return "mock-hash"
}

export async function verifyPassword(_password: string, _hash: string): Promise<boolean> {
  return true
}

export async function updateLastLogin(_userId: string): Promise<void> {
  // No-op in offline mode
}

export async function checkRateLimit(
  _email: string,
): Promise<{ allowed: boolean; remainingAttempts?: number; lockedUntil?: Date }> {
  return { allowed: true }
}

export async function recordFailedLogin(_email: string): Promise<void> {
  // No-op in offline mode
}

export async function resetFailedLogins(_email: string): Promise<void> {
  // No-op in offline mode
}

// Validate password
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre")
  }

  return { valid: errors.length === 0, errors }
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
