"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createIpm } from "@/app/app/ipm/actions"

export function IpmForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      code: (formData.get("code") as string) || undefined,
      contact_name: (formData.get("contact_name") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      coverage_rate: Number(formData.get("coverage_rate")) || 80,
      payment_delay_days: Number(formData.get("payment_delay_days")) || 30,
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      await createIpm(data)
      toast.success("IPM créé avec succès")
      router.push("/app/ipm")
    } catch {
      toast.error("Erreur lors de la création de l'IPM")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l&apos;IPM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l&apos;IPM *</Label>
              <Input id="name" name="name" placeholder="Ex: IPM Sénégal" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" name="code" placeholder="Ex: IPMS" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coverage_rate">Taux de couverture (%)</Label>
              <Input
                id="coverage_rate"
                name="coverage_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                defaultValue="80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_delay_days">Délai de paiement (jours)</Label>
              <Input
                id="payment_delay_days"
                name="payment_delay_days"
                type="number"
                min="0"
                step="1"
                defaultValue="30"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Nom du contact</Label>
              <Input id="contact_name" name="contact_name" placeholder="Personne de contact" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+221 XX XXX XX XX" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="contact@ipm.sn" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Informations complémentaires" rows={3} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Créer l'IPM"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
