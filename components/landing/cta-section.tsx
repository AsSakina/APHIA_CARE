import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"

export function CtaSection() {
  return (
    <section id="contact" className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Prêt à transformer votre pharmacie ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
          Rejoignez les pharmacies qui ont déjà adopté APHIA pour une gestion plus efficace.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/auth/login">
              Commencer avec APHIA
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto bg-transparent">
            <Link href="mailto:contact@aphia.app">
              <Mail className="mr-2 h-4 w-4" />
              Contacter l'équipe
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
