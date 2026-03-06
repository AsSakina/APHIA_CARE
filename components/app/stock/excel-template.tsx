"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const ExcelTemplate = () => {
  const downloadTemplate = () => {
    // Create CSV template content
    const headers = [
      "code",
      "nom",
      "quantité",
      "prix_vente",
      "prix_achat",
      "fournisseur",
      "date",
      "code_barre",
      "categorie",
    ]

    const sampleData = [
      [
        "PARA001",
        "Paracétamol 500mg",
        "50",
        "1500",
        "800",
        "Pharma Distribution",
        "2025-01-28",
        "3614290001234",
        "Antalgiques",
      ],
      [
        "IBUP001",
        "Ibuprofène 400mg",
        "30",
        "2500",
        "1200",
        "Pharma Distribution",
        "2025-01-28",
        "3614290001235",
        "Anti-inflammatoires",
      ],
      [
        "AMOX001",
        "Amoxicilline 500mg",
        "20",
        "3500",
        "2000",
        "Laboratoires ABC",
        "2025-01-27",
        "3614290001236",
        "Antibiotiques",
      ],
    ]

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) =>
        row.map((cell) => (cell.includes(",") ? `"${cell}"` : cell)).join(","),
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "template_produits.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={downloadTemplate} variant="outline" className="bg-transparent">
      <Download className="mr-2 size-4" />
      Télécharger le modèle
    </Button>
  )
}

export { ExcelTemplate }
export default ExcelTemplate
