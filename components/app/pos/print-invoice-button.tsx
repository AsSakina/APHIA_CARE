"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Printer, Loader2, Download, Cloud, ChevronDown, CheckCircle2 } from "lucide-react"
import { InvoiceTemplate } from "./invoice-template"
import type { Sale, SaleItem } from "@/lib/types"
import { toast } from "sonner"

interface PrintInvoiceButtonProps {
  sale: Sale & {
    items?: SaleItem[]
    patient_name?: string
    ipm_name?: string
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showDownload?: boolean
}

export function PrintInvoiceButton({
  sale,
  variant = "outline",
  size = "default",
  showDownload = false,
}: PrintInvoiceButtonProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedUrl, setSavedUrl] = useState<string | null>(null)

  const handlePrint = async () => {
    setIsPrinting(true)

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      setIsPrinting(false)
      return
    }

    const invoiceContent = invoiceRef.current?.innerHTML || ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${sale.sale_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `)

    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
      printWindow.close()
      setIsPrinting(false)
    }

    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.print()
        printWindow.close()
      }
      setIsPrinting(false)
    }, 1000)
  }

  const handleSaveOnline = async () => {
    setIsSaving(true)

    try {
      const invoiceContent = invoiceRef.current?.innerHTML || ""

      const response = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleId: sale.id,
          htmlContent: invoiceContent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la sauvegarde")
      }

      setSavedUrl(data.invoiceUrl)
      toast.success(data.existing ? "Facture déjà sauvegardée" : "Facture sauvegardée en ligne", {
        description: `N° ${data.invoiceNumber}`,
      })
    } catch (error) {
      console.error("Save invoice error:", error)
      toast.error("Erreur lors de la sauvegarde de la facture")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    if (savedUrl) {
      window.open(savedUrl, "_blank")
    } else {
      handlePrint()
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} disabled={isPrinting || isSaving} className="bg-transparent">
              {isPrinting || isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Printer className="mr-2 h-4 w-4" />
              )}
              Facture
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handlePrint} disabled={isPrinting}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSaveOnline} disabled={isSaving}>
              {savedUrl ? <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> : <Cloud className="mr-2 h-4 w-4" />}
              {savedUrl ? "Déjà sauvegardée" : "Sauvegarder en ligne"}
            </DropdownMenuItem>
            {savedUrl && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open(savedUrl, "_blank")}>
                  <Download className="mr-2 h-4 w-4" />
                  Voir la facture en ligne
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {showDownload && (
          <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={isPrinting}
            className="bg-transparent"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        )}
      </div>

      {/* Hidden invoice template for printing */}
      <div className="hidden">
        <InvoiceTemplate ref={invoiceRef} sale={sale} />
      </div>
    </>
  )
}
