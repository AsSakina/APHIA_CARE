import { BarcodeTester } from "@/components/app/pos/barcode-tester"
import { BarcodeScannerGuide } from "@/components/app/pos/barcode-scanner-guide"

export const metadata = {
  title: "Configuration Scanner Code Barre | APHIA",
  description: "Guide et testeur pour le lecteur de code barre",
}

export default function BarcodeScannerPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Configuration Scanner Code Barre</h1>
        <p className="text-muted-foreground">
          Guide complet pour utiliser le lecteur de code barre dans APHIA
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <BarcodeScannerGuide />
        </div>
        <div>
          <BarcodeTester />
        </div>
      </div>
    </div>
  )
}
