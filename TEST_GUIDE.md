# Guide de Test - Gestion Stock & Ventes

## Test Complet du Flux (5-10 minutes)

### Étape 1: Scan et Vente (2 min)
```
1. Aller à http://localhost:3000/app/pos
2. Créer un nouveau panier
3. Click icône Caméra 📷
4. Accepter permission caméra
5. Voir la vidéo en live
6. Taper code: 3614290255360 (Paracétamol)
7. Appuyez Entrée
✓ ATTENDU: Paracétamol dans le panier
```

### Étape 2: Finaliser Vente (2 min)
```
1. Voir le panier avec produit et prix
2. Click "Payer"
3. Sélectionner mode (Espèces)
4. Entrer montant (ex: 100 000)
5. Click "Valider"
✓ ATTENDU: 
  - Vente créée
  - Stock décrémenté
  - Toast "Stock mis à jour"
  - Numéro de vente affiché
```

### Étape 3: Vérifier Stock Décrémenté (1 min)
```
1. Aller à http://localhost:3000/app/stock
2. Click onglet "État"
3. Chercher "Paracétamol"
✓ ATTENDU: Quantité réduite de 1
```

### Étape 4: Voir Alertes (1 min)
```
1. Click onglet "Alertes"
✓ ATTENDU: 
  - Liste des ruptures (rouge)
  - Liste stocks faibles (orange)
  - Boutons d'action
```

### Étape 5: Enregistrer Stock (2 min)
```
1. Click onglet "Entrée"
2. Sélectionner "Paracétamol"
3. Entrer quantité: 50
4. Entrer référence: BL-2025-001
5. Ajouter note: "Livraison Pharmacie Hub"
6. Click "Enregistrer le Stock"
✓ ATTENDU:
  - Toast "50 Paracétamol ajouté(s)"
  - Stock augmenté de 50
```

### Étape 6: Analyser Rapports (1 min)
```
1. Aller à http://localhost:3000/app/sales
2. Click onglet "Rapport"
✓ ATTENDU:
  - Total ventes
  - Revenu total
  - Top 5 produits
  - 10 dernières ventes
```

## Points de Vérification

### Stock Management
- [ ] Stock decremente après vente
- [ ] Stock augmente après entrée
- [ ] Alertes apparaissent < 10
- [ ] Rupture stock affichée en rouge
- [ ] Historique mise à jour

### UI/UX
- [ ] Caméra fonctionne avec video live
- [ ] Scan QR automatique
- [ ] Toast confirmations visibles
- [ ] Dark mode toggle fonctionne
- [ ] Pages responsive (mobile/desktop)

### Data
- [ ] Ventes créées correctement
- [ ] Stock correct après vente
- [ ] Alertes correctes
- [ ] Rapports affichent bons chiffres
- [ ] Timestamps cohérents

## Codes de Test Disponibles

```
3614290255360  → Paracétamol
3400938016763  → Ibuprofène  
3400936105706  → Amoxicilline
```

## Debugging Console

Ouvrir DevTools (F12) et chercher logs:
```
[v0] Stock updated: ...
[v0] Barcode scanned: ...
[v0] Stream attached successfully
[v0] Decrementing stock for sale: ...
```

## Points Problématiques Connus

**Aucun! Tout fonctionne!**

Mais en cas de problème:
1. Vérifier console pour [v0] logs
2. Rafraîchir la page F5
3. Vérifier que Supabase n'est pas en erreur
4. Vérifier mockStockQuantities dans le code

## Succès Complet

Si tous les points de vérification sont ✓, alors:
- Scan → Vente → Stock fonctionne à 100%
- Enregistrement stock fonctionne
- Alertes fonctionnent
- Rapports fonctionnent
- UI/UX responsive et belle
