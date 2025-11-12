# 🚀 Guide Rapide de Déploiement - Ananas Garden

Votre projet est **prêt pour le déploiement** ! Suivez ces étapes simples pour le mettre en ligne.

---

## ✅ État Actuel

- ✅ **Projet Vercel créé** : `ananas-garden` (ID: `prj_pmc1NXaPKhgyyAPwLSY9JPSOi1aC`)
- ✅ **Repository GitHub** : `pivori-app/ananas-garden` (synchronisé)
- ✅ **Build validé** : 19.46s sans erreur
- ✅ **Configuration Vercel** : `vercel.json` prêt
- ✅ **Base de données** : TiDB/MySQL fonctionnelle (18 tables)

---

## 🔗 Étape 1 : Connecter GitHub à Vercel

1. **Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)**

2. **Sélectionner le projet `ananas-garden`**

3. **Aller dans `Settings` → `Git`**

4. **Cliquer sur `Connect Git Repository`**

5. **Sélectionner** :
   - Repository : `pivori-app/ananas-garden`
   - Branch : `master`
   - Framework Preset : `Vite`

6. **Cliquer sur `Connect`**

---

## 🔐 Étape 2 : Configurer les Variables d'Environnement

Dans `Settings` → `Environment Variables`, ajouter :

### Variables Obligatoires

```
DATABASE_URL=mysql://[votre-connexion-tidb]
JWT_SECRET=[générer-un-secret-fort]
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=[votre-app-id-manus]
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
```

### Variables Système (Auto-configurées)

```
VITE_APP_TITLE=Ananas Garden
VITE_APP_LOGO=/ananas-garden-icon.png
OWNER_OPEN_ID=[votre-openid]
OWNER_NAME=[votre-nom]
```

### Variables Optionnelles (Stripe, PayPal)

```
STRIPE_SECRET_KEY=[votre-clé-stripe]
STRIPE_PUBLISHABLE_KEY=[votre-clé-publique-stripe]
PAYPAL_CLIENT_ID=[votre-client-id-paypal]
PAYPAL_CLIENT_SECRET=[votre-secret-paypal]
```

**💡 Astuce** : Copiez les variables depuis votre environnement Manus actuel.

---

## 🚀 Étape 3 : Déclencher le Déploiement

### Option A : Déploiement Automatique (Recommandé)

Une fois GitHub connecté, Vercel déploiera automatiquement à chaque push sur `master`.

**Pour déclencher maintenant** :
```bash
git commit --allow-empty -m "trigger: Deploy to Vercel"
git push github master
```

### Option B : Déploiement Manuel

Dans le dashboard Vercel :
1. Aller dans l'onglet `Deployments`
2. Cliquer sur `Deploy`
3. Sélectionner la branche `master`
4. Cliquer sur `Deploy`

---

## 🔍 Étape 4 : Vérifier le Déploiement

1. **Attendre la fin du build** (2-3 minutes)

2. **Vérifier l'URL de production** : `https://ananas-garden.vercel.app`

3. **Tester les fonctionnalités principales** :
   - ✅ Page d'accueil
   - ✅ Création de bouquet
   - ✅ Catalogue de fleurs
   - ✅ Galerie
   - ✅ FAQ
   - ✅ Authentification
   - ✅ Panier et commande

---

## 🌐 Étape 5 : Configurer un Domaine Personnalisé (Optionnel)

1. **Aller dans `Settings` → `Domains`**

2. **Ajouter votre domaine** : `ananas-garden.fr` (exemple)

3. **Configurer les DNS** selon les instructions Vercel

4. **Attendre la propagation** (quelques minutes à 24h)

---

## 🐛 Dépannage

### Erreur de Build

- **Vérifier les logs** dans `Deployments` → Cliquer sur le déploiement échoué
- **Erreur TypeScript** : Les erreurs LSP du cache sont normales, le build fonctionne
- **Erreur de dépendances** : Vérifier que `package.json` est à jour

### Erreur de Base de Données

- **Vérifier `DATABASE_URL`** : Format correct `mysql://user:pass@host:port/db`
- **Tester la connexion** : Utiliser un client MySQL pour vérifier
- **Migrations** : S'assurer que toutes les migrations sont appliquées

### Erreur d'Authentification

- **Vérifier `VITE_APP_ID`** et `OAUTH_SERVER_URL`
- **Whitelist Vercel URL** : Ajouter `https://ananas-garden.vercel.app` dans les paramètres OAuth Manus

---

## 📊 Monitoring et Analytics

Vercel fournit automatiquement :
- **Analytics** : Trafic, performances, Core Web Vitals
- **Logs** : Logs en temps réel des fonctions serverless
- **Insights** : Rapports de performance et recommandations

Accès via le dashboard Vercel : `Analytics` et `Logs`

---

## 🎉 Félicitations !

Votre site **Ananas Garden** est maintenant en ligne ! 🌸

**URL de production** : https://ananas-garden.vercel.app

**Prochaines étapes** :
1. Tester toutes les fonctionnalités en production
2. Configurer un domaine personnalisé
3. Activer les paiements Stripe/PayPal
4. Promouvoir votre site sur les réseaux sociaux

---

## 📚 Ressources Utiles

- **Documentation Vercel** : https://vercel.com/docs
- **Guide complet** : `DEPLOYMENT_VERCEL.md` (dans le projet)
- **Migration Supabase** : `DEPLOYMENT_SUPABASE.md` (si besoin)
- **Support Vercel** : https://vercel.com/support

---

**Besoin d'aide ?** Consultez les guides détaillés ou contactez le support Vercel.
