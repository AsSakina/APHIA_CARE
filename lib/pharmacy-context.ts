import { getSession } from "./auth"

/**
 * Get the current pharmacy ID from session
 * Returns null if user is not authenticated or has no pharmacy
 */
export async function getPharmacyId(): Promise<string | null> {
  const session = await getSession()
  return session?.pharmacyId || null
}

/**
 * Require pharmacy ID - throws error if not available
 * Use this in server actions that require pharmacy context
 */
export async function requirePharmacyId(): Promise<string> {
  const pharmacyId = await getPharmacyId()
  if (!pharmacyId) {
    throw new Error("Pharmacy context required. Please log in.")
  }
  return pharmacyId
}

/**
 * Check if user has specific role in their pharmacy
 */
export async function hasPharmacyRole(roles: string[]): Promise<boolean> {
  const session = await getSession()
  if (!session?.pharmacyRole) return false
  return roles.includes(session.pharmacyRole)
}

/**
 * Require specific pharmacy role - throws error if not authorized
 */
export async function requirePharmacyRole(roles: string[]): Promise<void> {
  const hasRole = await hasPharmacyRole(roles)
  if (!hasRole) {
    throw new Error("Insufficient permissions for this action.")
  }
}

/**
 * Get pharmacy-scoped data with automatic filtering
 * This is a helper to build queries that respect multi-tenancy
 */
export async function getPharmacyScopedData<T>(
  tableName: string,
  additionalConditions = "",
  orderBy = "created_at DESC",
  limit?: number,
): Promise<T[]> {
  const pharmacyId = await requirePharmacyId()

  let query = `
    SELECT * FROM ${tableName} 
    WHERE pharmacy_id = $1 
    AND deleted_at IS NULL
    ${additionalConditions}
    ORDER BY ${orderBy}
  `

  if (limit) {
    query += ` LIMIT ${limit}`
  }

  // Note: This is a simplified example - in practice, use tagged templates
  // The actual queries should be done with sql`` tagged templates
  return [] as T[]
}

/**
 * Verify user belongs to a specific pharmacy
 */
export async function verifyPharmacyAccess(targetPharmacyId: string): Promise<boolean> {
  const pharmacyId = await getPharmacyId()
  return pharmacyId === targetPharmacyId
}
