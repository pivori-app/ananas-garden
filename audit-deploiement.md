# Rapport d'audit de déploiement - Ananas Garden

**Date de l'audit :** 12 novembre 2025  
**Projet :** Ananas Garden (ananas-garden)  
**Auditeur :** Manus AI  
**Scope :** GitHub, Vercel, Supabase (MySQL), Architecture applicative

---

## Résumé exécutif

L'audit du déploiement de l'application **Ananas Garden** révèle une architecture moderne basée sur React 19, tRPC 11, Express 4 et Tailwind 4, avec une base de données MySQL et une intégration Stripe pour les paiements. Le projet présente une configuration solide avec des headers de sécurité appropriés, mais souffre de problèmes critiques de déploiement automatique sur Vercel et d'absence de migration de base de données vers Supabase PostgreSQL pour la production.

**Score global : 6.5/10**

### Points forts identifiés

Le projet démontre une architecture technique robuste avec l'utilisation de tRPC pour la communication client-serveur, garantissant une sécurité de type end-to-end sans nécessiter de contrats manuels. La configuration des headers HTTP dans `vercel.json` inclut des protections essentielles contre les attaques XSS, le clickjacking et le sniffing MIME. Le schéma de base de données est bien structuré avec 21 tables couvrant l'ensemble du domaine métier (utilisateurs, fleurs, bouquets, commandes, abonnements, programme de fidélité, témoignages, notifications, parrainage, blog, galerie, wishlist, historique de scans, contacts anniversaires).

### Problèmes critiques détectés

Le déploiement automatique sur Vercel est **non fonctionnel** : le projet a le flag `"live": false`, ce qui désactive les webhooks GitHub et empêche tout déploiement automatique lors des commits. Le dernier déploiement READY (commit f853a04) date de 31 heures et utilise une configuration `vercel.json` obsolète qui expose le code source backend au lieu de servir l'application React compilée. La base de données utilise actuellement MySQL local sans migration vers Supabase PostgreSQL pour la production, ce qui pose des risques de perte de données et d'indisponibilité. Aucune GitHub Action n'est configurée pour les tests automatisés, le linting ou les vérifications de sécurité.

---

## 1. Audit GitHub

### 1.1 Configuration des branches

| Aspect | État | Détails |
|--------|------|---------|
| **Branche principale** | ✅ Configurée | `master` (remote: github/master) |
| **Branche de développement** | ⚠️ Manquante | Pas de branche `develop` ou `staging` |
| **Protection de branche** | ❌ Non vérifiable | Nécessite accès au dashboard GitHub |
| **Stratégie de merge** | ⚠️ Non documentée | Pas de CONTRIBUTING.md ou workflow défini |

**Recommandations :**

Implémenter une stratégie Git Flow avec au minimum trois branches : `main` (production), `develop` (intégration), et `feature/*` (développement de fonctionnalités). Activer la protection de branche sur `main` avec les règles suivantes : exiger au moins 1 approbation avant merge, bloquer les push directs, exiger que les vérifications de statut passent (CI/CD), et activer la signature des commits pour garantir l'authenticité. Documenter le workflow Git dans un fichier `CONTRIBUTING.md` à la racine du projet.

### 1.2 Webhooks et intégrations

| Service | État | Configuration |
|---------|------|---------------|
| **Vercel webhook** | ❌ Inactif | Le projet Vercel a `"live": false` |
| **GitHub Actions** | ❌ Absentes | Aucun fichier dans `.github/workflows/` |
| **Dependabot** | ⚠️ Non vérifié | Recommandé pour les mises à jour de sécurité |

**Problème critique identifié :** Le webhook GitHub → Vercel ne fonctionne pas, empêchant les déploiements automatiques. Les commits poussés vers `master` ne déclenchent aucun build sur Vercel.

**Actions correctives immédiates :**

