"use client"

import { useActionState, useState, useEffect, useTransition } from "react"
import { register } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  CheckCircle2,
  UserPlus,
  AtSign,
  Database,
  Building2,
} from "lucide-react"

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      setIsRedirecting(true)
      startTransition(() => {
        window.location.href = state.redirectTo!
      })
    }
  }, [state])

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isPasswordStrong = hasMinLength && hasUppercase && hasLowercase && hasNumber

  const getErrorIcon = () => {
    switch (state?.errorType) {
      case "exists":
        return <Mail className="h-4 w-4 text-orange-600" />
      case "validation":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "database":
        return <Database className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getErrorTitle = () => {
    switch (state?.errorType) {
      case "exists":
        return "Email ou nom d'utilisateur déjà utilisé"
      case "validation":
        return "Erreur de validation"
      case "database":
        return "Configuration requise"
      default:
        return "Erreur d'inscription"
    }
  }

  const hasFieldError = (field: string) => {
    return state?.fieldErrors?.[field]
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="pt-6">
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <Alert
              variant={state?.errorType === "exists" ? "default" : "destructive"}
              className={state?.errorType === "exists" ? "border-orange-200 bg-orange-50" : "border-red-200 bg-red-50"}
            >
              {getErrorIcon()}
              <AlertTitle className={state?.errorType === "exists" ? "text-orange-800" : "text-red-800"}>
                {getErrorTitle()}
              </AlertTitle>
              <AlertDescription className={state?.errorType === "exists" ? "text-orange-700" : "text-red-700"}>
                {state.error}
              </AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Compte créé avec succès</AlertTitle>
              <AlertDescription className="text-green-700">
                Bienvenue sur APHIA ! Redirection en cours...
              </AlertDescription>
            </Alert>
          )}

          {/* Pharmacy name field */}
          <div className="space-y-2">
            <Label htmlFor="pharmacyName">
              Nom de votre pharmacie <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pharmacyName"
                name="pharmacyName"
                type="text"
                placeholder="Pharmacie du Centre"
                className={`pl-10 h-11 ${hasFieldError("pharmacyName") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                disabled={isPending || isRedirecting}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Chaque inscription crée une nouvelle pharmacie. Vous en serez le propriétaire.
            </p>
            {hasFieldError("pharmacyName") && (
              <p className="text-xs text-red-500">{state?.fieldErrors?.pharmacyName}</p>
            )}
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Prénom"
                  className={`pl-10 h-11 ${hasFieldError("firstName") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  required
                  autoComplete="given-name"
                  disabled={isPending || isRedirecting}
                />
              </div>
              {hasFieldError("firstName") && <p className="text-xs text-red-500">{state?.fieldErrors?.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Nom"
                className={`h-11 ${hasFieldError("lastName") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                autoComplete="family-name"
                disabled={isPending || isRedirecting}
              />
              {hasFieldError("lastName") && <p className="text-xs text-red-500">{state?.fieldErrors?.lastName}</p>}
            </div>
          </div>

          {/* Username field */}
          <div className="space-y-2">
            <Label htmlFor="username">
              Nom d'utilisateur <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="nom.utilisateur"
                className={`pl-10 h-11 ${hasFieldError("username") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                autoComplete="username"
                disabled={isPending || isRedirecting}
                pattern="^[a-zA-Z0-9._-]{3,30}$"
                title="3-30 caractères, lettres, chiffres, points, tirets ou underscores"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              3-30 caractères: lettres, chiffres, points, tirets ou underscores
            </p>
            {hasFieldError("username") && <p className="text-xs text-red-500">{state?.fieldErrors?.username}</p>}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Adresse email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                className={`pl-10 h-11 ${hasFieldError("email") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                autoComplete="email"
                disabled={isPending || isRedirecting}
              />
            </div>
            {hasFieldError("email") && <p className="text-xs text-red-500">{state?.fieldErrors?.email}</p>}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Mot de passe <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 caractères"
                className={`pl-10 pr-10 h-11 ${hasFieldError("password") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isPending || isRedirecting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {hasFieldError("password") && <p className="text-xs text-red-500">{state?.fieldErrors?.password}</p>}
            {/* Password strength indicators */}
            {password && (
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div className={`flex items-center gap-1 ${hasMinLength ? "text-green-600" : "text-muted-foreground"}`}>
                  {hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}8 caractères min.
                </div>
                <div className={`flex items-center gap-1 ${hasUppercase ? "text-green-600" : "text-muted-foreground"}`}>
                  {hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  Une majuscule
                </div>
                <div className={`flex items-center gap-1 ${hasLowercase ? "text-green-600" : "text-muted-foreground"}`}>
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

          {/* Confirm password field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirmer le mot de passe <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer"
                className={`pl-10 pr-10 h-11 ${hasFieldError("confirmPassword") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                minLength={8}
                autoComplete="new-password"
                disabled={isPending || isRedirecting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {hasFieldError("confirmPassword") && (
              <p className="text-xs text-red-500">{state?.fieldErrors?.confirmPassword}</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-11"
            disabled={isPending || isRedirecting || (password.length > 0 && !isPasswordStrong)}
          >
            {isPending || isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isRedirecting ? "Redirection..." : "Création en cours..."}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Créer ma pharmacie
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            En créant un compte, vous acceptez nos{" "}
            <a href="#" className="underline hover:text-foreground">
              conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="underline hover:text-foreground">
              politique de confidentialité
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
