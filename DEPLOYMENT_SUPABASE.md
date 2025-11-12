# 🗄️ Guide de Migration Supabase - Ananas Garden

Ce guide vous accompagne pour migrer votre base de données MySQL/TiDB vers Supabase PostgreSQL.

---

## 📋 Pourquoi Migrer vers Supabase ?

✅ **Avantages** :
- Base de données PostgreSQL gérée et scalable
- Authentification intégrée (alternative à Manus OAuth)
- API REST automatique pour toutes les tables
- Stockage de fichiers S3-compatible intégré
- Dashboard d'administration puissant
- Backups automatiques quotidiens
- Plan gratuit généreux (500 MB, 2 GB transfert/mois)

---

## 🚀 Étape 1 : Créer un Projet Supabase

1. **Aller sur [supabase.com](https://supabase.com)**

2. **Créer un compte** (gratuit)

3. **Créer un nouveau projet** :
   - Nom : `ananas-garden`
   - Database Password : Générer un mot de passe fort (le sauvegarder !)
   - Région : `Europe (Frankfurt)` ou la plus proche de vos utilisateurs
   - Plan : `Free` pour commencer

4. **Attendre la création** (2-3 minutes)

---

## 🔐 Étape 2 : Récupérer les Identifiants

Dans le dashboard Supabase, aller dans `Settings → API` :

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Dans `Settings → Database` :

```
Connection string:
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 📊 Étape 3 : Adapter le Schéma pour PostgreSQL

Supabase utilise PostgreSQL, pas MySQL. Voici les adaptations nécessaires :

### Différences MySQL → PostgreSQL

| MySQL | PostgreSQL | Notes |
|-------|------------|-------|
| `AUTO_INCREMENT` | `SERIAL` ou `GENERATED ALWAYS AS IDENTITY` | Auto-incrémentation |
| `INT` | `INTEGER` | Entiers |
| `VARCHAR(n)` | `VARCHAR(n)` | Texte court |
| `TEXT` | `TEXT` | Texte long |
| `TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | Horodatage |
| `DEFAULT (now())` | `DEFAULT now()` | Date actuelle |
| `ON UPDATE CURRENT_TIMESTAMP` | Trigger `updated_at` | Mise à jour auto |

### Script de Conversion Automatique

Créer un fichier `supabase-schema.sql` :

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "lastSignedIn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Flowers table
CREATE TABLE flowers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  symbolism TEXT NOT NULL,
  emotions TEXT,
  color VARCHAR(100),
  "pricePerStem" INTEGER NOT NULL,
  "imageUrl" TEXT,
  description TEXT,
  season VARCHAR(100),
  availability VARCHAR(50) NOT NULL DEFAULT 'available',
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bouquets table
CREATE TABLE bouquets (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES users(id),
  "originalMessage" TEXT NOT NULL,
  explanation TEXT NOT NULL,
  budget VARCHAR(50) NOT NULL,
  style VARCHAR(100),
  occasion VARCHAR(255),
  "totalPrice" INTEGER NOT NULL,
  "imageUrl" TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bouquet Flowers (junction table)
CREATE TABLE "bouquetFlowers" (
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id) ON DELETE CASCADE,
  "flowerId" INTEGER NOT NULL REFERENCES flowers(id),
  quantity INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY ("bouquetId", "flowerId")
);

-- Gallery table
CREATE TABLE gallery (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "imageUrl" TEXT NOT NULL,
  "bouquetType" VARCHAR(100),
  tags TEXT,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Wishlists table
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id) ON DELETE CASCADE,
  notes TEXT,
  "notifyOnPromotion" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE("userId", "bouquetId")
);

-- Cart Items table
CREATE TABLE "cartItems" (
  id SERIAL PRIMARY KEY,
  "sessionId" VARCHAR(255) NOT NULL,
  "userId" INTEGER REFERENCES users(id),
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES users(id),
  "sessionId" VARCHAR(255),
  "totalAmount" INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  "paymentMethod" VARCHAR(50),
  "paymentStatus" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "shippingAddress" TEXT NOT NULL,
  "shippingCity" VARCHAR(255) NOT NULL,
  "shippingPostalCode" VARCHAR(20) NOT NULL,
  "shippingCountry" VARCHAR(100) NOT NULL DEFAULT 'France',
  "deliveryDate" TIMESTAMP WITH TIME ZONE,
  "trackingNumber" VARCHAR(255),
  notes TEXT,
  "stripePaymentIntentId" VARCHAR(255),
  "paypalOrderId" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "completedAt" TIMESTAMP WITH TIME ZONE
);

-- Order Items table
CREATE TABLE "orderItems" (
  id SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id),
  quantity INTEGER NOT NULL,
  "priceAtPurchase" INTEGER NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Favorites table
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE("userId", "bouquetId")
);

-- Loyalty Points table
CREATE TABLE "loyaltyPoints" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  "totalPoints" INTEGER NOT NULL DEFAULT 0,
  "availablePoints" INTEGER NOT NULL DEFAULT 0,
  "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
  "currentTier" VARCHAR(50) NOT NULL DEFAULT 'bronze',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Loyalty Transactions table