1. Se connecter au dashboard Vercel (https://vercel.com/pivoris-projects-c21681dc/ananas-garden)
2. Vérifier dans **Settings → Git** que l'intégration GitHub est active
3. Activer le projet en mode "live" pour permettre les déploiements automatiques
4. Configurer le webhook GitHub si nécessaire (Vercel le fait automatiquement lors de la connexion)
5. Tester en créant un commit vide : `git commit --allow-empty -m "test: trigger Vercel deployment"`

### 1.3 Secrets et variables d'environnement

Le projet utilise un système de gestion des secrets via le dashboard Manus avec injection automatique des variables suivantes :

**Variables système (pré-configurées) :**
- `DATABASE_URL` : Connexion MySQL/TiDB
- `JWT_SECRET` : Signature des cookies de session
- `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` : Authentification Manus OAuth
- `VITE_APP_ID`, `OWNER_OPEN_ID`, `OWNER_NAME` : Identifiants projet
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` : APIs Manus (LLM, storage, notifications)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY` : Paiements Stripe
- `OPENAI_API_KEY` : Analyse d'images via GPT-4o-mini Vision

**Recommandations de sécurité :**

Les secrets ne doivent **jamais** être commités dans le repository. Vérifier l'absence de fichiers `.env` dans l'historique Git avec `git log --all --full-history -- .env`. Utiliser `git-secrets` ou `truffleHog` pour scanner les commits passés à la recherche de clés API exposées. Activer GitHub Secret Scanning dans les paramètres du repository pour détecter automatiquement les fuites de secrets. Implémenter une rotation régulière des clés API (tous les 90 jours minimum) et documenter la procédure dans un runbook.

### 1.4 Historique des commits

**Derniers commits (5 plus récents) :**

```
173fc7c - Checkpoint: Correction des boutons de navigation (12 nov 2025)
6e52206 - Checkpoint: Sélection de caméra multi-device et recadrage (12 nov 2025)
ec1f63d - Checkpoint: Implémentation permissions caméra (12 nov 2025)
59731aa - Checkpoint: Correction configuration Vercel (12 nov 2025)
ccf0fc4 - Checkpoint: Correction erreurs TypeScript (11 nov 2025)
```

**Analyse :** Les messages de commit suivent une convention cohérente avec préfixe "Checkpoint:" et description claire. Cependant, ils ne suivent pas la convention Conventional Commits (feat:, fix:, docs:, etc.) qui facilite la génération automatique de changelogs.

**Recommandation :** Adopter la convention Conventional Commits pour structurer les messages :
- `feat:` pour les nouvelles fonctionnalités
- `fix:` pour les corrections de bugs
- `docs:` pour la documentation
- `refactor:` pour le refactoring sans changement fonctionnel
- `test:` pour l'ajout de tests
- `chore:` pour les tâches de maintenance

---

## 2. Audit Vercel

### 2.1 Configuration du projet

**Fichier `vercel.json` :**

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "outputDirectory": "dist/public",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "regions": ["cdg1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Évaluation de la configuration :**

| Aspect | Note | Commentaire |
|--------|------|-------------|
| **Build command** | ✅ 10/10 | Utilise `pnpm build` qui compile Vite + esbuild |
| **Output directory** | ✅ 10/10 | `dist/public` correctement configuré pour servir le frontend React |
| **Routes API** | ✅ 9/10 | Séparation claire `/api/*` → backend, `/*` → SPA |
| **Headers de sécurité** | ⚠️ 7/10 | Manque CSP, HSTS, Referrer-Policy |
| **Cache des assets** | ✅ 10/10 | Cache immutable 1 an pour `/assets/*` |
| **Région de déploiement** | ✅ 10/10 | `cdg1` (Paris) optimal pour l'Europe |

**Headers de sécurité manquants :**

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://api.manus.im; frame-src https://js.stripe.com"
},
{
  "key": "Strict-Transport-Security",
  "value": "max-age=63072000; includeSubDomains; preload"
},
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
},
{
  "key": "Permissions-Policy",
  "value": "camera=(self), microphone=(), geolocation=()"
}
```

### 2.2 Analyse du build

**Taille du bundle :**

| Fichier | Taille | Évaluation |
|---------|--------|------------|
| `dist/public/assets/index-Dqiu0xUZ.js` | **2.3 MB** | ❌ Critique - Trop volumineux |
| `dist/public/index.html` | 360 KB | ⚠️ Élevé - Probablement inline CSS/JS |
| `dist/public/assets/` (total) | 16 MB | ❌ Critique - Bundle bloat sévère |
| `dist/index.js` (backend) | 139 KB | ✅ Acceptable |

**Problème de performance critique :** Le fichier JavaScript principal (`index-Dqiu0xUZ.js`) pèse **2.3 MB**, ce qui est **10x supérieur** à la recommandation de 200-300 KB pour un bundle initial. L'analyse révèle la présence de nombreux fichiers de syntaxe de langages de programmation (abap, actionscript, ada, angular, apache, apex, etc.) qui suggèrent l'inclusion de bibliothèques de coloration syntaxique (probablement Shiki ou Prism) non utilisées dans l'application.

**Actions correctives immédiates :**

1. **Activer le code splitting Vite** dans `vite.config.ts` :
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'trpc': ['@trpc/client', '@trpc/react-query', '@tanstack/react-query'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', /* autres composants UI */],
        }
      }
    }
  }
});
```

