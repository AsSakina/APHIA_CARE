"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/app/settings/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Mail, Phone, AtSign, CheckCircle2, AlertCircle, Camera, Trash2 } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface ProfileSettingsProps {
  user: UserType
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setUploadError(data.error || "Erreur lors du téléchargement")
        return
      }

      setAvatarUrl(data.url)
      router.refresh()
    } catch {
      setUploadError("Erreur lors du téléchargement")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    setUploadError("")

    try {
      const response = await fetch("/api/upload/avatar", {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        setUploadError(data.error || "Erreur lors de la suppression")
        return
      }

      setAvatarUrl("")
      router.refresh()
    } catch {
      setUploadError("Erreur lors de la suppression")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
          <CardDescription>Votre avatar sera affiché dans l'application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24">
            {avatarUrl && (
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={`${user.first_name} ${user.last_name}`} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                {avatarUrl ? "Changer la photo" : "Ajouter une photo"}
              </Button>
              {avatarUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={handleRemoveAvatar}
                  className="text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG, GIF ou WebP. 1MB max.</p>
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations de profil</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state?.success && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Profil mis à jour avec succès
                </AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user.first_name}
                    className="pl-10"
                    disabled={isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" defaultValue={user.last_name} disabled={isPending} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  defaultValue={user.username || ""}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground">Votre identifiant unique sur APHIA</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  placeholder="+221 XX XXX XX XX"
                  className="pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
          <CardDescription>Détails de votre compte APHIA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rôle</p>
              <p className="text-sm capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${user.is_active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}
                >
                  {user.is_active ? "Actif" : "Inactif"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Membre depuis</p>
              <p className="text-sm">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dernière connexion</p>
              <p className="text-sm">
                {user.last_login_at
                  ? new Date(user.last_login_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
