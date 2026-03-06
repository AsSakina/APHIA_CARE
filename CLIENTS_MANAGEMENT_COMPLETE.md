# Système de Gestion des Clients - Documentation Complète

## Vue d'ensemble

Un système complet de gestion des profils patients/clients a été implémenté pour permettre le crédit patient dans la pharmacie. Seuls les clients avec un compte peuvent bénéficier de crédits.

## Architecture

```
Pharmacien
  ├─ Accès: /app/clients
  ├─ Actions:
  │  ├─ Créer un compte client
  │  ├─ Modifier les paramètres de crédit
  │  └─ Activer/Désactiver le crédit
  └─ Contrôle: Limite de crédit par client

Point de Vente
  ├─ Accès: /app/pos
  ├─ Types de clients:
  │  ├─ COMPTANT: Sans compte, paiement immédiat
  │  ├─ CLIENT_COMPTE: Avec compte, sans crédit
  │  ├─ CLIENT_CREDIT: Avec compte ET crédit autorisé
  │  ├─ IPM_MUTUELLE: Couverture mutuelle
  │  └─ PROFORMA: Devis
  └─ Validation: Rejet si CLIENT_CREDIT sans compte ou sans permission
```

## Fichiers Créés

### 1. Actions Serveur
**Fichier:** `/app/app/clients/actions.ts`
- `getAllClients()` - Liste tous les clients
- `getClientById(id)` - Détails d'un client
- `createClient(data)` - Créer un nouveau client
- `updateClient(id, data)` - Modifier un client
- `deleteClient(id)` - Supprimer un client

### 2. Composants UI
**Fichier:** `/components/app/clients/create-client-form.tsx`
- Formulaire de création avec validation
- Champ "Autoriser crédit" avec case à cocher
- Champ "Limite de crédit" (conditionnelle)
- Toast de feedback

**Fichier:** `/components/app/clients/clients-list.tsx`
- Liste paginée des clients
- Recherche en temps réel
- Affichage statut crédit (Activé/Inactif)
- Affichage limite crédit et solde
- Boutons action: Activer/Désactiver crédit, Supprimer

### 3. Pages
**Fichier:** `/app/app/clients/page.tsx`
- Page principale avec 2 onglets:
  - "Liste des clients" - Tous les clients enregistrés
  - "Créer un client" - Formulaire d'ajout
- Info box expliquant le système de crédit

## Flux Fonctionnel

### 1. Créer un Client (Pharmacien)
```
/app/clients
  ↓
Onglet "Créer un client"
  ↓
Remplir formulaire:
  - Prénom, Nom (obligatoires)
  - Téléphone, Email, Adresse (optionnels)
  - Autoriser crédit? (case à cocher)
  - Limite de crédit (si crédit autorisé)
  ↓
Click "Créer le client"
  ↓
Client créé et listé
```

### 2. Voir les Clients (Pharmacien)
```
/app/clients
  ↓
Onglet "Liste des clients"
  ↓
Voir tous les clients avec:
  - Nom et contact
  - Statut crédit (Activé/Inactif)
  - Limite de crédit
  - Solde actuel
  ↓
Actions par client:
  - Click cadenas: Désactiver crédit
  - Click poubelle: Supprimer
  - Recherche: Filtrer par nom
```

### 3. Vendre à Crédit (POS)
```
/app/pos
  ↓
Ajouter produits au panier
  ↓
Click "Sélectionner client"
  ↓
Type "CLIENT_CREDIT"
  ↓
Rechercher client
  ↓
Système vérifie:
  ✓ Client existe
  ✓ can_receive_credit === true
  ✓ Solde < limite crédit
  ↓
Si OK: Client sélectionné
Si NON: Message d'erreur
  ↓
Paiement normal
  ↓
Stock décrémenté
  ↓
Solde crédit augmenté
```

## Intégration Existante

Le système s'appuie sur des structures existantes:

### Types (déjà existants)
```typescript
interface Patient {
  id: string
  first_name: string
  last_name: string
  phone?: string
  email?: string
  can_receive_credit?: boolean
  credit_limit?: number
  current_credit_balance?: number
}

type ClientType = "COMPTANT" | "IPM_MUTUELLE" | "CLIENT_COMPTE" | "CLIENT_CREDIT" | "PROFORMA"
```

### Validations (déjà en place)
Dans `/components/app/pos/client-selector.tsx`:
```typescript
// Ligne 78-82: Validation crédit
if (clientType === "CLIENT_CREDIT" && selectedPatient && !selectedPatient.can_receive_credit) {
  toast.error("Ce patient n'est pas autorisé à recevoir du crédit.")
  return
}

// Ligne 201-207: Affichage statut crédit
{clientType === "CLIENT_CREDIT" && (
  <span className={patient.can_receive_credit ? "bg-green-100" : "bg-red-100"}>
    {patient.can_receive_credit ? "Crédit autorisé" : "Non autorisé"}
  </span>
)}
```

## Accès dans la Navigation

**Menu:** Ajouté dans `/components/app/pharmacy-top-nav.tsx`
```
Navigation → Clients → /app/clients
```

## Règles de Crédit

1. **Création de compte** - Pharmacien uniquement
2. **Autorisation crédit** - Pharmacien décide via checkbox
3. **Limite de crédit** - Définie lors de la création
4. **Validation POS** - Rejet automatique si non autorisé
5. **Suivi solde** - Mis à jour après chaque vente

## Exemple de Flux Complet

```
Jour 1:
1. Pharmacien crée client "Aminata Diallo"
   - Prénom: Aminata
   - Nom: Diallo
   - Crédit autorisé: ✓
   - Limite: 50 000 FCFA

2. Aminata vient acheter
   - /app/pos
   - Ajoute Paracétamol (5 000 FCFA)
   - Select client → "CLIENT_CREDIT"
   - Cherche "Aminata"
   - Voir badge: "Crédit autorisé"
   - Valide
   - Vente à crédit enregistrée
   - Solde Aminata: 5 000 FCFA

3. Pharmacien consulte
   - /app/clients
   - Voir Aminata:
     - Crédit: Activé
     - Limite: 50 000
     - Solde: 5 000 (17% utilisé)

4. Aminata paie 2 500 FCFA
   - Solde: 2 500 FCFA

5. Si solde > limite:
   - POS rejette la vente
   - Message: "Limite de crédit atteinte"
```

## Base de Données (Mock)

Données stockées dans `mockPatients` array avec structure:
```javascript
{
  id: "patient-1",
  first_name: "Aminata",
  last_name: "Diallo",
  phone: "+221 77 100 00 01",
  email: "aminata@email.sn",
  can_receive_credit: true,
  credit_limit: 50000,
  current_credit_balance: 5000
}
```

## Prochaines Étapes (Optionnel)

- [ ] Intégration Supabase pour persistance réelle
- [ ] Email notifications pour crédit élevé
- [ ] Rappels de paiement automatiques
- [ ] Historique des paiements par client
- [ ] Rapports crédit du pharmacien
- [ ] Documents (attestation crédit, etc.)

## Support

Toutes les validations et erreurs affichent des toasts clairs pour guider l'utilisateur.