2. **Analyser le bundle avec `rollup-plugin-visualizer`** :
```bash
pnpm add -D rollup-plugin-visualizer
```

3. **Lazy load les routes** avec React.lazy() :
```typescript
const Scanner = lazy(() => import('./pages/Scanner'));
const Catalog = lazy(() => import('./pages/Catalog'));
```

4. **Supprimer les dépendances inutilisées** :
```bash
pnpm exec depcheck
```

### 2.3 État du déploiement

**Dernier déploiement READY :**
- **Commit :** f853a04 (il y a 31 heures)
- **URL :** https://ananas-garden.vercel.app
- **Statut :** ✅ READY
- **Problème :** Utilise l'ancienne configuration `vercel.json` qui expose le code source backend

**Nouveaux commits non déployés :**
- 173fc7c - Correction boutons navigation
- 6e52206 - Sélection caméra multi-device
- ec1f63d - Permissions caméra
- 59731aa - **Correction configuration Vercel** ⚠️ **NON DÉPLOYÉ**

**Cause racine :** Le projet Vercel a le flag `"live": false`, ce qui désactive complètement les webhooks GitHub et empêche tout déploiement automatique.

**Plan d'action immédiat :**

1. **Activer le projet sur Vercel :**
   - Dashboard → Settings → Git → Enable automatic deployments
   - Vérifier que la branche de production est bien `master`

2. **Déclencher un redéploiement manuel :**
   - Dashboard → Deployments → Redeploy (sélectionner le dernier commit)
   - Ou via CLI : `vercel --prod`

3. **Vérifier le déploiement :**
   - Attendre 2-3 minutes que le build se termine
   - Tester https://ananas-garden.vercel.app → doit afficher l'application React, pas le code source

4. **Configurer un Deploy Hook (optionnel mais recommandé) :**
   - Settings → Git → Deploy Hooks → Create Hook
   - Sauvegarder l'URL du webhook
   - Utiliser `curl -X POST <webhook_url>` pour déclencher des builds manuellement

### 2.4 Variables d'environnement

Les variables d'environnement sont gérées via le système Manus et injectées automatiquement. Cependant, pour un déploiement Vercel autonome, il faut configurer manuellement :

**Variables à ajouter dans Vercel Dashboard → Settings → Environment Variables :**

| Variable | Type | Valeur | Environnement |
|----------|------|--------|---------------|
| `DATABASE_URL` | Secret | `mysql://user:pass@host:3306/db` | Production |
| `JWT_SECRET` | Secret | Générer avec `openssl rand -base64 32` | Production |
| `STRIPE_SECRET_KEY` | Secret | `sk_live_...` (mode production) | Production |
| `STRIPE_WEBHOOK_SECRET` | Secret | `whsec_...` | Production |
| `OPENAI_API_KEY` | Secret | `sk-...` | Production |
| `NODE_ENV` | Plain Text | `production` | Production |
| `VITE_APP_TITLE` | Plain Text | `Ananas Garden` | Production, Preview |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Plain Text | `pk_live_...` | Production |

**⚠️ Attention :** Ne jamais utiliser les clés Stripe de test (`sk_test_*`, `pk_test_*`) en production.

---

## 3. Audit Supabase / Base de données

### 3.1 Architecture actuelle

