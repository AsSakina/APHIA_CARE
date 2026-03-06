# Guide d'Utilisation du Lecteur de Code Barre APHIA

## Configuration Matérielle

### Matériel Compatible
- **Lecteurs USB standards**: La plupart des lecteurs de code barre du commerce
- **Formats supportés**: 
  - EAN-13 (code barre international)
  - EAN-8
  - Code128
  - Code39
  - QR Code (avec lecteur compatible)
  - Format propriétaire

### Installation
1. Connectez le lecteur de code barre en USB à l'ordinateur
2. Aucun pilote supplémentaire nécessaire (utilise les pilotes HID standards)
3. Le scanner est prêt à utiliser

## Fonctionnement dans APHIA

### Mode de Scan
Le lecteur fonctionne comme un **clavier virtuel**:
- Quand vous scannez un code barre, le lecteur simule la saisie du code
- Vous verrez le code s'afficher dans la barre de statut du scanner
- Le système recherche automatiquement le produit en base de données

### Process de Vente Rapide
```
1. Scanner est actif (🟢 point vert animé visible)
2. Panier est sélectionné
3. Scannez le code barre du médicament
4. ✅ Produit ajouté automatiquement au panier
5. Notification de confirmation affichée
6. Répétez avec d'autres produits
```

### Codes Barre Disponibles

#### Médicaments Standard
| Code Internal | Barcode EAN-13 | Produit |
|---|---|---|
| PARA001 | 3614290255360 | Paracétamol 500mg |
| IBUP001 | 3400938016763 | Ibuprofène 400mg |
| AMOX001 | 3400936105706 | Amoxicilline 500mg |
| VITC001 | 3701143805017 | Vitamine C 1000mg |
| OMEP001 | 3400936199701 | Oméprazole 20mg |
| DOLP001 | 3614290254653 | Doliprane 1000mg |
| AZIT001 | 3400936198994 | Azithromycine 250mg |
| LOSC001 | 3400936247556 | Losartan 50mg |
| METF001 | 3400936124588 | Metformine 500mg |
| SERU001 | 3701143800011 | Sérum physiologique 500ml |

## Fonctionnalités Avancées

### Contrôle du Scanner
- **Bouton Pause/Reprendre**: Arrêtez temporairement les scans
- **Indicateur Visuel**: Voyant vert = actif, gris = pausé
- **Feedback en Temps Réel**: Voir le dernier code scanné

### Gestion des Erreurs
- **Produit Non Trouvé**: 
  - Vérifiez que le code barre est enregistré
  - Utilisez la recherche manuelle
  - Consultez l'administrateur pour ajouter le code

- **Scanner Inactif**:
  - Vérifiez la connexion USB
  - Cliquez "Reprendre" si pausé
  - Redémarrez l'application

## Optimisation pour les Pharmacies

### Performance
- Les scans sont traités en **~100ms**
- Idéal pour les points de vente haute cadence
- Support multi-scanners si plusieurs caisses

### Sécurité
- Les scans sont validés en base de données
- Code barre correspond au code interne
- Suivi complet des ventes et stocks

### Intégration avec les Ventes
- Stock automatiquement décrémenté
- Historique des ventes enregistré
- Rapports générés automatiquement

## Dépannage

### Le scanner ne fonctionne pas
1. Vérifiez la connexion USB
2. Testez le scanner sur une autre application (Bloc-notes)
3. Redémarrez le navigateur/l'application

### Produit non trouvé
1. Vérifiez le code barre sur le produit
2. Consultez la liste des codes dans APHIA
3. Demandez à l'administrateur d'ajouter le code

### Scan incomplet
- Les lecteurs doivent envoyer "ENTER" après le code
- Consultez le mode du lecteur (paramètres du terminal)

## Support Technique
- Email: support@aphia.sn
- Tél: +221 33 821 00 00
- En ligne: https://support.aphia.sn
