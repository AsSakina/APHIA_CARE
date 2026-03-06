import { sql } from "@/lib/db"
import { ClaimForm } from "@/components/app/ipm/claim-form"
import type { Ipm } from "@/lib/types"

async function getIpms() {
  try {
    const ipms = await sql`
      SELECT id, name, code, coverage_rate
      FROM ipms
      WHERE deleted_at IS NULL AND is_active = true
      ORDER BY name
    `
    return ipms as Ipm[]
  } catch {
    return []
  }
}

export default async function NewClaimPage() {
  const ipms = await getIpms()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle créance IPM</h1>
        <p className="text-muted-foreground">Créez une nouvelle créance pour un IPM</p>
      </div>
      <ClaimForm ipms={ipms} />
    </div>
  )
}