**Type de base de données :** MySQL/TiDB (local ou cloud non spécifié)  
**ORM :** Drizzle ORM  
**Nombre de tables :** 21 tables  
**Migrations :** ❌ Aucune migration dans `drizzle/migrations/`  
**Seed data :** ✅ Scripts présents (`seed-flowers.mjs`, `seed-blog.mjs`, `seed-dashboard-test-data.mjs`)

**Problème critique :** L'application utilise actuellement une base de données MySQL locale sans stratégie de migration vers Supabase PostgreSQL pour la production. Cela pose plusieurs risques :

1. **Perte de données** : Si le serveur local tombe, toutes les données sont perdues
2. **Scalabilité limitée** : MySQL local ne peut pas gérer une charge importante
3. **Pas de backups automatiques** : Risque de perte irréversible en cas de défaillance
4. **Pas de réplication** : Pas de haute disponibilité
5. **Incompatibilité Vercel** : Les déploiements Vercel sont stateless, la base locale n'est pas accessible

### 3.2 Schéma de base de données

**Tables principales :**

| Table | Lignes estimées | Clés étrangères | Index | Commentaire |
|-------|----------------|-----------------|-------|-------------|
| `users` | 1-10K | 0 | `openId` (unique) | Authentification Manus OAuth |
| `flowers` | 100-500 | 0 | `name`, `color` | Catalogue de fleurs |
| `bouquets` | 10K-100K | `userId` | `userId`, `createdAt` | Bouquets générés par IA |
| `bouquetFlowers` | 100K-1M | `bouquetId`, `flowerId` | Composite | Relation many-to-many |
| `orders` | 10K-100K | `userId` | `userId`, `status`, `createdAt` | Commandes clients |
| `orderItems` | 100K-1M | `orderId`, `bouquetId` | `orderId` | Articles de commande |
| `cartItems` | 1K-10K | `userId`, `bouquetId` | `userId`, `sessionId` | Panier (volatile) |
| `subscriptions` | 100-1K | `userId` | `stripeSubscriptionId` | Abonnements mensuels |
| `loyaltyPoints` | 1K-10K | `userId` | `userId` (unique) | Programme de fidélité |
| `notifications` | 10K-100K | `userId` | `userId`, `read` | Notifications push |
| `referrals` | 1K-10K | `referrerId`, `referredUserId` | `referralCode` (unique) | Parrainage |
| `testimonials` | 100-1K | `userId` | `isVisible`, `isVerified` | Témoignages clients |
| `blogPosts` | 10-100 | 0 | `slug` (unique), `published` | Articles de blog |
| `scanHistory` | 10K-100K | `userId` | `userId`, `createdAt` | Historique scans IA |
| `birthdayContacts` | 1K-10K | `userId` | `userId`, `birthdayDate` | Contacts anniversaires |

**Problèmes de conception détectés :**

1. **Absence d'index composites** : Les requêtes fréquentes comme "bouquets d'un utilisateur triés par date" (`WHERE userId = ? ORDER BY createdAt DESC`) bénéficieraient d'un index composite `(userId, createdAt)`.

2. **Pas de contraintes ON DELETE CASCADE** : Si un utilisateur est supprimé, ses bouquets, commandes, etc. restent orphelins. Ajouter `onDelete: 'cascade'` dans les relations Drizzle.

3. **Champs JSON non typés** : Les colonnes `emotions`, `keywords`, `dominantColors`, `preferences` stockent du JSON en `text` sans validation. Utiliser le type `json` de MySQL ou PostgreSQL avec des schémas Zod.

4. **Pas de soft delete** : Les suppressions sont définitives. Ajouter un champ `deletedAt` pour permettre la récupération.

5. **Prix stockés en centimes (int)** : ✅ Bonne pratique pour éviter les erreurs de précision avec les décimaux.

### 3.3 Migration vers Supabase PostgreSQL

**Plan de migration recommandé :**

**Phase 1 : Préparation (1-2 jours)**

1. Créer un projet Supabase via le dashboard ou MCP :
```bash
manus-mcp-cli tool call create_project --server supabase --input '{
  "organizationId": "<org_id>",
  "name": "ananas-garden-prod",
  "region": "eu-west-1",
  "plan": "pro"
}'
```

