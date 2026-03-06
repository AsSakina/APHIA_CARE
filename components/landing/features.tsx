import { Package, Wallet, FileText, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Package,
    title: "Gestion des stocks",
    description:
      "Suivez vos lots, dates de péremption et inventaires en temps réel. Alertes automatiques pour éviter les ruptures.",
  },
  {
    icon: Wallet,
    title: "Gestion financière simplifiée",
    description: "Tableau de bord financier complet. Suivez vos recettes, dépenses et marges en un coup d'œil.",
  },
  {
    icon: FileText,
    title: "Suivi des créances",
    description: "Gérez facilement vos créances IPM et mutuelles. Relances automatiques et historique détaillé.",
  },
  {
    icon: Shield,
    title: "Traçabilité et audit",
    description: "Historique complet de toutes les opérations. Conformité aux normes pharmaceutiques garantie.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fonctionnalités principales
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Des outils puissants pour une gestion pharmaceutique moderne et efficace.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
