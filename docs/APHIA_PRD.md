# APHIA - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 7 Janvier 2026  
**Auteur:** Équipe Produit APHIA  
**Statut:** V0 - MVP

---

## Table des Matières

1. [Introduction](#1-introduction)
2. [Vision et Objectifs](#2-vision-et-objectifs)
3. [Portée du Produit](#3-portée-du-produit)
4. [Fonctionnalités Principales](#4-fonctionnalités-principales)
5. [Exigences Techniques](#5-exigences-techniques)
6. [Exigences Utilisateur](#6-exigences-utilisateur)
7. [Architecture de Données](#7-architecture-de-données)
8. [Critères de Succès](#8-critères-de-succès)
9. [Échéancier et Jalons](#9-échéancier-et-jalons)
10. [Responsabilités](#10-responsabilités)
11. [Risques et Mitigation](#11-risques-et-mitigation)
12. [Exclusions V0](#12-exclusions-v0)
13. [Conclusion](#13-conclusion)

---

## 1. Introduction

### 1.1 Contexte

APHIA (Application de Pharmacie Intégrée et Automatisée) est un système de gestion de pharmacie conçu spécifiquement pour le contexte sénégalais. Le projet répond aux besoins des pharmacies qui cherchent à moderniser leur gestion tout en respectant les contraintes locales.

### 1.2 Problématique

Les pharmacies au Sénégal font face à plusieurs défis :
- Gestion manuelle des stocks entraînant des pertes (péremption, erreurs)
- Suivi difficile des créances IPM/Mutuelles
- Absence de visibilité sur la santé financière en temps réel
- Processus de vente lents et sources d'erreurs
- Manque de traçabilité des opérations

### 1.3 Solution Proposée

APHIA V0 est un MVP (Minimum Viable Product) qui adresse les besoins opérationnels essentiels d'une pharmacie, avec une architecture "database-first" garantissant l'intégrité et l'auditabilité des données.

---

## 2. Vision et Objectifs

### 2.1 Vision

Devenir la solution de référence pour la gestion des pharmacies au Sénégal, en offrant un outil simple, fiable et adapté aux réalités locales.

### 2.2 Objectifs Stratégiques

| Objectif | Description | Indicateur |
|----------|-------------|------------|
| Efficacité opérationnelle | Réduire le temps de traitement des ventes | -50% temps de transaction |
| Visibilité financière | Tableaux de bord en temps réel | 100% des KPIs disponibles |
| Réduction des pertes | Alertes et suivi des péremptions | -30% pertes stock |
| Traçabilité | Audit trail complet | 100% opérations tracées |
| Recouvrement IPM | Suivi des créances mutuelles | Délai moyen < 45 jours |

### 2.3 Objectifs V0

Pour cette première version, les objectifs sont :
1. Déployer un système fonctionnel de point de vente (POS)
2. Implémenter la gestion financière simplifiée
3. Assurer le suivi des créances IPM
4. Fournir des indicateurs financiers de base

---

## 3. Portée du Produit

### 3.1 Inclus dans V0

| Module | Fonctionnalités |
|--------|-----------------|
| **Authentification** | Connexion/inscription, gestion des sessions, protection des routes |
| **Tableau de Bord** | KPIs financiers, graphiques tendances, alertes |
| **Gestion des Dépenses** | CRUD dépenses, catégorisation, validation, paiements |
| **Paiements** | Enregistrement paiements (dépenses et fournisseurs) |
| **Pertes Financières** | Suivi des pertes stock (péremption, casse, vol) |
| **IPM/Mutuelles** | Gestion organismes, patients, réclamations |
| **Comptabilité** | Journal des écritures (auto-généré), balance par catégorie |
| **Point de Vente** | Interface POS, panier, multi-paniers, paiement |
| **Historique Ventes** | Liste des ventes, détails, statistiques |

### 3.2 Hors Portée V0

- Comptabilité OHADA complète (bilan, compte de résultat)
- Moteur fiscal / TVA
- Gestion de la paie
- Gestion RH
- Logique clinique / ordonnances
- OCR / Import Excel
- Prévisions et projections
- Gestion des stocks (quantités) - uniquement valorisation financière

---

## 4. Fonctionnalités Principales

### 4.1 Module Authentification

**Description:** Système d'authentification sécurisé avec gestion des sessions.

| Fonctionnalité | Priorité | Description |
|----------------|----------|-------------|
| Connexion | P0 | Email/mot de passe avec validation |
| Inscription | P0 | Création de compte utilisateur |
| Déconnexion | P0 | Terminaison sécurisée de session |
| Protection routes | P0 | Middleware de vérification JWT |
| Rôles utilisateurs | P1 | Admin, Pharmacien, Caissier |

**Règles métier:**
- Mot de passe minimum 6 caractères
- Session JWT avec expiration 7 jours
- Cookie HTTP-only pour la sécurité
- Hachage bcrypt pour les mots de passe

### 4.2 Module Tableau de Bord

**Description:** Vue consolidée des indicateurs financiers clés.

| KPI | Calcul | Rafraîchissement |
|-----|--------|------------------|
| Total Achats (30j) | Somme factures fournisseurs | Temps réel |
| Total Paiements (30j) | Somme paiements effectués | Temps réel |
| Pertes Totales (30j) | Valorisation pertes stock | Temps réel |
| Dettes Fournisseurs | Encours non réglé | Temps réel |

**Visualisations:**
- Graphique barres : Dépenses par type
- Graphique ligne : Tendance mensuelle (ventes vs dépenses)
- Tableau : Top 5 fournisseurs avec encours

### 4.3 Module Dépenses

**Description:** Gestion complète du cycle de vie des dépenses opérationnelles.

**Types de dépenses supportés:**
- MEDICATION_PURCHASE (Achat médicaments)
- RENT (Loyer)
- SALARY (Salaires)
- ELECTRICITY (Électricité)
- WATER (Eau)
- INTERNET (Internet)
- MAINTENANCE (Maintenance)
- SUPPLIES (Fournitures)
- TRANSPORT (Transport)
- TAXES (Taxes)
- INSURANCE (Assurance)
- OTHER (Autre)

**Workflow:**

```
CRÉATION → VALIDATION → PAIEMENT (partiel/total)
    ↓           ↓              ↓
 Brouillon   Confirmé      Comptabilisé
```

**Règles métier:**
- Une dépense doit avoir une catégorie pour être validée
- La validation est irréversible
- Chaque paiement génère automatiquement une écriture comptable

### 4.4 Module Paiements

**Description:** Enregistrement des sorties de trésorerie.

**Cibles de paiement:**
1. **Dépenses** - Règlement des dépenses opérationnelles
2. **Documents fournisseurs** - Règlement des factures (BL, FACTURE)

**Méthodes de paiement:**
- CASH (Espèces)
- CARD (Carte bancaire)
- CHEQUE (Chèque)
- TRANSFER (Virement)
- MOBILE_MONEY (Mobile Money)
- MIXED (Mixte)

**Contrainte clé:** Un paiement ne peut cibler qu'UNE seule entité (dépense OU document fournisseur, jamais les deux).

### 4.5 Module Pertes Financières

**Description:** Valorisation financière des pertes liées au stock.

**Raisons de perte:**
| Code | Libellé | Impact Comptable |
|------|---------|------------------|
| EXPIRED | Péremption | Perte sur stock |
| DAMAGED | Casse | Perte sur stock |
| THEFT | Vol | Perte exceptionnelle |
| ENTRY_ERROR | Erreur de saisie | Régularisation |
| UNRECORDED_EXIT | Sortie non enregistrée | Perte sur stock |
| INVENTORY_ADJUSTMENT | Ajustement inventaire | Régularisation |
| RETURN_REJECTED | Retour refusé | Perte sur stock |

**Calcul valorisation:**
```
Valeur Perte = Quantité × Prix Unitaire Achat
```

### 4.6 Module IPM/Mutuelles

**Description:** Gestion des créances auprès des organismes de santé.

**Entités:**
- **IPM** : Organisme (nom, code, contact, délai paiement)
- **Patient IPM** : Adhérent (numéro, nom, relation avec IPM)
- **Réclamation** : Période de facturation avec cycle de vie

**Cycle de vie des réclamations:**

```
DRAFT → SENT → ACCEPTED → PAID
          ↓        ↓
       REJECTED  PARTIAL
```

**Indicateurs:**
- Encours par IPM
- Vieillissement des créances (0-30j, 31-60j, 61-90j, >90j)
- Taux de recouvrement

### 4.7 Module Comptabilité

**Description:** Journal comptable automatisé (non modifiable).

**Principe:** Chaque opération financière génère automatiquement les écritures comptables correspondantes via des triggers PostgreSQL.

**Types d'écritures:**
- Paiement dépense → DEBIT compte charge, CREDIT trésorerie
- Paiement fournisseur → DEBIT fournisseur, CREDIT trésorerie
- Encaissement IPM → DEBIT trésorerie, CREDIT client IPM

**Règle d'intégrité:** Les écritures comptables sont **immuables** - aucune modification ou suppression possible (enforced by database triggers).

### 4.8 Module Point de Vente (POS)

**Description:** Interface de caisse pour les transactions de vente.

**Fonctionnalités:**
| Fonction | Description |
|----------|-------------|
| Recherche produits | Par nom, code-barres, catégorie |
| Multi-paniers | Gestion simultanée de plusieurs clients |
| Sélection client | Comptant, IPM, Crédit, Bon |
| Calcul automatique | Sous-total, remise, total |
| Paiement | Espèces avec calcul rendu monnaie |
| Impression ticket | Format thermique (future) |

**Types de vente:**
- COMPTANT : Paiement immédiat
- MUTUELLE_IPM : Tiers payant organisme
- CREDIT_PATIENT : Crédit personnel
- BON_PATIENT : Bon de commande
- PROFORMA : Devis (sans impact financier)

**Contrainte PROFORMA:** Les ventes proforma n'ont AUCUN impact financier - montant_payé = 0, pas d'écriture comptable.

### 4.9 Module Historique Ventes

**Description:** Consultation et analyse des ventes passées.

**Fonctionnalités:**
- Liste paginée avec filtres (date, type, statut)
- Détail vente avec lignes articles
- Cartes statistiques (CA jour, nombre ventes, panier moyen)
- Export (future V1)

---

## 5. Exigences Techniques

### 5.1 Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend | Next.js (App Router) | 15.x |
| UI Framework | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Database | PostgreSQL (Neon) | 16.x |
| ORM | Raw SQL (Neon Serverless) | - |
| Auth | Custom JWT | - |
| Hosting | Vercel | - |

### 5.2 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Pages     │  │ Components  │  │   Hooks     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Actions   │  │ Middleware  │  │     API     │     │
│  │  (Server)   │  │   (Auth)    │  │   Routes    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (Neon/PostgreSQL)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Tables    │  │  Triggers   │  │    Views    │     │
│  │             │  │ (Auto-gen)  │  │  (Read-only)│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Principes Architecturaux

| Principe | Description |
|----------|-------------|
| Database-First | Toute la logique métier est enforced au niveau DB |
| Auditabilité | Chaque table a created_at, created_by, updated_at, updated_by |
| Soft Delete | Suppression logique via deleted_at (jamais de DELETE physique) |
| Immutabilité | Les écritures comptables ne peuvent être modifiées |
| Computed Values | Les indicateurs sont calculés, jamais stockés |

### 5.4 Sécurité

| Mesure | Implémentation |
|--------|----------------|
| Authentification | JWT avec expiration, stockage cookie HTTP-only |
| Mots de passe | Hachage bcrypt (cost factor 10) |
| Sessions | Validation serveur à chaque requête protégée |
| SQL Injection | Requêtes paramétrées (tagged templates Neon) |
| XSS | Échappement automatique React |
| CSRF | Cookies SameSite, validation origine |

### 5.5 Performance

| Métrique | Objectif |
|----------|----------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Requête DB moyenne | < 100ms |
| Disponibilité | 99.5% |

---

## 6. Exigences Utilisateur

### 6.1 Personas

#### Persona 1 : Dr. Aminata Diallo (Pharmacien Titulaire)
- **Âge:** 45 ans
- **Contexte:** Gère une pharmacie de quartier à Dakar
- **Besoins:** Vision globale de l'activité, suivi financier, gestion IPM
- **Frustrations:** Manque de visibilité sur les créances, difficultés de réconciliation

#### Persona 2 : Moussa Ndiaye (Caissier)
- **Âge:** 28 ans
- **Contexte:** Employé depuis 3 ans, gère les ventes quotidiennes
- **Besoins:** Interface rapide, recherche produits efficace, gestion multi-clients
- **Frustrations:** Lenteur des systèmes actuels, erreurs de caisse

#### Persona 3 : Fatou Sow (Assistante Administrative)
- **Âge:** 35 ans
- **Contexte:** Gère la comptabilité et les relations fournisseurs
- **Besoins:** Suivi des paiements, catégorisation des dépenses, rapports
- **Frustrations:** Double saisie, réconciliation manuelle

### 6.2 User Stories Prioritaires

| ID | User Story | Priorité | Critères d'Acceptation |
|----|------------|----------|------------------------|
| US-001 | En tant que caissier, je veux scanner un produit pour l'ajouter au panier | P0 | Recherche par nom/code, ajout instantané |
| US-002 | En tant que caissier, je veux gérer plusieurs paniers simultanément | P0 | Onglets de panier, switch rapide |
| US-003 | En tant que caissier, je veux sélectionner le type de client (comptant/IPM) | P0 | Dropdown avec recherche patient IPM |
| US-004 | En tant que pharmacien, je veux voir le CA du jour en temps réel | P0 | Carte dashboard avec mise à jour auto |
| US-005 | En tant que pharmacien, je veux suivre les créances IPM par organisme | P0 | Liste avec encours et vieillissement |
| US-006 | En tant qu'admin, je veux valider les dépenses avant paiement | P1 | Workflow validation avec audit trail |
| US-007 | En tant qu'admin, je veux voir le journal comptable | P1 | Liste écritures, filtres, non éditable |
| US-008 | En tant que pharmacien, je veux enregistrer une perte de stock | P1 | Formulaire avec raison et valorisation |

### 6.3 Parcours Utilisateur Clés

#### Parcours 1 : Vente Comptant

```
1. Caissier ouvre le POS
2. Recherche/scanne les produits
3. Ajuste les quantités si nécessaire
4. Sélectionne "Comptant" comme type
5. Clique "Payer"
6. Entre le montant reçu
7. Système calcule le rendu
8. Confirme la vente
9. Ticket imprimé (future)
```

#### Parcours 2 : Vente IPM

```
1. Caissier ouvre le POS
2. Sélectionne "IPM/Mutuelle" comme type
3. Recherche le patient par numéro adhérent
4. Ajoute les produits prescrits
5. Applique la prise en charge (% couvert)
6. Calcule le reste à charge patient
7. Encaisse le reste à charge
8. Génère le bordereau IPM
```

#### Parcours 3 : Suivi Créance IPM

```
1. Admin accède au module IPM > Réclamations
2. Crée une nouvelle réclamation pour la période
3. Ajoute les ventes IPM de la période
4. Valide et envoie à l'IPM (statut SENT)
5. Reçoit confirmation (statut ACCEPTED)
6. Enregistre le paiement (statut PAID)
```

---

## 7. Architecture de Données

### 7.1 Modèle Entité-Relation Simplifié

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   expenses   │     │   payments   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email        │     │ type         │◄────│ expense_id   │
│ password_hash│     │ amount       │     │ amount       │
│ full_name    │     │ category_id  │     │ method       │
│ role         │     │ validated_at │     │ reference    │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  accounting  │
                     │   _entries   │
                     ├──────────────┤
                     │ id (PK)      │
                     │ entry_type   │
                     │ debit/credit │
                     │ (immutable)  │
                     └──────────────┘
```

### 7.2 Tables Principales

| Table | Description | Clés Étrangères |
|-------|-------------|-----------------|
| users | Utilisateurs système | - |
| expenses | Dépenses opérationnelles | expense_category_id |
| payments | Paiements sortants | expense_id OR supplier_document_id |
| financial_losses | Pertes valorisées | product_id, stock_movement_id |
| accounting_entries | Journal comptable | expense_category_id |
| ipms | Organismes IPM | - |
| ipm_patients | Adhérents IPM | ipm_id |
| ipm_claims | Réclamations IPM | ipm_id |
| receivable_payments | Encaissements IPM | ipm_claim_id |
| carts | Paniers en cours | user_id |
| cart_items | Lignes panier | cart_id, product_id |
| sales | Ventes validées | user_id, patient_id, ipm_id |
| sale_items | Lignes vente | sale_id, product_id |

### 7.3 Vues Calculées

| Vue | Description | Usage |
|-----|-------------|-------|
| v_financial_dashboard_summary | Agrégation KPIs | Dashboard |
| v_supplier_outstanding_debt | Encours fournisseurs | Dashboard, Paiements |
| v_total_losses_by_period | Pertes par période | Reporting |
| v_ipm_outstanding_balances | Créances IPM avec aging | Module IPM |
| v_sales_revenue_summary | CA par jour/type | Historique ventes |
| v_accounting_balance_by_category | Balance par catégorie | Comptabilité |
| v_active_carts | Paniers actifs | POS |

---

## 8. Critères de Succès

### 8.1 KPIs Quantitatifs

| KPI | Baseline | Objectif V0 | Méthode Mesure |
|-----|----------|-------------|----------------|
| Temps moyen transaction | 3 min | < 1.5 min | Analytics POS |
| Erreurs de caisse/jour | 5 | < 2 | Logs ajustements |
| Délai récupération IPM | 60 jours | < 45 jours | Vieillissement créances |
| Pertes stock identifiées | 70% | > 95% | Ratio pertes/inventaire |
| Adoption utilisateurs | 0% | > 80% | Connexions actives |

### 8.2 Critères Qualitatifs

| Critère | Description | Validation |
|---------|-------------|------------|
| Utilisabilité | Interface intuitive, courbe d'apprentissage < 2h | Tests utilisateurs |
| Fiabilité | Aucune perte de données, cohérence comptable | Audit trail |
| Performance | Temps de réponse acceptable | Monitoring |
| Maintenabilité | Code documenté, architecture claire | Review technique |

### 8.3 Definition of Done (DoD) V0

- [ ] Tous les modules listés sont fonctionnels
- [ ] Base de données initialisée avec schéma complet
- [ ] Authentification sécurisée opérationnelle
- [ ] Triggers comptables fonctionnels
- [ ] Tests manuels passés sur parcours critiques
- [ ] Documentation technique à jour
- [ ] Déploiement Vercel réussi
- [ ] Formation utilisateurs pilotes effectuée

---

## 9. Échéancier et Jalons

### 9.1 Planning V0

| Phase | Durée | Dates | Livrables |
|-------|-------|-------|-----------|
| **Phase 1 : Fondations** | 2 sem | S1-S2 | DB schema, Auth, Layout |
| **Phase 2 : Core Finance** | 3 sem | S3-S5 | Dépenses, Paiements, Dashboard |
| **Phase 3 : IPM** | 2 sem | S6-S7 | IPM, Réclamations, Encaissements |
| **Phase 4 : POS** | 2 sem | S8-S9 | Interface vente, Historique |
| **Phase 5 : Polish** | 1 sem | S10 | Tests, Corrections, Documentation |
| **Phase 6 : Pilote** | 2 sem | S11-S12 | Déploiement, Formation, Support |

### 9.2 Jalons Clés

| Jalon | Date | Critères |
|-------|------|----------|
| M1 : DB Ready | Fin S2 | Schéma complet, migrations passées |
| M2 : Core Modules | Fin S5 | Dépenses + Paiements fonctionnels |
| M3 : IPM Complet | Fin S7 | Cycle IPM de bout en bout |
| M4 : POS Opérationnel | Fin S9 | Ventes possibles |
| M5 : Go-Live Pilote | Fin S12 | Pharmacie pilote en production |

---

## 10. Responsabilités

### 10.1 Matrice RACI

| Activité | Product Owner | Tech Lead | Dev | QA | Pharmacien Pilote |
|----------|:-------------:|:---------:|:---:|:--:|:-----------------:|
| Définition besoins | R | C | I | I | C |
| Architecture | C | R | A | I | I |
| Développement | I | A | R | C | I |
| Tests fonctionnels | A | C | I | R | C |
| Validation métier | R | I | I | C | A |
| Déploiement | I | R | A | C | I |
| Formation | C | I | I | I | R |

*R = Responsable, A = Approbateur, C = Consulté, I = Informé*

### 10.2 Points de Contact

| Rôle | Responsabilités |
|------|-----------------|
| Product Owner | Vision produit, priorisation backlog, validation |
| Tech Lead | Architecture, décisions techniques, code review |
| Développeur | Implémentation, tests unitaires, documentation |
| QA | Tests fonctionnels, non-régression, UAT |
| Pharmacien Pilote | Validation métier, retours terrain, formation |

---

## 11. Risques et Mitigation

### 11.1 Registre des Risques

| ID | Risque | Probabilité | Impact | Mitigation |
|----|--------|:-----------:|:------:|------------|
| R1 | Résistance au changement utilisateurs | Haute | Moyen | Formation progressive, accompagnement |
| R2 | Qualité données existantes | Moyenne | Haut | Audit préalable, scripts nettoyage |
| R3 | Connectivité internet instable | Moyenne | Haut | Architecture offline-first (V1) |
| R4 | Complexité réglementaire IPM | Moyenne | Moyen | Consultation experts, flexibilité config |
| R5 | Performance avec volume données | Basse | Moyen | Indexation, pagination, monitoring |

### 11.2 Plan de Contingence

| Risque | Déclencheur | Action |
|--------|-------------|--------|
| R1 | Taux adoption < 50% à S14 | Session formation supplémentaire, ambassadeur interne |
| R2 | > 20% données incohérentes | Sprint dédié nettoyage avant go-live |
| R3 | > 5% transactions échouées | Accélérer module offline V1 |

---

## 12. Exclusions V0

### 12.1 Fonctionnalités Reportées à V1+

| Fonctionnalité | Raison Report | Version Cible |
|----------------|---------------|---------------|
| Mode offline | Complexité technique | V1 |
| Gestion stocks complète | Scope MVP | V1 |
| Comptabilité OHADA | Réglementation complexe | V2 |
| Multi-pharmacies | Scope MVP | V2 |
| App mobile native | Priorité web | V2 |
| Intégration grossistes | Dépendances externes | V1 |
| Alertes péremption auto | Requires stock module | V1 |
| Rapports personnalisés | Scope MVP | V1 |
| Export PDF/Excel | Nice-to-have | V1 |

### 12.2 Limitations Connues V0

- Pas de calcul automatique des marges (requiert module stock)
- Pas de gestion des retours clients
- Pas d'intégration paiement mobile (Wave, Orange Money)
- Interface uniquement en français
- Pas de support impression ticket (preview only)

---

## 13. Conclusion

### 13.1 Récapitulatif

APHIA V0 pose les fondations d'un système de gestion de pharmacie moderne et adapté au contexte sénégalais. En privilégiant une approche "database-first" avec une architecture robuste et auditable, le MVP répond aux besoins opérationnels essentiels tout en préparant le terrain pour les évolutions futures.

### 13.2 Prochaines Étapes

1. **Validation PRD** - Revue et approbation par les parties prenantes
2. **Setup technique** - Environnements de développement et staging
3. **Sprint 0** - Initialisation projet, CI/CD, conventions
4. **Kick-off Phase 1** - Démarrage développement

### 13.3 Contacts

Pour toute question concernant ce document :
- **Produit** : product@aphia.sn
- **Technique** : tech@aphia.sn
- **Support** : support@aphia.sn

---

*Document généré le 7 Janvier 2026*  
*APHIA - Application de Pharmacie Intégrée et Automatisée*  
*Version 1.0 - MVP V0*
