"use client"

import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { ThemeLogo } from "@/components/landing/theme-logo"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
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
              <h1 className="text-4xl font-bold mb-4">Rejoignez APHIA</h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Créez votre compte et commencez à gérer votre pharmacie efficacement.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Accès immédiat à tous les modules</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Configuration guidée étape par étape</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Support technique inclus</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Données sécurisées et sauvegardées</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
                <span>Mises à jour automatiques</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-sm">© {new Date().getFullYear()} APHIA. Tous droits réservés.</p>
        </div>
      </div>

      {/* Right side - Register form */}
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
            <h1 className="text-2xl font-semibold text-foreground">Créer un compte</h1>
            <p className="text-sm text-muted-foreground">Inscrivez-vous pour accéder à APHIA</p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
