import { Suspense } from "react"
import { headers } from "next/headers"
import { PosInterface } from "@/components/app/pos/pos-interface"
import { getActiveCarts, getAllProducts, getActiveIpms } from "./actions"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

async function getAllPatients() {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const patients = await sql("SELECT id, first_name, last_name FROM patients ORDER BY first_name, last_name")
    return patients as any[]
  } catch {
    return []
  }
}

export default async function PosPage() {
  await headers()

  const [carts, products, ipms, patients] = await Promise.all([
    getActiveCarts(),
    getAllProducts(),
    getActiveIpms(),
    getAllPatients(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Point de Vente</h1>
        <p className="text-muted-foreground">
          Interface de vente directe - Créez et finalisez vos ventes
        </p>
      </div>

      <Suspense fallback={<div className="flex h-full items-center justify-center py-12">Chargement...</div>}>
        <PosInterface initialCarts={carts} products={products} ipms={ipms} />
      </Suspense>
    </div>
  )
}
