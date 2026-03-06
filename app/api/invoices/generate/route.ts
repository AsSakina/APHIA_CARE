import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { saleId, htmlContent } = await request.json()

    if (!saleId || !htmlContent) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Get sale info
    const sales = await sql`
      SELECT id, sale_number, is_proforma FROM sales WHERE id = ${saleId}
    `

    if (!sales || sales.length === 0) {
      return NextResponse.json({ error: "Vente non trouvée" }, { status: 404 })
    }

    const sale = sales[0] as { id: string; sale_number: string; is_proforma: boolean }
    const isProforma = sale.is_proforma

    // Check if invoice already exists
    const existingInvoice = await sql`
      SELECT id, invoice_url, invoice_number FROM invoices WHERE sale_id = ${saleId}
    `

    if (existingInvoice && existingInvoice.length > 0) {
      return NextResponse.json({
        success: true,
        invoiceUrl: existingInvoice[0].invoice_url,
        invoiceNumber: existingInvoice[0].invoice_number,
        existing: true,
      })
    }

    // Generate invoice number
    const invoiceNumberResult = await sql`
      SELECT generate_invoice_number(${isProforma}) as invoice_number
    `
    const invoiceNumber = invoiceNumberResult[0].invoice_number

    // Create HTML file for storage
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${isProforma ? "Proforma" : "Facture"} ${invoiceNumber}</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `

    // Upload to Vercel Blob
    const filename = `invoices/${invoiceNumber}.html`
    const blob = await put(filename, fullHtml, {
      access: "public",
      contentType: "text/html",
    })

    // Save invoice record
    await sql`
      INSERT INTO invoices (
        sale_id, invoice_number, invoice_url, invoice_type,
        generated_by, file_size, file_name
      ) VALUES (
        ${saleId}, ${invoiceNumber}, ${blob.url},
        ${isProforma ? "PROFORMA" : "FACTURE"},
        ${user.id}, ${fullHtml.length}, ${filename}
      )
      RETURNING id
    `

    // Update sale with invoice reference
    await sql`
      UPDATE sales SET invoice_id = (
        SELECT id FROM invoices WHERE sale_id = ${saleId}
      )
      WHERE id = ${saleId}
    `

    return NextResponse.json({
      success: true,
      invoiceUrl: blob.url,
      invoiceNumber,
    })
  } catch (error) {
    console.error("Generate invoice error:", error)
    return NextResponse.json({ error: "Erreur lors de la génération de la facture" }, { status: 500 })
  }
}