2. Convertir le schéma Drizzle de MySQL vers PostgreSQL :
   - Remplacer `mysqlTable` par `pgTable`
   - Remplacer `mysqlEnum` par `pgEnum`
   - Remplacer `int` par `serial` pour les auto-increment
   - Remplacer `text` par `varchar` ou `text` selon la taille
   - Ajouter `uuid` pour les clés primaires (optionnel mais recommandé)

3. Générer les migrations Drizzle :
```bash
pnpm drizzle-kit generate:pg
```

**Phase 2 : Migration des données (1 jour)**

1. Exporter les données MySQL :
```bash
mysqldump -u user -p ananas_garden > backup.sql
```

2. Convertir le dump MySQL vers PostgreSQL avec `pgloader` :
```bash
pgloader mysql://user:pass@localhost/ananas_garden postgresql://postgres:pass@db.supabase.co:5432/postgres
```

3. Vérifier l'intégrité des données :
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM flowers;
-- etc.
```

**Phase 3 : Configuration RLS (Row Level Security) (1 jour)**

Supabase impose l'activation de RLS pour protéger les données. Créer des politiques pour chaque table :

```sql
-- Exemple pour la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid()::text = "openId");

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = "openId");

-- Exemple pour la table bouquets
ALTER TABLE bouquets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bouquets"
  ON bouquets FOR SELECT
  USING (auth.uid()::text IN (
    SELECT "openId" FROM users WHERE id = bouquets."userId"
  ));

CREATE POLICY "Users can create bouquets"
  ON bouquets FOR INSERT
  WITH CHECK (auth.uid()::text IN (
    SELECT "openId" FROM users WHERE id = bouquets."userId"
  ));
```

**Phase 4 : Tests et validation (2 jours)**

1. Créer une branche Supabase pour les tests :
```bash
manus-mcp-cli tool call create_branch --server supabase --input '{
  "projectRef": "<project_id>",
  "branchName": "staging"
}'
```

2. Tester toutes les procédures tRPC avec la nouvelle base
3. Vérifier les performances des requêtes avec `EXPLAIN ANALYZE`
4. Tester les webhooks Stripe avec la nouvelle configuration

**Phase 5 : Déploiement production (1 jour)**

1. Mettre à jour `DATABASE_URL` dans Vercel avec l'URL Supabase
2. Déployer la nouvelle version sur Vercel
3. Surveiller les logs et métriques pendant 24h
4. Conserver l'ancienne base MySQL en lecture seule pendant 7 jours (rollback possible)

### 3.4 Recommandations de sécurité base de données

**Authentification :**

1. **Utiliser Supabase Auth** au lieu de Manus OAuth (optionnel) :
   - Permet l'authentification native avec RLS
   - Support des providers sociaux (Google, GitHub, etc.)
   - Gestion automatique des sessions JWT

2. **Activer l'audit logging** :
```sql
CREATE EXTENSION IF NOT EXISTS pgaudit;
ALTER SYSTEM SET pgaudit.log = 'all';
```

3. **Chiffrer les données sensibles** :
   - Utiliser `pgcrypto` pour chiffrer les emails, téléphones, adresses
   - Exemple :
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE users ADD COLUMN email_encrypted BYTEA;
UPDATE users SET email_encrypted = pgp_sym_encrypt(email, '<encryption_key>');
```

4. **Limiter les permissions** :
   - Créer un utilisateur applicatif avec permissions minimales
   - Ne jamais utiliser le compte `postgres` en production

**Backups et disaster recovery :**

1. **Activer les backups automatiques Supabase** (inclus dans le plan Pro) :
   - Point-in-time recovery (PITR) jusqu'à 7 jours
   - Backups quotidiens conservés 30 jours

2. **Tester la procédure de restauration** :
```bash
manus-mcp-cli tool call restore_project --server supabase --input '{
  "projectRef": "<project_id>",
  "backupId": "<backup_id>"
}'
```

3. **Exporter les données critiques régulièrement** :
```bash
pg_dump -h db.supabase.co -U postgres -d postgres -t users -t orders > critical_backup.sql
```

---

