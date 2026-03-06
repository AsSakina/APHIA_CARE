"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, CreditCard, Save, Loader2 } from "lucide-react"
import { updatePharmacy } from "@/app/app/pharmacy/actions"
import { toast } from "sonner"
import type { Pharmacy, PharmacyRole } from "@/lib/types"

interface PharmacySettingsProps {
  pharmacy: Pharmacy
  canManage: boolean
  userRole?: PharmacyRole
}

export function PharmacySettings({ pharmacy, canManage, userRole }: PharmacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: pharmacy.name,
    address: pharmacy.address || "",
    phone: pharmacy.phone || "",
    email: pharmacy.email || "",
    tax_id: pharmacy.tax_id || "",
    license_number: pharmacy.license_number || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updatePharmacy(pharmacy.id, formData)
      if (result.success) {
        toast.success("Pharmacie mise à jour avec succès")
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour")
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  const planLabels: Record<string, string> = {
    free: "Gratuit",
    starter: "Starter",
    professional: "Professionnel",
    enterprise: "Entreprise",
  }

  const planColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-800",
    starter: "bg-blue-100 text-blue-800",
    professional: "bg-green-100 text-green-800",
    enterprise: "bg-purple-100 text-purple-800",
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Informations
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Équipe
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Abonnement
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la pharmacie</CardTitle>
            <CardDescription>Ces informations apparaissent sur vos factures et documents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la pharmacie *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!canManage}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" value={pharmacy.code || ""} disabled />
                  <p className="text-xs text-muted-foreground">Généré automatiquement</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  disabled={!canManage}
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    disabled={!canManage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    disabled={!canManage}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tax_id">NINEA / NIF</Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tax_id: e.target.value }))}
                    disabled={!canManage}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_number">N° Autorisation</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, license_number: e.target.value }))}
                    disabled={!canManage}
                  />
                </div>
              </div>

              {canManage && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="team">
        <Card>
          <CardHeader>
            <CardTitle>Membres de l'équipe</CardTitle>
            <CardDescription>Gérez les utilisateurs ayant accès à votre pharmacie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>La gestion des membres de l'équipe sera disponible prochainement.</p>
              <p className="text-sm mt-2">
                Votre rôle actuel: <Badge variant="outline">{userRole || "staff"}</Badge>
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Abonnement</CardTitle>
            <CardDescription>Gérez votre plan et vos options de facturation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Plan actuel</p>
                <p className="text-sm text-muted-foreground">Accès aux fonctionnalités de base</p>
              </div>
              <Badge className={planColors[pharmacy.plan_type]}>{planLabels[pharmacy.plan_type]}</Badge>
            </div>

            {pharmacy.plan_type === "free" && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium mb-2">Passez à un plan supérieur</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Débloquez plus de fonctionnalités: multi-utilisateurs, rapports avancés, support prioritaire.
                </p>
                <Button variant="outline" disabled>
                  Bientôt disponible
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
