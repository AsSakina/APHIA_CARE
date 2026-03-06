import { getCurrentUser, getCurrentPharmacy } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PharmacySettings } from "@/components/app/pharmacy/pharmacy-settings"

export const dynamic = "force-dynamic"

export default async function PharmacyPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const pharmacy = await getCurrentPharmacy()
  if (!pharmacy) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Aucune pharmacie associée à votre compte.</p>
      </div>
    )
  }

  // Only owners and admins can access pharmacy settings
  const canManage = user.pharmacy_role === "owner" || user.pharmacy_role === "admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ma Pharmacie</h1>
        <p className="text-muted-foreground">Gérez les informations et paramètres de votre pharmacie</p>
      </div>

      <PharmacySettings pharmacy={pharmacy} canManage={canManage} userRole={user.pharmacy_role} />
    </div>
  )
}
