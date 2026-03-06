"use client"

import { AlertCircle, Barcode, Check, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BarcodeScannerGuide() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="size-5" />
            Guide du Lecteur de Code Barre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>Configuration rapide</AlertTitle>
            <AlertDescription>
              Connectez votre lecteur de code barre USB. Il fonctionnera automatiquement comme un clavier qui tape les codes.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Comment utiliser:</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>Assurez-vous que le scanner est actif (point vert animé)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>Scannez le code barre du médicament avec votre lecteur</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>Le produit est automatiquement ajouté au panier</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>Vous verrez une notification de confirmation</span>
              </li>
            </ol>
          </div>

          <Alert variant="default">
            <Check className="h-4 w-4" />
            <AlertTitle>Codes barre supportés</AlertTitle>
            <AlertDescription>
              EAN-13, Code128, QR Code et autres formats standard. Consultez la documentation de votre lecteur.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Dépannage</AlertTitle>
            <AlertDescription className="space-y-1">
              <div>• Si aucun produit n'est trouvé: Le code barre n'est pas enregistré dans le système</div>
              <div>• Utilisez la recherche manuelle pour ajouter le produit</div>
              <div>• Vérifiez que le scanner est bien connecté et actif</div>
            </AlertDescription>
          </Alert>

          <div className="text-xs text-muted-foreground pt-2">
            💡 Astuce: Vous pouvez également utiliser les codes internes (ex: PARA001) au format texte
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
