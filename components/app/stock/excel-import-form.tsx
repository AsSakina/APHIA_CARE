"use client"

import React, { useState } from "react"
import { Upload, CheckCircle, AlertCircle, Loader, FileUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { processExcelImport } from "@/app/app/stock/import-actions"
import { ExcelTemplate } from "./excel-template"
import type { ImportResult } from "@/lib/excel-import"

export function ExcelImportForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  async function processFile(file: File) {
    if (!file.name.match(/\.(xlsx|xls|csv|txt)$/i)) {
      toast.error("Veuillez sélectionner un fichier Excel ou CSV valide")
      return
    }

    setIsLoading(true)

    try {
      const fileContent = await file.text()

      const importResult = await processExcelImport(fileContent)

      setResult(importResult)

      if (importResult.success || importResult.created + importResult.updated > 0) {
        toast.success(
          `Import réussi: ${importResult.created} créé(s), ${importResult.updated} mis à jour`,
        )
      }

      if (importResult.errors.length > 0) {
        importResult.errors.forEach((error) => toast.error(error))
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors du chargement du fichier")
      setResult({
        success: false,
        created: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : "Erreur inconnue"],
        products: [],
      })
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    const file = files[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Importer des produits</CardTitle>
            <CardDescription>
              Téléchargez un fichier Excel ou CSV avec les colonnes: code, nom, quantité, prix vente, prix achat (optionnel), fournisseur (optionnel), date (optionnel), code barre (optionnel)
            </CardDescription>
          </div>
          <ExcelTemplate />
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.txt"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="flex justify-center">
                {isLoading ? (
                  <Loader className="size-12 animate-spin text-muted-foreground" />
                ) : (
                  <FileUp className="size-12 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragging ? "Déposez votre fichier ici" : "Importer des produits et stocks"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Déposez votre fichier Excel/CSV ou
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="bg-transparent"
                >
                  <Upload className="mr-2 size-4" />
                  {isLoading ? "Chargement..." : "Sélectionner un fichier"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés: .xlsx, .xls, .csv, .txt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className={result.success || result.created + result.updated > 0 ? "border-green-200" : "border-red-200"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success || result.created + result.updated > 0 ? (
                <>
                  <CheckCircle className="size-5 text-green-600" />
                  Import réussi
                </>
              ) : (
                <>
                  <AlertCircle className="size-5 text-red-600" />
                  Erreurs détectées
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">Créé</p>
                <p className="text-2xl font-bold text-green-600">{result.created}</p>
              </div>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">Mis à jour</p>
                <p className="text-2xl font-bold text-blue-600">{result.updated}</p>
              </div>
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">Erreurs</p>
                <p className="text-2xl font-bold text-red-600">{result.errors.length}</p>
              </div>
            </div>

            {result.products.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Produits importés</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 rounded-md border p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{product.quantity} unités</p>
                        <p className="text-sm text-muted-foreground">{product.unit_price} FCFA</p>
                      </div>
                      <Badge variant={product.status === "created" ? "default" : "secondary"}>
                        {product.status === "created" ? "Créé" : "Mis à jour"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-600">Erreurs</h3>
                <div className="space-y-1">
                  {result.errors.map((error, idx) => (
                    <p key={idx} className="text-sm text-red-600">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
