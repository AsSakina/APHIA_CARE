import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function ProformaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures Pro-forma</h1>
          <p className="text-muted-foreground mt-2">
            Créez des devis et factures non comptabilisées pour vos clients
          </p>
        </div>
        <Button asChild>
          <Link href="/app/pos/proforma/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle pro-forma
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Factures actives</TabsTrigger>
          <TabsTrigger value="converted">Converties en vente</TabsTrigger>
          <TabsTrigger value="expired">Expirées</TabsTrigger>
        </TabsList>

        {/* Active Proformas */}
        <TabsContent value="active" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Factures pro-forma en attente de conversion en vente - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Converted to Sales */}
        <TabsContent value="converted" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Factures pro-forma converties en ventes comptabilisées - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Expired Proformas */}
        <TabsContent value="expired" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Factures pro-forma expirées ou annulées - en développement
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
