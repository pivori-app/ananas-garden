# 🚀 Guide de Déploiement Vercel - Ananas Garden

Ce guide vous accompagne pas à pas pour déployer Ananas Garden sur Vercel.

---

## 📋 Prérequis

- ✅ Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- ✅ Compte GitHub avec le repository `pivori-app/ananas-garden`
- ✅ Base de données MySQL/TiDB accessible depuis internet
- ✅ Clés API Stripe et PayPal (mode test ou production)

---

## 🔧 Étape 1 : Préparer le Repository GitHub

1. **Vérifier que le code est à jour :**
   ```bash
   git status
   git push origin master
   ```

2. **S'assurer que ces fichiers sont présents :**
   - ✅ `vercel.json` (configuration Vercel)
   - ✅ `package.json` (dépendances)
   - ✅ `drizzle/schema.ts` (schéma de base de données)

---

## 🌐 Étape 2 : Créer le Projet Vercel

1. **Aller sur [vercel.com/new](https://vercel.com/new)**

2. **Importer le repository GitHub :**
   - Cliquer sur "Import Git Repository"
   - Sélectionner `pivori-app/ananas-garden`
   - Autoriser Vercel à accéder au repository

3. **Configuration du projet :**
   - **Framework Preset** : `Other` (ou laisser vide)
   - **Root Directory** : `.` (racine)
   - **Build Command** : `pnpm build`
   - **Output Directory** : `dist/public`
   - **Install Command** : `pnpm install`

---

## 🔐 Étape 3 : Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel (`Settings → Environment Variables`), ajouter :

### 🗄️ Base de données
```
DATABASE_URL=mysql://username:password@host:port/database
```

### 🔒 Authentification
```
JWT_SECRET=<générer avec: openssl rand -base64 32>
VITE_APP_ID=<votre-app-id-manus>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=<votre-open-id>
OWNER_NAME=<votre-nom>
```

### 💳 Paiements
```
# Stripe
STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... ou pk_test_...

# PayPal
PAYPAL_CLIENT_ID=<votre-paypal-client-id>
PAYPAL_CLIENT_SECRET=<votre-paypal-client-secret>
PAYPAL_MODE=sandbox ou live
```

### 🎨 Application
```
VITE_APP_TITLE=Ananas Garden
VITE_APP_LOGO=/ananas-garden-icon.png
```

### 🔧 Services Manus
```
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=<votre-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=<votre-frontend-forge-api-key>
```

### 📊 Analytics (Optionnel)
```
VITE_ANALYTICS_ENDPOINT=<votre-endpoint>
VITE_ANALYTICS_WEBSITE_ID=<votre-website-id>
```

**💡 Conseil** : Pour chaque variable, sélectionner les environnements : `Production`, `Preview`, `Development`

---

## 🏗️ Étape 4 : Déployer

1. **Cliquer sur "Deploy"** dans Vercel

2. **Attendre la fin du build** (2-5 minutes)

3. **Vérifier les logs** :
   - ✅ Build réussi
   - ✅ Aucune erreur TypeScript
   - ✅ Fichiers générés dans `dist/public`

4. **Accéder au site** :
   - URL temporaire : `https://ananas-garden-xxx.vercel.app`
   - Tester les fonctionnalités principales

---

## 🔗 Étape 5 : Configurer un Domaine Personnalisé (Optionnel)

1. **Aller dans `Settings → Domains`**

2. **Ajouter votre domaine** :
   - Exemple : `ananas-garden.com`
   - Suivre les instructions pour configurer les DNS

3. **Configurer les sous-domaines** :
   - `www.ananas-garden.com` → redirection vers domaine principal
   - `api.ananas-garden.com` → optionnel pour l'API

---

## 🗄️ Étape 6 : Migrer la Base de Données (Important !)

### Option A : Utiliser la base de données actuelle (TiDB/MySQL)

1. **S'assurer que la base est accessible depuis internet**
2. **Vérifier que `DATABASE_URL` est correctement configuré dans Vercel**
3. **Les tables existent déjà**, pas besoin de migration

### Option B : Migrer vers Supabase (Recommandé pour la production)

Voir le guide `DEPLOYMENT_SUPABASE.md` pour les instructions détaillées.

---

## ✅ Étape 7 : Tests Post-Déploiement

Tester ces fonctionnalités critiques :

- [ ] **Page d'accueil** : Affichage correct
- [ ] **Authentification** : Login/Logout via Manus OAuth
- [ ] **Création de bouquet** : Analyse émotionnelle + génération
- [ ] **Scanner** : Accès caméra + analyse d'image
- [ ] **Panier** : Ajout/suppression d'articles
- [ ] **Paiement** : Stripe et PayPal (mode test)
- [ ] **Galerie** : Affichage des images + filtres
- [ ] **Wishlist** : Ajout/suppression de favoris
- [ ] **FAQ** : Accordéons fonctionnels

---

## 🐛 Dépannage

### Erreur : "DATABASE_URL is not defined"
**Solution** : Vérifier que la variable est bien ajoutée dans `Settings → Environment Variables` et redéployer.

### Erreur : "Failed to connect to database"
**Solution** : 
- Vérifier que la base de données est accessible depuis internet
- Tester la connexion avec un client MySQL
- Vérifier les credentials (username, password, host, port)

### Erreur : "Build failed"
**Solution** :
- Consulter les logs de build dans Vercel
- Vérifier que `pnpm build` fonctionne en local
- S'assurer que toutes les dépendances sont dans `package.json`

### Erreur : "Stripe/PayPal payment failed"
**Solution** :
- Vérifier que les clés API sont correctes (test vs production)
- Tester avec les cartes de test Stripe : `4242 4242 4242 4242`
- Consulter les logs dans le dashboard Stripe/PayPal

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Variables d'environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Domaines personnalisés](https://vercel.com/docs/concepts/projects/domains)

---

## 🎉 Félicitations !

Votre application Ananas Garden est maintenant déployée sur Vercel ! 🌸

**Prochaines étapes** :
1. Configurer un domaine personnalisé
2. Migrer vers Supabase pour une meilleure scalabilité (voir `DEPLOYMENT_SUPABASE.md`)
3. Activer les paiements en mode production
4. Configurer les webhooks Stripe pour les notifications de paiement
