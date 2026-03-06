import { IpmForm } from "@/components/app/ipm/ipm-form"

export default function NewIpmPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvel IPM / Mutuelle</h1>
        <p className="text-muted-foreground">Ajoutez un nouvel organisme de couverture santé</p>
      </div>
      <IpmForm />
    </div>
  )
}
