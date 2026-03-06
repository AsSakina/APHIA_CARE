"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createClaim } from "@/app/app/ipm/claims/actions"
import type { Ipm } from "@/lib/types"

interface ClaimFormProps {
  ipms: Ipm[]
}

export function ClaimForm({ ipms }: ClaimFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      ipm_id: formData.get("ipm_id") as string,
      claim_number: formData.get("claim_number") as string,
      period_start: formData.get("period_start") as string,
      period_end: formData.get("period_end") as string,
      total_amount: Number(formData.get("total_amount")),
      notes: (formData.get("notes") as string) || undefined,
    }

    try {
      await createClaim(data)
      toast.success("Créance créée avec succès")
      router.push("/app/ipm/claims")
    } catch {
      toast.error("Erreur lors de la création de la créance")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate claim number suggestion
  const today = new Date()
  const suggestedNumber = `CRE-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(Date.now()).slice(-4)}`

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Informations de la créance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ipm_id">IPM / Mutuelle *</Label>
              <Select name="ipm_id" required>
                <SelectTrigger id="ipm_id">
                  <SelectValue placeholder="Sélectionnez un IPM" />
                </SelectTrigger>
                <SelectContent>
                  {ipms.map((ipm) => (
                    <SelectItem key={ipm.id} value={ipm.id}>
                      {ipm.code ? `${ipm.code} - ` : ""}
                      {ipm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="claim_number">Numéro de créance *</Label>
              <Input id="claim_number" name="claim_number" defaultValue={suggestedNumber} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="period_start">Début de période *</Label>
              <Input id="period_start" name="period_start" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period_end">Fin de période *</Label>
              <Input id="period_end" name="period_end" type="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_amount">Montant total (FCFA) *</Label>
            <Input id="total_amount" name="total_amount" type="number" min="1" step="1" placeholder="0" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Détails de la créance" rows={3} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Créer la créance"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
