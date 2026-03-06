import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Calendar, BarChart3 } from "lucide-react"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rapports & Analyses</h1>
          <p className="text-muted-foreground mt-2">
            Générez des rapports détaillés sur vos activités et performances
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="inventory">Inventaire</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>

        {/* Sales Reports */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ventes par période</CardTitle>
                <CardDescription>Analyse jour/semaine/mois/année</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input type="date" placeholder="Date début" />
                  <Input type="date" placeholder="Date fin" />
                  <Button>Générer</Button>
                </div>
                <Suspense fallback={<ExpensesListSkeleton />}>
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                    Rapport des ventes par période - en développement
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ventes par produit</CardTitle>
                <CardDescription>Top produits et catégories</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ExpensesListSkeleton />}>
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                    Classement des produits les plus vendus - en développement
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Reports */}
        <TabsContent value="inventory" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Rapports d'inventaire (mouvements, valorisation, alertes) - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Customer Reports */}
        <TabsContent value="customers" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Rapports clients (panier moyen, fréquence, créances) - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Performance Reports */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">KPI Mensuels</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ExpensesListSkeleton />}>
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                    CA, Marge, OpEx, Résultat net - en développement
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ExpensesListSkeleton />}>
                  <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                    Comparaison avec périodes antérieures - en développement
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Reports */}
        <TabsContent value="compliance" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Rapports de conformité (audit trail, traçabilité, régularisations) - en développement
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
