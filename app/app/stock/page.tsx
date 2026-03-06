import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StockInventory } from "@/components/app/stock/stock-inventory"
import { ExcelImportForm } from "@/components/app/stock/excel-import-form"
import { StockEntryForm } from "@/components/app/stock/stock-entry-form"
import { StockHistoryPage } from "@/components/app/stock/stock-history"
import { StockAlertsPage } from "@/components/app/stock/stock-alerts"
import { StockMovementsList } from "@/components/app/stock/stock-movements-list"
import { StockEntriesForm } from "@/components/app/stock/stock-entries-form"
import { StockLossesForm } from "@/components/app/stock/stock-losses-form"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"
import { mockProducts } from "@/lib/mock-data"
import { Package, Bell, Plus, ArrowRightLeft, Trash2, Upload } from "lucide-react"

export const dynamic = "force-dynamic"

export default function StockPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Centrale des Stocks</h1>
        <p className="text-muted-foreground mt-2">
          Gérez l'inventaire, les mouvements, les lots et les dates d'expiration
        </p>
      </div>

      <Tabs defaultValue="inventaire" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
          {/* Inventaire Tab */}
          <TabsTrigger value="inventaire" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Inventaire</span>
          </TabsTrigger>

          {/* Alerts Tab */}
          <TabsTrigger value="alertes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertes</span>
          </TabsTrigger>

          {/* Movements Tab */}
          <TabsTrigger value="mouvements" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Mouvements</span>
          </TabsTrigger>

          {/* Add Entry Tab */}
          <TabsTrigger value="entree" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Entrée</span>
          </TabsTrigger>

          {/* Losses Tab */}
          <TabsTrigger value="pertes" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Pertes</span>
          </TabsTrigger>

          {/* Import Tab */}
          <TabsTrigger value="importer" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Importer</span>
          </TabsTrigger>
        </TabsList>

        {/* INVENTAIRE - Liste complète des produits avec quantités, lots, expiration */}
        <TabsContent value="inventaire" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <StockInventory />
          </Suspense>
        </TabsContent>

        {/* ALERTES - Stock faible et ruptures */}
        <TabsContent value="alertes" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <StockAlertsPage />
          </Suspense>
        </TabsContent>

        {/* MOUVEMENTS - Historique des entrées/sorties/ajustements */}
        <TabsContent value="mouvements" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <StockMovementsList />
          </Suspense>
        </TabsContent>

        {/* NOUVELLE ENTRÉE - Formulaire d'ajout de stock */}
        <TabsContent value="entree" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Enregistrer une entrée de stock</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ajoutez des quantités de produits à votre inventaire
            </p>
            <StockEntriesForm />
          </div>
        </TabsContent>

        {/* PERTES - Enregistrer les pertes/casses */}
        <TabsContent value="pertes" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Enregistrer une perte de stock</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Documentez les pertes, casses ou expirations
            </p>
            <StockLossesForm />
          </div>
        </TabsContent>

        {/* IMPORTER - Excel et fichiers */}
        <TabsContent value="importer" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Importer l'inventaire</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Chargez un fichier Excel pour mettre à jour vos stocks en masse
            </p>
            <ExcelImportForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
