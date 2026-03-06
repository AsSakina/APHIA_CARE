import { Suspense } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { IpmList } from "@/components/app/ipm/ipm-list"
import { IpmReceivables } from "@/components/app/ipm/ipm-receivables"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function IpmPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IPM / Mutuelles</h1>
          <p className="text-muted-foreground">Gestion des organismes et des créances</p>
        </div>
        <Button asChild>
          <Link href="/app/ipm/new">
            <Plus className="size-4 mr-2" />
            Nouvel IPM
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="receivables" className="w-full">
        <TabsList>
          <TabsTrigger value="receivables">Créances</TabsTrigger>
          <TabsTrigger value="mutuelles">Mutuelles</TabsTrigger>
        </TabsList>

        <TabsContent value="receivables" className="space-y-6">
          <IpmReceivables />
        </TabsContent>

        <TabsContent value="mutuelles" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <IpmList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
