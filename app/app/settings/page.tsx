import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { SettingsContent } from "@/components/app/settings/settings-content"

export const metadata: Metadata = {
  title: "Paramètres | APHIA",
  description: "Gérez vos paramètres et préférences",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SettingsContent user={user} />
}
