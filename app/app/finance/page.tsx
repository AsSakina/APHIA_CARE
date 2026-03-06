import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3 } from "lucide-react"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"
import { formatCurrency } from "@/lib/format"

export const dynamic = "force-dynamic"

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Finance</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble des indicateurs financiers clés de votre pharmacie
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450,000 FCFA</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marge Brute</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">735,000 FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">
              30% du chiffre d'affaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Charges OpEx</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">420,000 FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">
              17% du chiffre d'affaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résultat Net</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">315,000 FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">
              13% du chiffre d'affaires
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="receivables">Créances IPM</TabsTrigger>
          <TabsTrigger value="losses">Pertes</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Graphiques d'analyse financière (CA, Marge, OpEx, Résultat) - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Receivables Tab */}
        <TabsContent value="receivables" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">850,000 FCFA</div>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">15 mutuelles</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">En retard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320,000 FCFA</div>
                <Badge className="mt-2 bg-red-100 text-red-800">5 mutuelles</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Encaissées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,200,000 FCFA</div>
                <Badge className="mt-2 bg-green-100 text-green-800">28 mutuelles</Badge>
              </CardContent>
            </Card>
          </div>

          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Liste détaillée des créances IPM avec délais de recouvrement - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Losses Tab */}
        <TabsContent value="losses" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Suivi des pertes (expirations, casses, ajustements) avec impact financier - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Analyses de tendances et comparaisons périodiques - en développement
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
