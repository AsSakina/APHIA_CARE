export interface ExcelProductRow {
  code?: string
  name: string
  quantity: number
  unit_price: number
  purchase_price?: number
  supplier?: string
  date?: string
  barcode?: string
  category?: string
}

export interface ImportResult {
  success: boolean
  created: number
  updated: number
  errors: string[]
  products: Array<{
    code?: string
    name: string
    status: "created" | "updated"
    quantity: number
    unit_price: number
  }>
}

export function parseExcelData(fileContent: string): ExcelProductRow[] {
  const lines = fileContent.split("\n").filter((line) => line.trim())
  const products: ExcelProductRow[] = []

  // Skip header row if present
  const startIndex = lines[0].toLowerCase().includes("code") ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // CSV/TSV parsing - handle both comma and tab delimiters
    const values = line.includes("\t") ? line.split("\t") : line.split(",").map((v) => v.trim())

    if (values.length < 2) continue

    try {
      const product: ExcelProductRow = {
        code: values[0]?.trim() || undefined,
        name: values[1]?.trim() || "Unknown",
        quantity: Number.parseInt(values[2] || "0") || 0,
        unit_price: Number.parseFloat(values[3] || "0") || 0,
        purchase_price: Number.parseFloat(values[4] || values[3] || "0") || 0,
        supplier: values[5]?.trim() || undefined,
        date: values[6]?.trim() || undefined,
        barcode: values[7]?.trim() || undefined,
        category: values[8]?.trim() || undefined,
      }

      if (product.name && product.unit_price > 0) {
        products.push(product)
      }
    } catch (e) {
      console.error("Error parsing row:", line)
    }
  }

  return products
}
