"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Barcode, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const TEST_BARCODES = [
  { code: "3614290255360", product: "Paracétamol 500mg", internal: "PARA001" },
  { code: "3400938016763", product: "Ibuprofène 400mg", internal: "IBUP001" },
  { code: "3400936105706", product: "Amoxicilline 500mg", internal: "AMOX001" },
  { code: "3701143805017", product: "Vitamine C 1000mg", internal: "VITC001" },
  { code: "3400936199701", product: "Oméprazole 20mg", internal: "OMEP001" },
  { code: "3614290254653", product: "Doliprane 1000mg", internal: "DOLP001" },
  { code: "3400936198994", product: "Azithromycine 250mg", internal: "AZIT001" },
  { code: "3400936247556", product: "Losartan 50mg", internal: "LOSC001" },
  { code: "3400936124588", product: "Metformine 500mg", internal: "METF001" },
  { code: "3701143800011", product: "Sérum physiologique 500ml", internal: "SERU001" },
]

export function BarcodeTester() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, product: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Code copié: ${product}`)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const simulateScan = (code: string) => {
    // Simule la saisie du code barre comme le ferait un scanner
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    })
    
    // Inject characters
    for (const char of code) {
      const charEvent = new KeyboardEvent("keydown", {
        key: char,
        bubbles: true,
        cancelable: true,
      })
      window.dispatchEvent(charEvent)
    }
    
    // Send Enter
    window.dispatchEvent(event)
    toast.success("Scan simulé: " + code)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="size-5" />
            Testeur de Codes Barre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {TEST_BARCODES.map((item) => (
              <div
                key={item.code}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex-1 font-mono text-sm">
                  <div className="font-semibold">{item.product}</div>
                  <div className="text-xs text-muted-foreground">
                    EAN: {item.code} • Code: {item.internal}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(item.code, item.product)}
                    className="bg-transparent"
                  >
                    {copiedCode === item.code ? (
                      <>
                        <Check className="size-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => simulateScan(item.code)}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Comment utiliser:
            </p>
            <ul className="text-xs space-y-1 text-blue-800 dark:text-blue-200">
              <li>• <strong>Test</strong>: Simule un scan dans l'application</li>
              <li>• <strong>Copier</strong>: Copie le code pour coller ailleurs</li>
              <li>• Ouvrez le POS et testez avec le bouton "Test"</li>
              <li>• Le produit devrait s'ajouter automatiquement au panier</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
