import { LossForm } from "@/components/app/losses/loss-form"
import { mockProducts } from "@/lib/mock-data"

export default async function NewLossPage() {
  const products = mockProducts.filter((p) => p.is_active)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Déclarer une perte</h1>
        <p className="text-muted-foreground">Enregistrez une perte de stock avec sa valeur financière</p>
      </div>
      <LossForm products={products} />
    </div>
  )
}
