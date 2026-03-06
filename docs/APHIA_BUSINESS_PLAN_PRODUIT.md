# APHIA
## Business Plan — Produit & Technologie

**Version:** 1.0  
**Date:** Janvier 2025  
**Classification:** Document Stratégique

---

# Table des Matières

1. [Executive Summary (Produit)](#1-executive-summary-produit)
2. [Problématique & Besoin Métier](#2-problématique--besoin-métier)
3. [Solution : APHIA](#3-solution--aphia)
4. [Fonctionnalités Clés](#4-fonctionnalités-clés)
5. [Architecture Technique](#5-architecture-technique)
6. [Choix Technologiques & Justifications](#6-choix-technologiques--justifications)
7. [Expérience Utilisateur (UX)](#7-expérience-utilisateur-ux)
8. [Évolutivité & Roadmap Produit](#8-évolutivité--roadmap-produit)
9. [Différenciation & Avantages Concurrentiels](#9-différenciation--avantages-concurrentiels)

---

# 1. Executive Summary (Produit)

## Présentation Synthétique

**APHIA** (Application Pharmaceutique Intégrée pour l'Afrique) est une **application web professionnelle** de gestion pharmaceutique conçue spécifiquement pour le contexte sénégalais et ouest-africain. Développée selon une architecture moderne et robuste, APHIA répond aux exigences opérationnelles quotidiennes des officines tout en préparant leur transition vers la traçabilité pharmaceutique nationale.

## Problématique Adressée

Les pharmacies sénégalaises font face à des défis majeurs : gestion manuelle des stocks génératrice d'erreurs, absence de traçabilité des lots, complexité des ventes à tiers payeurs (IPM/Mutuelles), et manque de visibilité financière en temps réel. Les solutions existantes, souvent inadaptées au contexte local ou excessivement coûteuses, ne répondent pas aux spécificités réglementaires et commerciales du marché pharmaceutique sénégalais.

## Positionnement

APHIA se positionne comme une **application web métier** à vocation professionnelle, conçue pour un usage principal sur poste de travail (desktop) dans l'environnement de l'officine. Son architecture Progressive Web App (PWA) permet une installation locale et un fonctionnement optimisé, tout en garantissant les mises à jour automatiques et la synchronisation des données. APHIA n'est pas une application mobile : c'est un outil professionnel pensé pour le comptoir pharmaceutique.

---

# 2. Problématique & Besoin Métier

## 2.1 Contexte du Secteur Pharmaceutique Sénégalais

Le secteur pharmaceutique sénégalais traverse une période de transformation majeure, marquée par :

- **L'adoption progressive de la sérialisation** conformément aux directives de l'ANRP et aux standards GS1
- **La lutte contre les médicaments falsifiés** nécessitant une traçabilité renforcée
- **La croissance des tiers payeurs** (IPM, Mutuelles) complexifiant la gestion financière
- **Les exigences réglementaires accrues** en matière d'audit trail et de conformité

## 2.2 Problèmes Rencontrés dans la Gestion Pharmaceutique

### Gestion de Stock Défaillante

| Problème | Impact |
|----------|--------|
| Absence de suivi par lot et date d'expiration | Pertes financières sur produits périmés |
| Pas de distinction Dépôt / Salle de vente | Ruptures au comptoir malgré stock disponible |
| Inventaire manuel fastidieux | Écarts non justifiés, audit impossible |
| Stock négatif non géré | Réalité terrain non reflétée dans le système |

### Complexité des Ventes

| Problème | Impact |
|----------|--------|
| Ventes IPM/Mutuelle non structurées | Créances non suivies, délais de paiement dépassés |
| Vente au détail (déconditionnement) non gérée | Écarts de stock, prix incohérents |
| Remises et tolérances non tracées | Manque de visibilité sur les pertes commerciales |
| Crédits patients non suivis | Créances irrécouvrables |

### Visibilité Financière Limitée

| Problème | Impact |
|----------|--------|
| Pas de distinction COGS / OpEx | Analyse de rentabilité impossible |
| Charges mal catégorisées | Décisions budgétaires non éclairées |
| Créances tiers payeurs non consolidées | Trésorerie mal anticipée |

## 2.3 Limites des Solutions Existantes

Les solutions actuellement disponibles sur le marché sénégalais présentent plusieurs limitations :

- **Solutions importées** : Non adaptées à la terminologie locale (Classe Thérapeutique, Gamme), aux types de ventes sénégalaises (Bon Comptant, Bon Mutuelle), et aux obligations réglementaires nationales
- **Logiciels propriétaires anciens** : Architectures vieillissantes, absence de connectivité cloud, maintenance coûteuse
- **Solutions génériques** : Ne prennent pas en compte les spécificités du circuit de distribution pharmaceutique sénégalais (BL vs Facture, PNA, IPM)
- **Coûts prohibitifs** : Licences et maintenance inaccessibles pour les officines de taille moyenne

## 2.4 Enjeux Organisationnels et Opérationnels

### Enjeux Immédiats (Quotidiens)

- Rapidité de la transaction au comptoir
- Fiabilité de l'information stock
- Traçabilité des mouvements pour l'audit
- Suivi des créances et paiements

### Enjeux Stratégiques (Moyen Terme)

- Conformité aux exigences de sérialisation ANRP
- Interopérabilité avec les systèmes nationaux (DHIS2, PNA)
- Capacité d'analyse pour l'optimisation des achats
- Préparation à l'économie pharmaceutique connectée

---

# 3. Solution : APHIA

## 3.1 Présentation Détaillée

APHIA est une **application web professionnelle** de gestion intégrée pour les officines pharmaceutiques. Développée avec les technologies web les plus récentes, elle offre une expérience utilisateur fluide comparable aux applications natives tout en bénéficiant des avantages du web : déploiement instantané, mises à jour transparentes, et accessibilité depuis tout poste connecté.

### Philosophie de Conception

```
┌─────────────────────────────────────────────────────────────┐
│                    PRINCIPES FONDATEURS                      │
├─────────────────────────────────────────────────────────────┤
│  Database-First    │  La base de données est la source      │
│                    │  de vérité absolue                     │
├────────────────────┼────────────────────────────────────────┤
│  Auditabilité      │  Chaque action est tracée et           │
│                    │  horodatée                             │
├────────────────────┼────────────────────────────────────────┤
│  Zéro Mutation     │  Aucune donnée n'est modifiée          │
│  Silencieuse       │  sans justification                    │
├────────────────────┼────────────────────────────────────────┤
│  Terminologie      │  Interface conforme au vocabulaire     │
│  Métier            │  pharmaceutique sénégalais             │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 Description Fonctionnelle Globale

APHIA s'articule autour de quatre piliers fonctionnels interconnectés :

### Pilier 1 : Gestion de Stock

Suivi granulaire des produits pharmaceutiques avec traçabilité complète par lot, gestion multi-localisation (Dépôt / Salle de Vente), et alertes intelligentes sur les expirations et ruptures.

### Pilier 2 : Point de Vente (POS)

Interface de caisse moderne supportant tous les types de transactions sénégalaises : vente comptant, crédit patient, tiers payeur (IPM/Mutuelle), pro-forma, et vente au détail avec déconditionnement.

### Pilier 3 : Finance et Comptabilité

Module financier simplifié distinguant les charges génératrices de revenus (COGS) des charges de fonctionnement (OpEx), avec suivi des créances et génération automatique des écritures comptables.

### Pilier 4 : Traçabilité et Conformité

Système d'audit trail complet préparant l'officine aux exigences de sérialisation pharmaceutique et à l'interopérabilité avec les systèmes nationaux.

## 3.3 Cas d'Usage Principaux

### Cas 1 : Réception de Commande Fournisseur

```
Scénario : Le pharmacien reçoit une livraison de 50 références

1. Création du Bordereau de Livraison (BL)
2. Saisie ou scan des produits avec lot et date d'expiration
3. Comparaison automatique BL ↔ Commande initiale
4. Signalement des écarts (quantités, références manquantes)
5. Réception de la Facture Fournisseur (liaison au BL)
6. Mise à jour automatique du stock avec localisation (Dépôt)
7. Génération de l'écriture comptable d'achat

Résultat : Traçabilité complète, stock à jour, dette fournisseur enregistrée
```

### Cas 2 : Vente Mutuelle/IPM au Comptoir

```
Scénario : Un patient présente sa carte IPM pour un achat

1. Sélection du type de vente "Mutuelle/IPM"
2. Saisie ou scan de la carte → Auto-complétion patient
3. Ajout des produits au panier
4. Calcul automatique : Part Patient / Part Mutuelle
5. Encaissement de la part patient
6. Enregistrement de la créance IPM
7. Déduction automatique du stock

Résultat : Vente tracée, créance IPM créée, stock mis à jour
```

### Cas 3 : Régularisation de Stock Négatif

```
Scénario : L'inventaire révèle un écart de -3 boîtes

1. Détection du stock négatif lors de l'inventaire
2. Obligation de justification (liste prédéfinie) :
   - Erreur de saisie
   - Produit périmé non sorti
   - Casse/Détérioration
   - Sortie non enregistrée
3. Enregistrement de la perte financière associée
4. Régularisation du stock
5. Audit trail complet de la correction

Résultat : Écart justifié, perte valorisée, auditabilité préservée
```

### Cas 4 : Facturation Périodique IPM

```
Scénario : Fin de mois, génération des factures mutuelles

1. Sélection de la période et de l'IPM
2. Consolidation automatique des créances
3. Génération de la facture récapitulative
4. Export PDF pour envoi à la mutuelle
5. Suivi du statut : Envoyée → Acceptée → Payée

Résultat : Facturation simplifiée, suivi des encaissements
```

## 3.4 Valeur Ajoutée Métier

| Domaine | Avant APHIA | Avec APHIA |
|---------|-------------|------------|
| **Stock** | Inventaire manuel, écarts fréquents | Temps réel, écarts justifiés |
| **Ventes** | Cahier papier, calculs manuels | POS intégré, calculs automatiques |
| **IPM** | Suivi Excel, oublis fréquents | Créances automatiques, relances |
| **Finance** | Visibilité fin de mois | Tableau de bord temps réel |
| **Audit** | Reconstitution difficile | Historique complet instantané |
| **Conformité** | Risque réglementaire | Préparation sérialisation |

---

# 4. Fonctionnalités Clés

## 4.1 Gestion de Stock

### Traçabilité par Lot

Chaque entrée de stock est associée à :
- **Numéro de lot** (obligatoire)
- **Date d'expiration** (obligatoire)
- **Prix d'achat unitaire**
- **Fournisseur et document source**
- **Localisation physique**

### Multi-Localisation Interne

```
┌─────────────────────────────────────────────────────────────┐
│                     PHARMACIE EXEMPLE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐         ┌──────────────────────────┐     │
│   │    DÉPÔT     │ ──────► │    SALLE DE VENTE        │     │
│   │  (Réserve)   │ Transfert│  ┌────┐ ┌────┐ ┌────┐   │     │
│   │              │         │  │ R1 │ │ R2 │ │ R3 │   │     │
│   │  Stock: 500  │         │  │    │ │    │ │    │   │     │
│   └──────────────┘         │  └────┘ └────┘ └────┘   │     │
│                            │      Rayons             │     │
│                            └──────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

- **Dépôt** : Stock principal de réserve
- **Salle de Vente** : Stock accessible au comptoir
- **Rayons** : Organisation physique personnalisable
- **Transferts** : Mouvements tracés entre localisations

### Terminologie Pharmaceutique

| Ancien Terme | Terme APHIA | Description |
|--------------|-------------|-------------|
| Catégorie | **Classe Thérapeutique** | Classification pharmacologique |
| Marque | **Gamme** | Regroupement par laboratoire (ex: UPSA) |
| Type | **Forme Galénique** | Comprimé, sirop, injectable... |

### Gestion des Écarts et Stock Négatif

Le système accepte les stocks négatifs pour refléter la réalité terrain, avec obligation de justification :

- Erreur de saisie
- Produit périmé non sorti
- Casse / Détérioration
- Sortie non enregistrée
- Vol / Perte

Chaque régularisation génère automatiquement une **perte financière** valorisée au prix d'achat.

### Alertes Intelligentes

- **Expirations** : J-90, J-30, J-7 avant péremption
- **Ruptures** : Stock < seuil minimum paramétrable
- **Demandes non satisfaites** : Enregistrement des produits demandés mais indisponibles

## 4.2 Ventes (Point de Vente)

### Types de Ventes Supportés

#### Bon Comptant
- Vente simple avec paiement immédiat
- Application de remises (%, montant fixe)
- Gestion des tolérances (petits écarts < 10 FCFA)
- Traçabilité des écarts tolérés

#### Bon Mutuelle / IPM
- Saisie du numéro de carte mutuelle
- Auto-complétion si patient connu
- Calcul automatique Part Patient / Part Mutuelle
- Création automatique de la créance

#### Bon Crédit (Patient à Crédit)
- Enregistrement de la dette patient
- Échéance paramétrable
- Historique des remboursements
- Relances et suivi

#### Bon Patient
- Vente à un patient enregistré
- Liaison à l'historique futur
- Base pour analyses de fidélité

#### Facture Pro-Forma
- Génération de devis
- **Aucun impact** sur le stock
- Conversion possible en vente réelle

#### Vente au Détail (Déconditionnement)
- Configuration par produit : "Vente à l'unité autorisée"
- Conversion automatique : 1 boîte = N unités
- Calcul du prix unitaire
- Impact précis sur le stock

### Interface Point de Vente

```
┌─────────────────────────────────────────────────────────────┐
│  APHIA POS                           [Client: ---] [IPM ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │    RECHERCHE PRODUIT     │  │       PANIER             │ │
│  │  [🔍 Doliprane...     ]  │  │                          │ │
│  │                          │  │  Doliprane 1000mg  x2    │ │
│  │  ┌────┐ ┌────┐ ┌────┐   │  │    2,400 FCFA            │ │
│  │  │ A  │ │ B  │ │ C  │   │  │                          │ │
│  │  └────┘ └────┘ └────┘   │  │  Amoxicilline 500  x1    │ │
│  │  Catégories             │  │    3,500 FCFA            │ │
│  │                          │  │                          │ │
│  │  ┌──────────────────┐   │  ├──────────────────────────┤ │
│  │  │ Doliprane 1000mg │   │  │  Sous-total: 5,900 FCFA  │ │
│  │  │ Stock: 45 | 2,400│   │  │  Remise:         0 FCFA  │ │
│  │  └──────────────────┘   │  │  TOTAL:     5,900 FCFA   │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                              │
│  [ Annuler ]  [ Suspendre ]  [ Pro-Forma ]  [ VALIDER ✓ ]  │
└─────────────────────────────────────────────────────────────┘
```

## 4.3 Traçabilité et Approvisionnement

### Distinction BL / Facture

```
Commande → Bordereau de Livraison (BL) → Facture Fournisseur
                    │                           │
                    ▼                           ▼
            Réception physique          Engagement financier
            Mise à jour stock           Création dette fournisseur
```

### Comparaison Automatique

Le système compare automatiquement :
- Quantités commandées vs reçues
- Références attendues vs livrées
- Écarts signalés pour action

### Retours et Réclamations

#### Retour Client
- Motif obligatoire (erreur délivrance, défaut qualité)
- Réintégration conditionnelle (lot valide, non ouvert)
- Traçabilité complète

#### Retour Fournisseur
- Motifs : lot défectueux, erreur livraison, non-conformité
- Génération du bordereau de retour
- Impact sur la dette fournisseur

## 4.4 Reporting et Tableaux de Bord

### Indicateurs Temps Réel

| Indicateur | Description |
|------------|-------------|
| Chiffre d'Affaires (J/M/A) | Ventes validées par période |
| Marge Brute | CA - Coût des marchandises vendues |
| Créances IPM | Montants dus par les mutuelles |
| Dettes Fournisseurs | Engagements envers les grossistes |
| Stock Valorisé | Valeur totale du stock au prix d'achat |
| Produits à Risque | Expirations imminentes, stocks faibles |

### Exports et Rapports

- **PDF** : Factures, bordereaux, rapports périodiques
- **Excel** : Données brutes pour analyse externe
- **Filtres avancés** : Par période, classe thérapeutique, gamme, type de vente, IPM, patient

## 4.5 Gestion des Utilisateurs et Rôles

### Rôles Prédéfinis

| Rôle | Permissions |
|------|-------------|
| **Administrateur** | Accès complet, paramétrage système |
| **Pharmacien** | Toutes opérations métier |
| **Préparateur** | Ventes, consultations stock |
| **Comptable** | Finances, rapports (lecture seule sur stock) |

### Audit Trail Utilisateur

Chaque action enregistre :
- ID utilisateur
- Type d'action
- Horodatage précis (hh:mm:ss)
- Données avant/après modification

## 4.6 Sécurité et Fiabilité

### Authentification

- Connexion par email/mot de passe
- Sessions sécurisées (JWT + cookies HTTP-only)
- Hachage des mots de passe (bcrypt)
- Déconnexion automatique après inactivité

### Intégrité des Données

- Contraintes de base de données (clés étrangères, checks)
- Transactions atomiques
- Soft delete uniquement (aucune suppression définitive)
- Écritures comptables immuables (pas de modification, pas de suppression)

### Sauvegarde et Récupération

- Base de données cloud avec réplication
- Sauvegardes automatiques quotidiennes
- Restauration à la demande

---

# 5. Architecture Technique

## 5.1 Stack Technique

```
┌─────────────────────────────────────────────────────────────┐
│                      ARCHITECTURE APHIA                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    FRONTEND                          │    │
│  │  Next.js 16 (App Router) + React 19 + TypeScript    │    │
│  │  Tailwind CSS + shadcn/ui                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   SERVER ACTIONS                     │    │
│  │  Next.js Server Actions (Server-Side Rendering)     │    │
│  │  API Routes pour endpoints REST si nécessaire       │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    DATABASE                          │    │
│  │  PostgreSQL (Neon Serverless)                       │    │
│  │  Triggers, Views, Functions                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 5.2 Composants Techniques

### Frontend

| Technologie | Rôle |
|-------------|------|
| **Next.js 16** | Framework React full-stack |
| **React 19** | Bibliothèque UI avec Server Components |
| **TypeScript** | Typage statique pour la fiabilité |
| **Tailwind CSS** | Styles utilitaires performants |
| **shadcn/ui** | Composants UI accessibles et personnalisables |
| **Recharts** | Visualisations et graphiques |

### Backend

| Technologie | Rôle |
|-------------|------|
| **Next.js Server Actions** | Mutations côté serveur sécurisées |
| **PostgreSQL** | Base de données relationnelle robuste |
| **Neon Serverless** | Hébergement PostgreSQL scalable |
| **bcrypt** | Hachage sécurisé des mots de passe |
| **JWT** | Tokens de session |

### Infrastructure

| Service | Rôle |
|---------|------|
| **Vercel** | Hébergement et déploiement |
| **Neon** | Base de données PostgreSQL |
| **Edge Network** | Distribution globale, faible latence |

## 5.3 Modèle de Données (Simplifié)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   products   │     │    stock     │     │    sales     │
│──────────────│     │──────────────│     │──────────────│
│ id           │◄────│ product_id   │     │ id           │
│ name         │     │ lot_number   │     │ sale_type    │
│ class        │     │ expiry_date  │     │ patient_id   │
│ gamme        │     │ quantity     │     │ ipm_id       │
│ unit_price   │     │ location     │     │ total_amount │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   expenses   │     │   payments   │     │ sale_items   │
│──────────────│     │──────────────│     │──────────────│
│ id           │◄────│ expense_id   │     │ sale_id      │
│ type (OpEx)  │     │ amount       │     │ product_id   │
│ amount       │     │ method       │     │ quantity     │
│ category_id  │     │ reference    │     │ unit_price   │
└──────────────┘     └──────────────┘     └──────────────┘
```

## 5.4 Sécurité et Authentification

### Flux d'Authentification

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐
│  User   │────►│  Login Form │────►│ Server Action│
└─────────┘     └─────────────┘     └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Verify Hash  │
                                    │ (bcrypt)     │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Create JWT   │
                                    │ Set Cookie   │
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Redirect to  │
                                    │ /app         │
                                    └──────────────┘
```

### Protection des Routes

- Middleware de vérification de session
- Redirection automatique vers login si non authentifié
- Validation des permissions par rôle

---

# 6. Choix Technologiques & Justifications

## 6.1 Pourquoi une Application Web ?

### Accessibilité Universelle

Une application web est accessible depuis **tout appareil disposant d'un navigateur moderne** : ordinateur de bureau, laptop, tablette. Aucune installation d'application native n'est requise, simplifiant considérablement le déploiement.

### Mises à Jour Transparentes

Contrairement aux applications mobiles nécessitant des mises à jour via les stores (avec validation et délais), une application web se met à jour **instantanément** à chaque déploiement. Tous les utilisateurs bénéficient immédiatement des corrections et améliorations.

### Coût de Développement Optimisé

Un développement unique pour toutes les plateformes (vs applications iOS + Android + Desktop) réduit significativement les coûts de développement et de maintenance.

### Adaptation au Contexte Professionnel

L'usage principal d'APHIA se fait sur **poste de travail fixe** au comptoir de la pharmacie. Une application web optimisée pour desktop offre :
- Une interface plus spacieuse et efficace
- Une meilleure ergonomie avec clavier et souris
- Une intégration facilitée avec périphériques (imprimantes, scanners)

## 6.2 Avantages par Rapport au Mobile Natif

| Critère | Application Mobile Native | Application Web (APHIA) |
|---------|--------------------------|-------------------------|
| **Installation** | Store, téléchargement | URL directe |
| **Mises à jour** | Manuelle ou automatique différée | Instantanée |
| **Maintenance** | 2+ codebases (iOS/Android) | 1 codebase unique |
| **Périphériques** | Limité | Complet (imprimantes, scanners) |
| **Écran** | Optimisé petit écran | Optimisé grand écran |
| **Coût** | Élevé (multi-plateforme) | Réduit |

## 6.3 Scalabilité

### Architecture Serverless

L'utilisation de Neon Serverless pour la base de données et Vercel pour l'hébergement permet une **scalabilité automatique** :
- Ressources allouées à la demande
- Pas de serveur à gérer
- Coûts proportionnels à l'usage

### Multi-Tenant Ready

L'architecture permet d'évoluer vers un modèle multi-tenant (plusieurs pharmacies sur une même instance) sans refonte majeure.

## 6.4 Maintenabilité

### Codebase Unique

TypeScript + Next.js permettent de maintenir **un seul projet** pour toute l'application, avec :
- Typage statique réduisant les erreurs
- Composants réutilisables
- Tests automatisés possibles

### Documentation Intégrée

Les types TypeScript et les Server Actions auto-documentent le code, facilitant l'onboarding de nouveaux développeurs.

## 6.5 Déploiement et Mises à Jour

### Continuous Deployment

```
Code Push → Build automatique → Tests → Déploiement → Production
     │                                                    │
     └────────────────── < 5 minutes ─────────────────────┘
```

### Zero Downtime

Les déploiements sur Vercel sont **sans interruption de service**. La nouvelle version remplace progressivement l'ancienne.

---

# 7. Expérience Utilisateur (UX)

## 7.1 Conception pour Usage Professionnel

APHIA est conçue pour un **environnement de travail exigeant** où rapidité et fiabilité sont critiques :

### Efficacité au Comptoir

- **Recherche rapide** : Résultats instantanés lors de la saisie
- **Raccourcis clavier** : Navigation sans souris pour les utilisateurs experts
- **Panier persistant** : Possibilité de suspendre et reprendre une vente
- **Multi-paniers** : Gestion de plusieurs clients simultanément

### Réduction des Erreurs

- **Validation en temps réel** : Erreurs signalées avant soumission
- **Confirmations critiques** : Double validation pour actions irréversibles
- **Suggestions intelligentes** : Auto-complétion basée sur l'historique

## 7.2 Navigation Claire

### Structure Logique

```
┌─────────────────────────────────────────────────────────────┐
│  NAVIGATION APHIA                                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Tableau de Bord     ← Vue d'ensemble                    │
│                                                              │
│  💊 Stock                                                    │
│     ├── Produits        ← Catalogue                         │
│     ├── Mouvements      ← Entrées/Sorties                   │
│     └── Inventaire      ← Comptage physique                 │
│                                                              │
│  🛒 Ventes                                                   │
│     ├── Point de Vente  ← Caisse                            │
│     └── Historique      ← Transactions passées              │
│                                                              │
│  💰 Finance                                                  │
│     ├── Dépenses        ← OpEx                              │
│     ├── Paiements       ← Règlements                        │
│     ├── IPM/Mutuelles   ← Créances tiers                    │
│     └── Comptabilité    ← Écritures                         │
│                                                              │
│  ⚙️ Paramètres          ← Configuration                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Fil d'Ariane

Chaque page affiche sa position dans l'arborescence, permettant une navigation contextuelle claire.

## 7.3 Rapidité

### Performance Optimisée

| Métrique | Objectif | Technologie |
|----------|----------|-------------|
| Time to First Byte | < 200ms | Edge Network |
| First Contentful Paint | < 1s | Server Components |
| Time to Interactive | < 2s | Streaming SSR |
| Recherche produit | < 100ms | Index PostgreSQL |

### Chargement Progressif

Les données sont chargées progressivement avec des indicateurs visuels (skeletons), évitant les écrans blancs et maintenant l'utilisateur informé.

## 7.4 Fiabilité en Environnement Réel

### Gestion des Erreurs

- Messages d'erreur explicites et actionnables
- Récupération automatique des opérations interrompues
- Journalisation des erreurs pour diagnostic

### Stabilité

- Pas de plantages inattendus
- Sauvegarde automatique des données en cours de saisie
- Sessions persistantes même après fermeture du navigateur

---

# 8. Évolutivité & Roadmap Produit

## 8.1 Vision Long Terme

APHIA V0 (MVP) pose les fondations d'une plateforme évolutive. La vision à long terme est de devenir la **référence de la gestion pharmaceutique numérique en Afrique de l'Ouest**, en accompagnant la transformation digitale du secteur.

## 8.2 Fonctionnalités Futures (V1+)

### Module Sérialisation Complète

- Lecture Datamatrix (GTIN, lot, série, expiration)
- Vérification d'authenticité en temps réel
- Synchronisation avec la base nationale ANRP
- Traçabilité boîte par boîte

### Analytics et Intelligence

- Analyse des pics de vente (heures, jours)
- Performance par gamme et classe thérapeutique
- Prévisions de rupture basées sur l'historique
- Recommandations de réapprovisionnement

### Module RH

- Gestion des plannings
- Performance du personnel (ventes par agent)
- Calcul des primes et commissions

### Interconnexion Nationale

- Export vers DHIS2 (Ministère de la Santé)
- Intégration PNA (Pharmacie Nationale)
- Interopérabilité avec grossistes

### OCR et Automatisation

- Lecture automatique des factures fournisseurs
- Scan des boîtes pour saisie rapide
- Reconnaissance des ordonnances

## 8.3 Ouverture vers d'Autres Modules

L'architecture modulaire permet d'ajouter progressivement :

| Module | Description | Horizon |
|--------|-------------|---------|
| **E-Prescription** | Réception ordonnances numériques | V2 |
| **Multi-Sites** | Gestion de plusieurs officines | V2 |
| **E-Commerce** | Vente en ligne aux patients | V3 |
| **Télépharmacie** | Conseil à distance | V3 |

---

# 9. Différenciation & Avantages Concurrentiels

## 9.1 Modularité

APHIA est conçue comme un **ensemble de modules indépendants mais intégrés**. Une officine peut commencer par le module Stock seul, puis activer progressivement Finance, POS, IPM selon ses besoins et sa maturité digitale.

```
┌───────────────────────────────────────────────────────────┐
│                   ARCHITECTURE MODULAIRE                   │
├───────────────────────────────────────────────────────────┤
│                                                            │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  │
│   │  STOCK  │   │   POS   │   │ FINANCE │   │   IPM   │  │
│   │ Module  │   │ Module  │   │ Module  │   │ Module  │  │
│   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘  │
│        │             │             │             │        │
│        └─────────────┴──────┬──────┴─────────────┘        │
│                             │                              │
│                      ┌──────┴──────┐                      │
│                      │    CORE     │                      │
│                      │ (Données,   │                      │
│                      │  Auth, UI)  │                      │
│                      └─────────────┘                      │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

## 9.2 Adaptation au Terrain Sénégalais

### Terminologie Locale

Utilisation systématique du vocabulaire professionnel pharmaceutique sénégalais : Classe Thérapeutique, Gamme, Bon Comptant, Bon Mutuelle, etc.

### Processus Métier Locaux

Prise en compte des spécificités :
- Distinction BL / Facture (pratique des grossistes locaux)
- Gestion IPM/Mutuelles avec délais de paiement
- Vente au détail (déconditionnement courant)
- Tolérances et remises informelles (tracées pour audit)

### Réglementation Nationale

Préparation aux exigences ANRP, PNA, et normes UEMOA/CEDEAO en matière de traçabilité pharmaceutique.

## 9.3 Robustesse

### Architecture Database-First

Toute la logique métier critique est implémentée au niveau **base de données** (triggers, constraints, views). Même si l'application frontend a un bug, l'intégrité des données est préservée.

### Auditabilité Totale

Chaque action est tracée avec :
- Utilisateur
- Horodatage précis
- Données avant/après
- Justification si applicable

### Immuabilité Comptable

Les écritures comptables ne peuvent être ni modifiées ni supprimées, conformément aux principes comptables et aux exigences d'audit.

## 9.4 Approche Métier

APHIA n'est pas un logiciel générique adapté à la pharmacie : c'est une **solution métier native**, conçue dès l'origine pour et avec les pharmaciens sénégalais.

### Co-Construction

Les fonctionnalités sont définies en collaboration directe avec des pharmaciens praticiens, garantissant l'adéquation avec les besoins réels du terrain.

### Évolution Continue

Le modèle SaaS permet des améliorations continues basées sur les retours utilisateurs, sans attendre des cycles de mise à jour longs et coûteux.

---

# Conclusion

APHIA représente une **réponse technologique ambitieuse et pragmatique** aux défis de modernisation du secteur pharmaceutique sénégalais. En combinant une architecture web moderne, une conception orientée métier, et une vision d'évolutivité vers la sérialisation nationale, APHIA se positionne comme un outil stratégique pour les officines souhaitant :

1. **Professionnaliser** leur gestion quotidienne
2. **Sécuriser** leur traçabilité et leur conformité
3. **Optimiser** leur performance financière
4. **Préparer** leur intégration dans l'écosystème pharmaceutique connecté

Le MVP (V0) livre les fondations opérationnelles essentielles. Les versions futures (V1, V2) enrichiront progressivement la plateforme pour accompagner la transformation digitale du secteur sur le long terme.

---

**Document rédigé par l'équipe produit APHIA**  
**Version 1.0 — Janvier 2025**

---

*Ce document est la propriété d'APHIA. Toute reproduction ou diffusion non autorisée est interdite.*
