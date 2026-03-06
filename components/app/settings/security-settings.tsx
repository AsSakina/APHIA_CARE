"use client"

import { useActionState, useState } from "react"
import { changePassword, deleteAccount } from "@/app/app/settings/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Shield,
  Trash2,
  Check,
  X,
} from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface SecuritySettingsProps {
  user: UserType
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [passwordState, passwordAction, isPasswordPending] = useActionState(changePassword, null)
  const [deleteState, deleteAction, isDeletePending] = useActionState(deleteAccount, null)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  // Password strength indicators
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Changer le mot de passe
          </CardTitle>
          <CardDescription>Assurez-vous d'utiliser un mot de passe fort et unique</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            {passwordState?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordState.error}</AlertDescription>
              </Alert>
            )}

            {passwordState?.success && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">Mot de passe modifié avec succès</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  disabled={isPasswordPending}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  disabled={isPasswordPending}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword && (
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div
                    className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}8 caractères min.
                  </div>
                  <div
                    className={`flex items-center gap-1 ${hasUppercase ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Une majuscule
                  </div>
                  <div
                    className={`flex items-center gap-1 ${hasLowercase ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Une minuscule
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? "text-green-600" : "text-muted-foreground"}`}>
                    {hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    Un chiffre
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  disabled={isPasswordPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPasswordPending || (newPassword.length > 0 && !isPasswordStrong)}>
                {isPasswordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité du compte
          </CardTitle>
          <CardDescription>Informations sur la sécurité de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Authentification par mot de passe</p>
                <p className="text-sm text-green-600">Votre compte est protégé par un mot de passe</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-muted-foreground">Non disponible dans cette version</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Bientôt disponible
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zone de danger
          </CardTitle>
          <CardDescription>Actions irréversibles sur votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Attention</AlertTitle>
            <AlertDescription>
              La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
            </AlertDescription>
          </Alert>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Cette action est irréversible. Votre compte et toutes vos données seront définitivement supprimés.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirm">
                      Tapez <span className="font-mono font-bold">SUPPRIMER</span> pour confirmer
                    </Label>
                    <Input
                      id="deleteConfirm"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="SUPPRIMER"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Annuler</AlertDialogCancel>
                <form action={deleteAction}>
                  <input type="hidden" name="confirmation" value={deleteConfirmation} />
                  <AlertDialogAction
                    type="submit"
                    disabled={deleteConfirmation !== "SUPPRIMER" || isDeletePending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeletePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Supprimer définitivement
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