## 4. Recommandations stratégiques

### 4.1 CI/CD et automatisation

**Créer un pipeline GitHub Actions complet :**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run check
      - run: pnpm run format --check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run test
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Ajouter des tests automatisés :**

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// server/__tests__/bouquet.test.ts
import { describe, it, expect } from 'vitest';
import { appRouter } from '../routers';

describe('Bouquet generation', () => {
  it('should generate a bouquet from emotional message', async () => {
    const caller = appRouter.createCaller({ user: mockUser });
    const result = await caller.bouquet.generate({
      message: "Je t'aime",
      budget: "standard",
      occasion: "anniversaire"
    });
    expect(result.bouquet).toBeDefined();
    expect(result.bouquet.flowers.length).toBeGreaterThan(0);
  });
});
```

### 4.2 Monitoring et observabilité

**Intégrer Sentry pour le tracking des erreurs :**

```bash
pnpm add @sentry/react @sentry/node
```

```typescript
// client/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

**Ajouter des métriques de performance :**

```typescript
// server/_core/index.ts
import { performance } from 'perf_hooks';

app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`${req.method} ${req.path} - ${duration.toFixed(2)}ms`);
  });
  next();
});
```

**Configurer Vercel Analytics :**

```typescript
// client/src/App.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Router />
      <Analytics />
    </>
  );
}
```

### 4.3 Optimisations de performance

**Implémenter le cache Redis pour les requêtes fréquentes :**

```bash
pnpm add ioredis
```

```typescript
// server/_core/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl = 3600): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

**Utiliser le cache dans les procédures tRPC :**

```typescript
// server/routers.ts
flower: router({
  list: publicProcedure.query(async () => {
    return getCached('flowers:all', async () => {
      const db = await getDb();
      return db.select().from(flowers).where(eq(flowers.stock, gt(0)));
    }, 3600); // Cache 1 heure
  }),
}),
```

**Activer la compression Brotli sur Vercel :**

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "br"
        }
      ]
    }
  ]
}
```

### 4.4 Sécurité avancée

**Implémenter le rate limiting :**

```bash
pnpm add express-rate-limit
```

```typescript
// server/_core/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});

app.use('/api/', limiter);
```

**Ajouter la validation des entrées avec Zod :**

```typescript
// server/routers.ts
import { z } from 'zod';

const createBouquetSchema = z.object({
  message: z.string().min(10).max(500),
  budget: z.enum(['economique', 'standard', 'premium']),
  occasion: z.string().optional(),
});

bouquet: router({
  create: protectedProcedure
    .input(createBouquetSchema)
    .mutation(async ({ input, ctx }) => {
      // input est maintenant typé et validé
    }),
}),
```

**Activer CORS avec restrictions :**

```typescript
// server/_core/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ananas-garden.vercel.app', 'https://ananas-garden.manus.space']
    : '*',
  credentials: true,
}));
```

---

## 5. Plan d'action prioritaire

### Urgence critique (À faire immédiatement)

**1. Activer le déploiement automatique Vercel (30 minutes)**
- Se connecter au dashboard Vercel
- Settings → Git → Enable automatic deployments
- Tester avec un commit vide
- Vérifier que https://ananas-garden.vercel.app affiche l'application React

**2. Réduire la taille du bundle JavaScript (2 heures)**
- Analyser le bundle avec `rollup-plugin-visualizer`
- Activer le code splitting dans `vite.config.ts`
- Lazy load les routes avec `React.lazy()`
- Objectif : réduire `index-*.js` de 2.3 MB à < 500 KB

**3. Configurer les variables d'environnement Vercel (1 heure)**
- Ajouter toutes les variables listées dans la section 2.4
- Vérifier que `DATABASE_URL` pointe vers une base de données accessible depuis Vercel
- Tester le déploiement avec les nouvelles variables

### Haute priorité (Cette semaine)

**4. Migrer vers Supabase PostgreSQL (5 jours)**
- Suivre le plan de migration détaillé section 3.3
- Créer un projet Supabase Pro
- Convertir le schéma Drizzle MySQL → PostgreSQL
- Migrer les données avec `pgloader`
- Configurer RLS (Row Level Security)
- Tester en staging avant production