CREATE TABLE "loyaltyTransactions" (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "orderId" INTEGER REFERENCES orders(id),
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "bouquetId" INTEGER NOT NULL REFERENCES bouquets(id),
  frequency VARCHAR(50) NOT NULL,
  "nextDeliveryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "lastDeliveryDate" TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  "deliveryAddress" TEXT NOT NULL,
  "deliveryCity" VARCHAR(255) NOT NULL,
  "deliveryPostalCode" VARCHAR(20) NOT NULL,
  "deliveryCountry" VARCHAR(100) NOT NULL DEFAULT 'France',
  "stripeSubscriptionId" VARCHAR(255),
  "paypalSubscriptionId" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "cancelledAt" TIMESTAMP WITH TIME ZONE
);

-- Testimonials table
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES users(id),
  "orderId" INTEGER REFERENCES orders(id),
  "customerName" VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Referrals table
CREATE TABLE referrals (
  id SERIAL PRIMARY KEY,
  "referrerId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "referredId" INTEGER REFERENCES users(id),
  "referralCode" VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  "rewardPoints" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "completedAt" TIMESTAMP WITH TIME ZONE
);

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "actionUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog Posts table
CREATE TABLE "blogPosts" (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  "coverImage" TEXT,
  author VARCHAR(255) NOT NULL DEFAULT 'Ananas Garden',
  category VARCHAR(100),
  tags TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flowers_updated_at BEFORE UPDATE ON flowers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bouquets_updated_at BEFORE UPDATE ON bouquets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cartItems_updated_at BEFORE UPDATE ON "cartItems"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyaltyPoints_updated_at BEFORE UPDATE ON "loyaltyPoints"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogPosts_updated_at BEFORE UPDATE ON "blogPosts"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_users_openId ON users("openId");
CREATE INDEX idx_bouquets_userId ON bouquets("userId");
CREATE INDEX idx_bouquets_status ON bouquets(status);
CREATE INDEX idx_wishlists_userId ON wishlists("userId");
CREATE INDEX idx_wishlists_bouquetId ON wishlists("bouquetId");
CREATE INDEX idx_cartItems_sessionId ON "cartItems"("sessionId");
CREATE INDEX idx_cartItems_userId ON "cartItems"("userId");
CREATE INDEX idx_orders_userId ON orders("userId");
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_favorites_userId ON favorites("userId");
CREATE INDEX idx_loyaltyPoints_userId ON "loyaltyPoints"("userId");
CREATE INDEX idx_referrals_referralCode ON referrals("referralCode");
CREATE INDEX idx_notifications_userId ON notifications("userId");
CREATE INDEX idx_blogPosts_slug ON "blogPosts"(slug);
```

---

## 🔄 Étape 4 : Exécuter la Migration

### Option A : Via le Dashboard Supabase (Recommandé)

1. **Aller dans `SQL Editor`** dans le dashboard Supabase

2. **Créer une nouvelle query**

3. **Copier-coller le contenu de `supabase-schema.sql`**

4. **Exécuter** (Run)

5. **Vérifier** dans `Table Editor` que toutes les tables sont créées

### Option B : Via la CLI Supabase

```bash
# Installer la CLI Supabase
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref xxxxx

# Exécuter la migration
supabase db push --file supabase-schema.sql
```

---

## 📦 Étape 5 : Migrer les Données

### Exporter depuis MySQL/TiDB

```bash
# Exporter toutes les données
mysqldump -u username -p --no-create-info ananas_garden > data.sql
```

### Adapter le Format

Les données MySQL doivent être adaptées pour PostgreSQL :

```bash
# Remplacer les backticks par des guillemets
sed -i "s/\`/\"/g" data.sql

# Adapter les valeurs booléennes
sed -i "s/,1,/,true,/g" data.sql
sed -i "s/,0,/,false,/g" data.sql
```

### Importer dans Supabase

1. **Via le Dashboard** : `SQL Editor` → Coller le SQL adapté → Run

2. **Via la CLI** :
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" < data.sql
   ```

---

## 🔧 Étape 6 : Mettre à Jour le Code

### 1. Installer Supabase SDK

```bash
pnpm add @supabase/supabase-js
```

### 2. Créer le Client Supabase

Créer `server/_core/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

### 3. Mettre à Jour les Variables d'Environnement

Dans Vercel (`Settings → Environment Variables`) :

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Adapter Drizzle pour PostgreSQL

Modifier `drizzle.config.ts` :

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle',
  driver: 'pg', // Changé de 'mysql2' à 'pg'
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## ✅ Étape 7 : Tests Post-Migration

Tester ces fonctionnalités :

- [ ] **Authentification** : Login/Logout
- [ ] **CRUD Bouquets** : Créer, lire, modifier, supprimer
- [ ] **Wishlist** : Ajouter/retirer des favoris
- [ ] **Panier** : Ajouter/supprimer des articles
- [ ] **Commandes** : Créer une commande
- [ ] **Galerie** : Afficher les images
- [ ] **Blog** : Lire les articles

---

## 🎉 Migration Terminée !

Votre application utilise maintenant Supabase ! 🚀

**Avantages immédiats** :
- Backups automatiques
- Dashboard d'administration
- API REST automatique
- Stockage de fichiers intégré
- Scalabilité PostgreSQL

**Prochaines étapes** :
1. Configurer les Row Level Security (RLS) policies
2. Activer les backups automatiques
3. Monitorer les performances dans le dashboard
4. Configurer les webhooks pour les événements
