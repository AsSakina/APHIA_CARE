import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail & Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Journalisation complète de toutes les opérations et accès à la plateforme
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exporter rapport
        </Button>
      </div>

      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audit">Journalisation</TabsTrigger>
          <TabsTrigger value="modifications">Modifications</TabsTrigger>
          <TabsTrigger value="accès">Accès</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Journal d'audit complet avec horodatage et identification utilisateur - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Modifications Tab */}
        <TabsContent value="modifications" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Historique des modifications (avant/après) - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Access Tab */}
        <TabsContent value="accès" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Logs d'accès super admin et accès inter-tenant - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Rapports de conformité et traçabilité - en développement
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
