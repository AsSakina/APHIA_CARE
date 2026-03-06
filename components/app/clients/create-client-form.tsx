"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { createClient } from "@/app/app/clients/actions"
import { Loader2, Plus } from "lucide-react"

export function CreateClientForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [canReceiveCredit, setCanReceiveCredit] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
    date_of_birth: "",
    credit_limit: "0",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error("Nom et prénom requis")
      setIsLoading(false)
      return
    }

    const result = await createClient({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      date_of_birth: formData.date_of_birth || undefined,
      can_receive_credit: canReceiveCredit,
      credit_limit: canReceiveCredit ? Number(formData.credit_limit) : 0,
    })

    if (result.success) {
      toast.success(`Client ${result.client?.first_name} créé avec succès`)
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        date_of_birth: "",
        credit_limit: "0",
      })
      setCanReceiveCredit(false)
      router.refresh()
    } else {
      toast.error(result.error || "Erreur lors de la création")
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Créer un nouveau client
        </CardTitle>
        <CardDescription>
          Enregistrez un nouveau client/patient pour la pharmacie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="Ex: Aminata"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Ex: Diallo"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+221 77 123 45 67"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="client@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Avenue de la Santé, Dakar"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          {/* Crédit */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-3">
              <Checkbox
                id="can_receive_credit"
                checked={canReceiveCredit}
                onCheckedChange={(checked) => setCanReceiveCredit(checked as boolean)}
              />
              <Label htmlFor="can_receive_credit" className="text-sm font-medium cursor-pointer">
                Autoriser ce client à bénéficier de crédits
              </Label>
            </div>

            {canReceiveCredit && (
              <div className="space-y-2">
                <Label htmlFor="credit_limit">Limite de crédit (FCFA)</Label>
                <Input
                  id="credit_limit"
                  name="credit_limit"
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={formData.credit_limit}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Montant maximum que ce client peut acheter à crédit
                </p>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer le client
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
