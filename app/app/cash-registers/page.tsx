import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashRegistersList } from "@/components/app/cash-registers/cash-registers-list"
import { CashSessionDetails } from "@/components/app/cash-registers/cash-session-details"
import { CashSessionsHistory } from "@/components/app/cash-registers/cash-sessions-history"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"
import { DollarSign, Clock, TrendingUp, History, Settings } from "lucide-react"

export const dynamic = "force-dynamic"

export default function CashRegistersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Caisses</h1>
        <p className="text-muted-foreground mt-2">
          Ouverture/fermeture, suivi des encaissements et solde de caisse
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {/* Dashboard Tab */}
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>

          {/* Current Session Tab */}
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Session active</span>
          </TabsTrigger>

          {/* Movements Tab */}
          <TabsTrigger value="mouvements" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Mouvements</span>
          </TabsTrigger>

          {/* History Tab */}
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>

          {/* Settings Tab */}
          <TabsTrigger value="parametres" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <CashRegistersList />
          </Suspense>
        </TabsContent>

        {/* Current Session Tab Content */}
        <TabsContent value="session" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <CashSessionDetails />
          </Suspense>
        </TabsContent>

        {/* Movements Tab Content */}
        <TabsContent value="mouvements" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <CashSessionDetails />
          </Suspense>
        </TabsContent>

        {/* History Tab Content */}
        <TabsContent value="historique" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <CashSessionsHistory />
          </Suspense>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="parametres" className="space-y-6">
          <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
            Paramètres des caisses - en développement
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
