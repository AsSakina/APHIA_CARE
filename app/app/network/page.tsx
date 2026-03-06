import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Network, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ExpensesListSkeleton } from "@/components/app/expenses/expenses-list-skeleton"

export const dynamic = "force-dynamic"

export default function NetworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réseau Inter-Pharmacies</h1>
          <p className="text-muted-foreground mt-2">
            Consultez la disponibilité de produits chez les pharmacies partenaires
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres réseau
        </Button>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Recherche produits</TabsTrigger>
          <TabsTrigger value="partners">Pharmacies partenaires</TabsTrigger>
          <TabsTrigger value="sharing">Partage de données</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chercher un produit dans le réseau</CardTitle>
              <CardDescription>
                Recherchez la disponibilité d'un produit chez les pharmacies ayant opt-in dans le réseau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Nom du produit, code, classe thérapeutique..." />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Chercher
                </Button>
              </div>
              <Suspense fallback={<ExpensesListSkeleton />}>
                <div className="text-sm text-muted-foreground p-6 bg-muted rounded-lg">
                  Résultats de recherche inter-pharmacies - en développement
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Suspense fallback={<ExpensesListSkeleton />}>
            <div className="text-sm text-muted-foreground p-6 bg-card rounded-lg border">
              Liste des pharmacies partenaires du réseau - en développement
            </div>
          </Suspense>
        </TabsContent>

        {/* Data Sharing Tab */}
        <TabsContent value="sharing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partage de données</CardTitle>
              <CardDescription>
                Données partagées et données protégées dans le réseau inter-pharmacies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Partagé</Badge>
                    Données publiques
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✓ Disponibilité produit (oui/non)</li>
                    <li>✓ Prix de vente</li>
                    <li>✓ Numéro de lot</li>
                    <li>✓ Date de péremption</li>
                    <li>✓ Quantité à céder</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">Protégé</Badge>
                    Données confidentielles
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✗ Quantité exacte disponible</li>
                    <li>✗ Prix d'achat</li>
                    <li>✗ Marges et profit</li>
                    <li>✗ Identité des patients</li>
                    <li>✗ Données de santé personnelles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
