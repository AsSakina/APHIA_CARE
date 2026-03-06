"use server"

import { importExcelProducts } from "@/lib/mock-data"
import { parseExcelData } from "@/lib/excel-import"
import type { ImportResult } from "@/lib/excel-import"
import { revalidatePath } from "next/cache"

export async function processExcelImport(fileContent: string): Promise<ImportResult> {
  try {
    const products = parseExcelData(fileContent)

    if (products.length === 0) {
      return {
        success: false,
        created: 0,
        updated: 0,
        errors: ["Aucun produit valide trouvé dans le fichier"],
        products: [],
      }
    }

    const result = importExcelProducts(products)

    revalidatePath("/app/stock")
    revalidatePath("/app/stock/movements")

    return result
  } catch (error) {
    return {
      success: false,
      created: 0,
      updated: 0,
      errors: [error instanceof Error ? error.message : "Erreur lors du traitement du fichier"],
      products: [],
    }
  }
}
