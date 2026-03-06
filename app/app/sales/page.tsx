import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesRevenue } from "@/components/app/sales/sales-revenue"
import { FilteredSalesHistory } from "@/components/app/sales/filterable-sales-history"
import { SalesReportPage } from "@/components/app/sales/sales-report"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"
import { BarChart3, History, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ventes & Revenus</h1>
        <p className="text-muted-foreground">
          Suivi, historique et rapports des ventes
        </p>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Revenus</span>
          </TabsTrigger>
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
          <TabsTrigger value="rapport" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Rapport</span>
          </TabsTrigger>
        </TabsList>

        {/* Revenue Dashboard */}
        <TabsContent value="revenue" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <SalesRevenue />
          </Suspense>
        </TabsContent>

        {/* Sales History */}
        <TabsContent value="historique" className="space-y-6">
          <FilteredSalesHistory />
        </TabsContent>

        {/* Sales Report */}
        <TabsContent value="rapport" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <SalesReportPage />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
