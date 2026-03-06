"use client"

import { useActionState, useState, useEffect, useTransition } from "react"
import { login } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  UserX,
  Clock,
  Database,
} from "lucide-react"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      setIsRedirecting(true)
      startTransition(() => {
        window.location.href = state.redirectTo || "/app"
      })
    }
  }, [state])

  const getErrorIcon = () => {
    switch (state?.errorType) {
      case "locked":
        return <Clock className="h-4 w-4" />
      case "inactive":
        return <UserX className="h-4 w-4" />
      case "credentials":
        return <ShieldAlert className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getErrorTitle = () => {
    switch (state?.errorType) {
      case "locked":
        return "Compte verrouillé"
      case "inactive":
        return "Compte désactivé"
      case "credentials":
        return "Identifiants incorrects"
      case "validation":
        return "Erreur de validation"
      case "database":
        return "Configuration requise"
      default:
        return "Erreur de connexion"
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              {getErrorIcon()}
              <AlertTitle className="text-red-800">{getErrorTitle()}</AlertTitle>
              <AlertDescription className="text-red-700">{state.error}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Connexion réussie</AlertTitle>
              <AlertDescription className="text-green-700">Redirection vers votre tableau de bord...</AlertDescription>
            </Alert>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10 h-11"
                required
                autoComplete="email"
                disabled={isPending || isRedirecting}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11"
                required
                autoComplete="current-password"
                disabled={isPending || isRedirecting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full h-11" disabled={isPending || isRedirecting}>
            {isPending || isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRedirecting ? "Redirection..." : "Connexion en cours..."}
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
