import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground">
          Plateforme de gestion pharmaceutique
        </span>

        <h1 className="mt-8 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          La plateforme intelligente de gestion pour{" "}
          <span className="text-primary dark:text-secondary">pharmacies</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Optimisez votre gestion des stocks, simplifiez vos finances et suivez vos performances en temps réel. Une
          solution complète adaptée aux pharmacies africaines.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/auth/login">
              Accéder à la plateforme
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent">
            <Link href="#contact">
              <Play className="mr-2 h-4 w-4" />
              Demander une démo
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">Utilisé par des pharmacies à travers l'Afrique de l'Ouest</p>
      </div>
    </section>
  )
}
