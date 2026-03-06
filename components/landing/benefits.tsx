import { Clock, TrendingDown, BarChart3, Globe } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Gain de temps au comptoir",
    description: "Réduisez le temps passé sur les tâches administratives et concentrez-vous sur vos patients.",
  },
  {
    icon: TrendingDown,
    title: "Réduction des pertes",
    description: "Minimisez les pertes liées aux péremptions grâce à une gestion proactive des stocks.",
  },
  {
    icon: BarChart3,
    title: "Meilleure visibilité financière",
    description: "Prenez des décisions éclairées avec des rapports financiers clairs et détaillés.",
  },
  {
    icon: Globe,
    title: "Adapté au contexte africain",
    description: "Conçu spécifiquement pour répondre aux besoins des pharmacies en Afrique.",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pourquoi choisir APHIA ?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Des avantages concrets pour votre pharmacie au quotidien.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 dark:hover:border-secondary/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <benefit.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