**5. Implémenter GitHub Actions CI/CD (1 jour)**
- Créer `.github/workflows/ci.yml` avec lint, test, build, deploy
- Ajouter des tests unitaires avec Vitest
- Configurer Codecov pour le coverage
- Activer les checks obligatoires avant merge

**6. Ajouter les headers de sécurité manquants (2 heures)**
- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- Referrer-Policy
- Permissions-Policy
- Tester avec https://securityheaders.com

### Priorité moyenne (Ce mois-ci)

**7. Optimiser la base de données (3 jours)**
- Ajouter les index composites recommandés
- Implémenter le soft delete avec `deletedAt`
- Ajouter `ON DELETE CASCADE` sur les relations
- Valider les champs JSON avec Zod
- Tester les performances avec `EXPLAIN ANALYZE`

**8. Implémenter le monitoring (2 jours)**
- Intégrer Sentry pour le tracking des erreurs
- Activer Vercel Analytics
- Ajouter des métriques de performance custom
- Configurer les alertes Slack/Email

**9. Sécuriser l'API (2 jours)**
- Implémenter le rate limiting
- Ajouter la validation Zod sur toutes les procédures tRPC
- Configurer CORS avec whitelist
- Activer l'audit logging PostgreSQL

### Priorité basse (Trimestre)

**10. Améliorer la stratégie Git (1 jour)**
- Créer les branches `develop` et `staging`
- Activer la protection de branche sur `main`
- Documenter le workflow dans `CONTRIBUTING.md`
- Adopter Conventional Commits

**11. Implémenter le cache Redis (2 jours)**
- Configurer un cluster Redis (Upstash ou Redis Cloud)
- Cacher les requêtes fréquentes (liste des fleurs, catalogue)
- Invalider le cache lors des mises à jour
- Mesurer l'impact sur les performances

**12. Optimiser les images (1 jour)**
- Compresser les images avec `sharp` ou `imagemin`
- Utiliser WebP avec fallback JPEG
- Implémenter le lazy loading des images
- Configurer le CDN Vercel pour les images

---

## 6. Métriques de succès

**Objectifs à 1 mois :**

| Métrique | Valeur actuelle | Objectif | Méthode de mesure |
|----------|----------------|----------|-------------------|
| **Temps de déploiement** | Manuel (∞) | < 5 min automatique | GitHub Actions |
| **Taille du bundle JS** | 2.3 MB | < 500 KB | Lighthouse |
| **Score Lighthouse Performance** | Non mesuré | > 90/100 | PageSpeed Insights |
| **Score sécurité headers** | 7/10 | 10/10 | securityheaders.com |
| **Uptime base de données** | Non garanti | 99.9% | Supabase Dashboard |
| **Temps de réponse API (p95)** | Non mesuré | < 200ms | Vercel Analytics |
| **Couverture de tests** | 0% | > 70% | Codecov |

**Objectifs à 3 mois :**

- **Zero downtime deployments** avec blue-green deployment
- **Automatic rollback** en cas d'erreur critique
- **Feature flags** pour déployer progressivement les nouvelles fonctionnalités
- **A/B testing** sur les parcours critiques (création de bouquet, checkout)
- **Performance budget** : alertes si le bundle dépasse 600 KB

---

## 7. Conclusion

L'application **Ananas Garden** présente une architecture technique solide avec des choix modernes (React 19, tRPC 11, Tailwind 4), mais souffre de problèmes critiques de déploiement et d'infrastructure qui empêchent sa mise en production fiable. Les trois actions prioritaires sont :

1. **Réactiver le déploiement automatique Vercel** pour permettre les mises à jour continues
2. **Réduire drastiquement la taille du bundle JavaScript** (de 2.3 MB à < 500 KB) pour améliorer les performances
3. **Migrer vers Supabase PostgreSQL** pour garantir la persistance, la scalabilité et la haute disponibilité des données

Une fois ces problèmes résolus, l'application sera prête pour une mise en production avec un niveau de qualité professionnel. Le plan d'action détaillé ci-dessus fournit une roadmap claire pour atteindre cet objectif en 30 jours.

---

**Rapport généré par Manus AI le 12 novembre 2025**
