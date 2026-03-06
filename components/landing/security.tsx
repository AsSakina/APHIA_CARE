import { Lock, Users, ClipboardCheck, Award } from "lucide-react"

const securityFeatures = [
  {
    icon: Lock,
    title: "Sécurité des données",
    description: "Vos données sont chiffrées et protégées selon les standards les plus stricts.",
  },
  {
    icon: Users,
    title: "Accès par rôles",
    description: "Contrôlez qui peut accéder à quoi avec une gestion fine des permissions.",
  },
  {
    icon: ClipboardCheck,
    title: "Auditabilité complète",
    description: "Chaque action est tracée pour une transparence totale.",
  },
  {
    icon: Award,
    title: "Bonnes pratiques",
    description: "Conformité aux réglementations pharmaceutiques en vigueur.",
  },
]

export function Security() {
  return (
    <section
      id="security"
      className="bg-primary px-4 py-20 text-primary-foreground sm:px-6 sm:py-28 lg:px-8 dark:bg-card"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Sécurité et fiabilité</h2>
          <p className="mt-4 text-pretty text-lg opacity-90">
            Une plateforme conçue pour protéger vos données sensibles.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <feature.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
