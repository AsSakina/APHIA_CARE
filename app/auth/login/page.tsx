"use client"

import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ThemeLogo } from "@/components/landing/theme-logo"
import { ArrowLeft, Shield, Zap, BarChart3 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Bienvenue sur APHIA</h1>
              <p className="text-xl text-white/80 leading-relaxed">
                La plateforme de gestion pharmaceutique qui simplifie votre quotidien.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Tableau de bord financier</h3>
                  <p className="text-white/70 text-sm">Suivez vos revenus et dépenses en temps réel</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Gestion simplifiée</h3>
                  <p className="text-white/70 text-sm">Interface intuitive pour gérer votre pharmacie</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Sécurité maximale</h3>
                  <p className="text-white/70 text-sm">Vos données sont protégées et chiffrées</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} APHIA. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile back link */}
          <div className="lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center space-y-2">
            <Link href="/">
              <ThemeLogo className="h-12 w-auto" />
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground">Accédez à votre espace de gestion</p>
          </div>

          <LoginForm />

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Pas encore de compte?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Créer un compte
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="font-medium mb-2">Comptes de démonstration:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                <span className="font-mono bg-muted px-1 rounded">admin@aphia.sn</span> / admin123
              </p>
              <p>
                <span className="font-mono bg-muted px-1 rounded">pharmacien@aphia.sn</span> / pharma123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
