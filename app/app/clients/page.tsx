import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateClientForm } from "@/components/app/clients/create-client-form"
import { ClientsList } from "@/components/app/clients/clients-list"
import { Users, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-7 w-7" />
          Gestion des Clients/Patients
        </h1>
        <p className="text-muted-foreground">
          Créez et gérez les profils de vos clients pour autoriser les crédits
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Liste des clients</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Créer un client</span>
          </TabsTrigger>
        </TabsList>

        {/* Clients List */}
        <TabsContent value="list" className="space-y-6">
          <Suspense fallback={<div className="text-center py-8">Chargement...</div>}>
            <ClientsList />
          </Suspense>
        </TabsContent>

        {/* Create Client */}
        <TabsContent value="create" className="space-y-6">
          <CreateClientForm />
        </TabsContent>
      </Tabs>

      {/* Information Box */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
          À propos du crédit client
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
          <li>Un client doit avoir un compte pour bénéficier de crédits</li>
          <li>La limite de crédit est définie lors de la création du compte</li>
          <li>Vous pouvez activer/désactiver le crédit pour chaque client</li>
          <li>Le solde du crédit se met à jour après chaque vente à crédit</li>
        </ul>
      </div>
    </div>
  )
}
