import { headers } from "next/headers"
import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ExpenseCategory } from "@/lib/types"

export const dynamic = "force-dynamic"

async function getCategories() {
  try {
    const categories = await sql`
      SELECT id, code, name, parent_id, description, is_active
      FROM expense_account_categories
      WHERE deleted_at IS NULL
      ORDER BY code
    `
    return categories as ExpenseCategory[]
  } catch {
    return []
  }
}

export default async function CategoriesPage() {
  await headers()

  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Catégories comptables</h1>
        <p className="text-muted-foreground">Plan comptable simplifié pour les dépenses</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune catégorie disponible</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Code</th>
                    <th className="text-left py-3 font-medium">Nom</th>
                    <th className="text-left py-3 font-medium">Description</th>
                    <th className="text-center py-3 font-medium">Actif</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b last:border-0">
                      <td className="py-3 font-mono text-sm">{cat.code}</td>
                      <td className="py-3 font-medium">{cat.name}</td>
                      <td className="py-3 text-muted-foreground">{cat.description || "-"}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block size-2 rounded-full ${cat.is_active ? "bg-emerald-500" : "bg-muted"}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
