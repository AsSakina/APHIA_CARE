# Plan de Tests de Sécurité - APHIA V0

## 1. Tests d'Authentification

### 1.1 Protection des Routes

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| RT-01 | Accès direct à /app sans connexion | Redirection vers /auth/login |
| RT-02 | Accès à /app/expenses sans connexion | Redirection vers /auth/login |
| RT-03 | Accès à /auth/login avec session valide | Redirection vers /app |
| RT-04 | Accès à /auth/register avec session valide | Redirection vers /app |
| RT-05 | Token JWT expiré | Redirection vers /auth/login |
| RT-06 | Token JWT invalide/corrompu | Redirection vers /auth/login + suppression cookie |

### 1.2 Connexion

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| LG-01 | Email vide | Message "Email et mot de passe requis" |
| LG-02 | Mot de passe vide | Message "Email et mot de passe requis" |
| LG-03 | Email invalide (format) | Message "Format d'email invalide" |
| LG-04 | Email inexistant | Message "Aucun compte trouvé avec cet email" |
| LG-05 | Mot de passe incorrect | Message "Email ou mot de passe incorrect" |
| LG-06 | Compte désactivé | Message "Ce compte a été désactivé" |
| LG-07 | Connexion réussie | Redirection vers /app + cookie session créé |
| LG-08 | 5 tentatives échouées | Compte verrouillé 15 min |
| LG-09 | Tentative sur compte verrouillé | Message avec temps restant |

### 1.3 Inscription

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| RG-01 | Champs requis manquants | Messages d'erreur spécifiques par champ |
| RG-02 | Email déjà utilisé | Message "Un compte existe déjà avec cet email" |
| RG-03 | Mot de passe < 8 caractères | Message de validation |
| RG-04 | Mot de passe sans majuscule | Message de validation |
| RG-05 | Mot de passe sans chiffre | Message de validation |
| RG-06 | Mots de passe non correspondants | Message "Les mots de passe ne correspondent pas" |
| RG-07 | Inscription réussie | Compte créé + connexion auto + redirection /app |

### 1.4 Déconnexion

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| LO-01 | Clic sur "Déconnexion" | Cookie supprimé + redirection /auth/login |
| LO-02 | Accès /app après déconnexion | Redirection vers /auth/login |

---

## 2. Tests de Sécurité Avancés

### 2.1 Protection contre les Attaques

| Test | Description | Résultat Attendu |
|------|-------------|------------------|
| SEC-01 | Injection SQL dans email | Requête sécurisée (paramétrage) |
| SEC-02 | XSS dans champs de formulaire | Échappement automatique |
| SEC-03 | Brute force mot de passe | Verrouillage après 5 tentatives |
| SEC-04 | Manipulation de cookie | Session invalidée |
| SEC-05 | Cookie non-httpOnly | N/A (cookie est httpOnly) |
| SEC-06 | Accès CSRF | Protection via SameSite=Lax |

### 2.2 Headers de Sécurité

| Header | Valeur | Vérification |
|--------|--------|--------------|
| X-Content-Type-Options | nosniff | ✓ |
| X-Frame-Options | DENY | ✓ |
| X-XSS-Protection | 1; mode=block | ✓ |
| Referrer-Policy | strict-origin-when-cross-origin | ✓ |

---

## 3. Procédure de Test

### 3.1 Environnement

```
URL de test: [URL de l'environnement]
Navigateur: Chrome/Firefox/Safari (dernières versions)
Outils: DevTools, Network tab, Application tab (cookies)
```

### 3.2 Données de Test

| Utilisateur | Email | Mot de passe | Rôle |
|-------------|-------|--------------|------|
| Admin | admin@aphia.sn | admin123 | admin |
| Pharmacien | pharmacien@aphia.sn | pharma123 | pharmacist |
| Test nouveau | [créer] | [créer] | user |

### 3.3 Checklist d'Exécution

- [ ] RT-01 à RT-06 (Protection routes)
- [ ] LG-01 à LG-09 (Connexion)
- [ ] RG-01 à RG-07 (Inscription)
- [ ] LO-01 à LO-02 (Déconnexion)
- [ ] SEC-01 à SEC-06 (Sécurité avancée)
- [ ] Vérification headers de sécurité

---

## 4. Rapport de Test

| Date | Testeur | Version | Tests Passés | Tests Échoués | Notes |
|------|---------|---------|--------------|---------------|-------|
| | | V0 | | | |

---

## 5. Annexe: Commandes de Vérification

### Vérifier les cookies (DevTools > Application > Cookies)

```
Nom: aphia_session
HttpOnly: true
Secure: true (production) / false (dev)
SameSite: Lax
```

### Vérifier les headers (DevTools > Network > [requête] > Headers)

```
Chercher: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
```
