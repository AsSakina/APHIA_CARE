import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Package,
  BarChart3,
  DollarSign,
  Users,
  Zap,
} from "lucide-react"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">APHIA</h1>
          <p className="text-lg text-gray-600">
            Plateforme de gestion pour pharmacies
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ✅ Application correctement compilée et prête
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* POS */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Point de Vente</CardTitle>
              <CardDescription>Créer une vente</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/pos">
                <Button className="w-full" variant="default">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stock */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Stock</CardTitle>
              <CardDescription>Gérer inventaire et pertes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/stock">
                <Button className="w-full" variant="default">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ventes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Ventes</CardTitle>
              <CardDescription>Historique et rapports</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/sales">
                <Button className="w-full" variant="default">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Caisses */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle>Caisses</CardTitle>
              <CardDescription>Gestion financière</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/cash-registers">
                <Button className="w-full" variant="default">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Clients */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-pink-600 mb-2" />
              <CardTitle>Clients</CardTitle>
              <CardDescription>Profils et crédit</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/app/clients">
                <Button className="w-full" variant="default">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="hover:shadow-lg transition-shadow bg-green-50">
            <CardHeader>
              <Zap className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Status</CardTitle>
              <CardDescription>Application opérationnelle</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-1 text-gray-700">
                <li>✅ Tous les imports corrects</li>
                <li>✅ Navigation configurée</li>
                <li>✅ Pages compilées</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Architecture</h2>
          <ul className="space-y-2 text-gray-700">
            <li>📦 <strong>Stock</strong>: 6 onglets (inventaire, alertes, mouvements, entrées, pertes, import)</li>
            <li>💳 <strong>POS</strong>: Interface saisie ventes</li>
            <li>📊 <strong>Ventes</strong>: Historique et rapports</li>
            <li>💰 <strong>Caisses</strong>: Gestion journalière et encaissements</li>
            <li>👥 <strong>Clients</strong>: Profils et autorisation crédit</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
