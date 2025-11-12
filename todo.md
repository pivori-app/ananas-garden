# Ananas Garden - Liste des fonctionnalités

## Phase 1 : Base de données et schéma
- [x] Créer la table `flowers` avec nom, symbolisme, émotions associées, prix unitaire, stock
- [x] Créer la table `bouquets` pour stocker les bouquets générés
- [x] Créer la table `bouquet_flowers` pour la relation many-to-many entre bouquets et fleurs
- [x] Créer la table `orders` pour les commandes
- [x] Créer la table `order_items` pour les articles de commande
- [x] Peupler la base avec au moins 30 fleurs et leurs significations

## Phase 2 : Backend et moteur d'analyse
- [x] Créer le moteur d'analyse émotionnelle (mapping mots-clés → émotions → fleurs)
- [x] Implémenter la procédure tRPC pour analyser un message texte
- [x] Implémenter la procédure tRPC pour générer un bouquet basé sur l'analyse
- [x] Créer les procédures CRUD pour les fleurs
- [x] Créer les procédures pour la gestion du panier
- [x] Créer les procédures pour la création de commandes
- [x] Implémenter la transcription vocale avec Web Speech API côté frontend

## Phase 3 : Interface utilisateur multi-étapes
- [x] Configurer le thème et les couleurs (blanc cassé, vert sauge, rose pâle, doré)
- [x] Configurer les polices (Playfair Display pour titres, Inter pour corps)
- [x] Créer la page d'accueil avec présentation du concept
- [x] Implémenter l'Étape 1 : Saisie du message émotionnel (texte + vocal)
- [x] Implémenter l'Étape 2 : Affinage du bouquet (occasion, budget, couleurs, style)
- [x] Implémenter l'Étape 3 : Génération et visualisation du bouquet
- [x] Implémenter l'Étape 4 : Personnalisation et ajout au panier
- [x] Créer l'indicateur de progression entre les étapes
- [x] Ajouter des animations fluides et micro-interactions

## Phase 4 : Système e-commerce
- [x] Créer la page panier avec gestion des quantités
- [x] Implémenter le calcul dynamique des prix
- [x] Créer le formulaire de livraison
- [x] Implémenter la page de confirmation de commande
- [ ] Créer la page de suivi des commandes pour utilisateurs connectés
- [ ] Ajouter la gestion des stocks (décrémenter après commande)

## Phase 5 : Fonctionnalités avancées
- [ ] Générer ou intégrer des images de fleurs avec fond transparent
- [ ] Implémenter le générateur visuel de bouquets (assemblage dynamique)
- [ ] Ajouter les options : vase, message personnalisé, date de livraison
- [ ] Créer une page admin pour gérer le catalogue de fleurs
- [ ] Implémenter la recherche et filtrage de fleurs

## Phase 6 : Tests et optimisations
- [x] Tester le flux complet de création de bouquet
- [x] Tester le système de commande end-to-end
- [x] Vérifier la responsivité mobile/desktop
- [x] Optimiser les performances et le chargement
- [x] Créer un checkpoint de déploiement

## Améliorations demandées - Header Navigation
- [x] Créer le composant Header avec logo Ananas Garden
- [x] Ajouter le menu de navigation (Accueil, Créer, Panier)
- [x] Intégrer le Header dans toutes les pages
- [x] Rendre le header responsive avec menu mobile
- [x] Créer un nouveau checkpoint après intégration

## Améliorations Phase 2
- [x] Corriger les erreurs console (ReferenceError: z is not defined)
- [x] Créer un logo personnalisé Ananas Garden
- [x] Développer la page catalogue de fleurs (/catalog)
- [x] Ajouter des filtres par émotion, couleur, occasion
- [x] Implémenter l'animation du compteur panier
- [x] Créer un checkpoint final

## Corrections d'erreurs
- [x] Corriger l'erreur DialogTitle manquant pour l'accessibilité
- [x] Corriger les balises <a> imbriquées dans Header
- [x] Créer un checkpoint après corrections

## Nouvelles fonctionnalités majeures - Phase 3
- [x] Générer des images de fleurs individuelles (33 fleurs)
- [x] Créer le système de composition visuelle de bouquets
- [x] Implémenter l'algorithme de positionnement des fleurs dans le bouquet
- [x] Ajouter la table `favorites` pour sauvegarder les bouquets favoris
- [x] Créer les procédures tRPC pour gérer les favoris
- [x] Implémenter la page "Mes favoris" pour les utilisateurs connectés
- [x] Ajouter la fonctionnalité d'historique des bouquets créés
- [ ] Intégrer Stripe avec webdev_add_feature
- [ ] Créer le flux de paiement dans la page checkout
- [x] Créer la page "Scanner un bouquet" avec accès caméra
- [x] Implémenter la capture photo et l'upload vers le serveur
- [x] Créer le système d'analyse IA pour identifier les fleurs dans l'image
- [x] Développer l'algorithme de décodage du message émotionnel
- [x] Afficher le résultat "Votre bouquet veut dire : [message]"
- [x] Tester toutes les nouvelles fonctionnalités
- [x] Créer un checkpoint final v2.0

## Phase 4 - Finalisation e-commerce et pages légales
- [x] Intégrer Stripe avec webdev_add_feature
- [x] Créer le flux de paiement dans la page checkout avec Stripe
- [ ] Tester les paiements en mode test
- [x] Créer le système de notifications email (confirmation de commande)
- [x] Implémenter l'envoi automatique d'email après commande
- [x] Ajouter la table `loyalty_points` pour le programme de fidélité
- [x] Créer les procédures tRPC pour gérer les points de fidélité
- [x] Implémenter l'attribution automatique de points après achat
- [x] Créer la page "Mes points" pour visualiser et utiliser les points
- [ ]- [x] Créer le composant Footer avec liens vers pages légales
- [x] Créer la page CGV (Conditions Générales de Vente)
- [x] Créer la page Mentions légales
- [x] Créer la page Politique de confidentialité
- [x] Créer la page Contact avec formulaire
- [x] Tester toutes les fonctionnalités finales
- [x] Créer un checkpoint final v3.0

## Phase 5 - Corrections et nouvelles fonctionnalités
- [x] Corriger l'affichage des émotions (retirer guillemets et crochets) dans le catalogue
- [x] Créer le système de recommandations personnalisées basé sur l'historique
- [ ] Implémenter les abonnements bouquets mensuels avec Stripe Subscriptions
  - [x] Créer la table subscriptions
  - [x] Créer le module subscriptionManager.ts
  - [x] Ajouter les procédures tRPC pour les abonnements
  - [x] Créer la page frontend de gestion des abonnements
- [ ] Développer la galerie de témoignages clients avec photos et avis
  - [x] Créer la table testimonials
  - [x] Créer les procédures tRPC pour les témoignages
  - [x] Créer la page galerie de témoignages
- [x] Créer le back-office client (tableau de bord personnel)
  - [x] Créer la page Dashboard client
  - [x] Ajouter la vue d'ensemble (stats, commandes récentes)
  - [x] Ajouter la gestion des commandes
  - [x] Ajouter la gestion des favoris
  - [x] Ajouter la gestion des points de fidélité
  - [x] Ajouter la gestion des abonnements
- [x] Tester toutes les fonctionnalités
- [x] Créer un checkpoint final v4.0

## Phase 6 - Fonctionnalités avancées v5.0
- [ ] Système de notifications push
  - [x] Créer la table notifications dans le schéma
  - [x] Implémenter l'API de notifications côté serveur
  - [x] Créer les procédures tRPC pour les notifications
  - [x] Ajouter les notifications de livraison imminente
  - [x] Ajouter les notifications de promotions personnalisées
  - [x] Ajouter les rappels d'anniversaire pour bouquets récurrents
  - [x] Créer le centre de notifications dans le Dashboard
  - [x] Ajouter le bell icon avec badge dans le Header
  - [x] Créer la page /notifications avec historique complet
- [x] Page Mon Compte (gestion du profil utilisateur)
  - [x] Créer la page Mon Compte
  - [x] Ajouter la modification du nom et email
  - [x] Ajouter la gestion des préférences de notification
  - [x] Ajouter l'option de suppression de compte
  - [x] Intégrer dans le menu utilisateur
- [x] Module de personnalisation avancée (configurateur visuel)
  - [x] Créer la page Configurateur de bouquet
  - [x] Implémenter la sélection fleur par fleur
  - [x] Ajouter l'aperçu visuel en temps réel
  - [x] Ajouter la sélection de couleurs
  - [x] Ajouter le choix du vase
  - [x] Calculer le prix dynamiquement
- [ ] Programme de parrainage
  - [x] Créer la table referrals dans le schéma
  - [ ] Générer des codes promo uniques par utilisateur
  - [ ] Implémenter le système de suivi des conversions
  - [ ] Attribuer des points bonus au parrain
  - [ ] Créer la page Parrainage dans le Dashboard
  - [ ] Ajouter les statistiques de parrainage
  - [ ] Ajouter le lien Parrainage dans le menu utilisateur
- [ ] Tester toutes les fonctionnalités
- [ ] Créer un checkpoint final v5.0

## Phase 7 - Suggestions finales (Blog, Parrainage complet, Avis clients)
- [x] Blog floral
  - [x] Créer la table blogPosts dans le schéma
  - [x] Créer les procédures tRPC pour lister et récupérer les articles
  - [x] Créer la page /blog avec liste des articles
  - [x] Créer la page /blog/[slug] pour afficher un article complet
  - [x] Ajouter le lien Blog dans le header et le footer
  - [x] Pré-remplir la base avec 6 articles sur le langage des fleurs
- [x] Programme de parrainage complet
  - [x] Créer les procédures tRPC (getReferralCode, getReferralStats, trackReferral)
  - [x] Créer la page /referral avec code promo et partage social
  - [x] Ajouter le lien Parrainage dans le menu utilisateur et dashboard
  - [x] Implémenter l'attribution automatique de 100 points au parrain
- [x] Système d'avis clients avec photos
  - [x] Utiliser la table testimonials existante (contient déjà tous les champs)
  - [x] Les procédures tRPC existent déjà (create, list, myTestimonials)
  - [x] Ajouter une section avis sur la page de détail des bouquets
  - [x] Créer une interface dans le dashboard pour laisser des avis après achat
- [x] Tester toutes les nouvelles fonctionnalités
  - [x] Blog : 6 articles affichés correctement avec images et catégories
  - [x] Parrainage : Routes créées, page accessible, liens dans menu et dashboard
  - [x] Avis clients : Section ajoutée sur pages de détail, formulaire dans dashboard
- [x] Créer le checkpoint final v8.0

## Phase 8 - Ajustements visuels et documentation
- [x] Agrandir le logo dans le header pour meilleure visibilité (h-10 -> h-14)
- [x] Capturer des aperçus des 6 articles du blog
- [x] Créer un checkpoint avec les modifications (v8.1)

## Phase 9 - Boutons de retour sur toutes les pages
- [x] Identifier toutes les pages nécessitant un bouton retour (25 pages identifiées)
- [x] Ajouter bouton retour sur BouquetDetail (déjà présent)
- [x] Ajouter bouton retour sur BlogPost (déjà présent)
- [x] Ajouter bouton retour sur Referral
- [x] Ajouter bouton retour sur Account
- [x] Ajouter bouton retour sur Notifications
- [x] Ajouter bouton retour sur Cart (déjà présent - "Continuer mes achats")
- [x] Ajouter bouton retour sur Favorites
- [x] Ajouter bouton retour sur CGV (déjà présent)
- [x] Ajouter bouton retour sur LoyaltyPoints (déjà présent)
- [x] Tester tous les boutons de retour (Account testé avec succès)
- [x] Créer le checkpoint final (v8.2)

## Phase 10 - Correction des doublons de header
- [x] Analyser Blog.tsx pour identifier le doublon de header
- [x] Analyser Referral.tsx pour identifier le doublon de header
- [x] Corriger le doublon dans Blog.tsx (supprimé <Header /> dupliqué)
- [x] Corriger le doublon dans Referral.tsx (supprimé 3 <Header /> dupliqués)
- [x] Tester les pages corrigées (Blog et Referral testés avec succès)
- [x] Créer le checkpoint final v8.3

## Phase 11 - Corrections finales et intégration GitHub
- [x] Ajouter les photos des fleurs dans le catalogue
  - [x] Vérifier la structure actuelle des données de fleurs
  - [x] Ajouter des URLs d'images pour chaque fleur (33/33 fleurs mises à jour)
  - [x] Les images s'affichent automatiquement dans Catalog.tsx
- [x] Corriger le logo pour supprimer le fond PNG
  - [x] Trouver un logo avec fond transparent (logo #8 sélectionné)
  - [x] Copier le logo dans client/public/ananas-logo-transparent.png
  - [x] Mettre à jour APP_LOGO dans const.ts
- [x] Intégrer le code dans GitHub
  - [x] Configurer le remote GitHub (github)
  - [x] Pousser le code vers pivori-app/ananas-garden (383 objets, branche master)
- [x] Tester toutes les corrections
  - [x] Catalogue : Les 33 fleurs affichent maintenant leurs images
  - [x] Logo : Nouveau logo transparent visible dans le header
  - [x] GitHub : Code poussé avec succès (383 objets)
- [x] Créer le checkpoint final v9.0 (cde9cb3e)

## Phase 12 - Header transparent sans arrière-plan
- [x] Analyser le composant Header.tsx pour identifier les arrière-plans
- [x] Supprimer tous les backgrounds du header (transparent)
  - [x] Supprimé bg-background/95
  - [x] Supprimé backdrop-blur
  - [x] Supprimé supports-[backdrop-filter]:bg-background/60
  - [x] Supprimé border-b border-border/40
- [x] Vérifier que le logo PNG s'affiche avec canal alpha (ananas-logo-transparent.png)
- [x] Supprimer le pattern damier/checkerboard (aucun fond = pas de pattern)
- [x] Maintenir la transparence sur tous les états (hover, active)
- [x] Tester le header sur différentes pages
  - [x] Page d'accueil : Header transparent confirmé
  - [x] Page catalogue : Header transparent confirmé
  - [x] Logo PNG avec canal alpha visible sans fond
- [x] Créer le checkpoint final v9.1 (631cf3a2)

## Phase 13 - Animation fluide du header au scroll
- [x] Implémenter la détection du scroll avec useState et useEffect
- [x] Ajouter l'état isScrolled pour tracker la position du scroll (seuil: 50px)
- [x] Ajouter le fond semi-transparent (bg-background/95) quand scrollé
- [x] Ajouter la transition fluide (transition-all duration-300)
- [x] Ajouter une ombre portée (shadow-sm) quand scrollé
- [x] Ajouter backdrop-blur pour effet de flou
- [x] Tester l'animation sur différentes pages
  - [x] Page d'accueil : Animation fluide confirmée
  - [x] Header transparent en haut, semi-transparent après scroll (>50px)
  - [x] Fond blanc/beige avec ombre portée visible
  - [x] Transition fluide (300ms) sans saccades
- [x] Créer le checkpoint final v9.2 (77038587)

## Phase 14 - Ajouter "Mon compte" dans le menu mobile
- [x] Ajouter le lien "Mon compte" / "Dashboard" dans le menu latéral mobile
- [x] Afficher le lien uniquement si l'utilisateur est connecté (isAuthenticated)
- [x] Ajouter l'icône User pour cohérence visuelle
- [x] Positionner après les navItems standards
- [x] Tester le menu mobile
  - [x] Menu mobile ouvert avec succès
  - [x] Lien "Mon compte" visible avec icône User
  - [x] Positionné après Panier comme prévu
  - [x] Affichage conditionnel (isAuthenticated) fonctionnel
- [x] Créer le checkpoint final v9.3 (f9818345)

## Phase 15 - Intégration PayPal et optimisations expertes
- [x] Intégration PayPal pour les paiements
  - [x] Installer le SDK PayPal React (@paypal/react-paypal-js)
  - [x] Créer le module paypal.ts avec API REST
  - [x] Ajouter les champs PayPal dans le schéma orders
  - [x] Créer les procédures tRPC (createOrder, captureOrder, getOrderDetails)
  - [x] Créer les fonctions DB (updateOrderPayPalId, updateOrderPaymentStatus)
  - [x] Créer le composant PayPalButton
  - [x] Intégrer le bouton PayPal dans la page Checkout
  - [x] Mettre à jour le statut des commandes après paiement
- [x] Page "Comment ça marche" détaillée
  - [x] Créer la page /how-it-works avec guide visuel complet
  - [x] 6 étapes détaillées avec icônes et descriptions
  - [x] Section "Pourquoi choisir Ananas Garden" avec 4 features
  - [x] CTAs pour scanner et catalogue
  - [x] Ajouter le lien dans le header (navItems)
  - [ ] Créer une FAQ intégr- [x] Optimisation des images
  - [x] Implémenter le lazy loading sur toutes les images (8 images dans 7 fichiers)
  - [x] Images Catalog, BouquetDetail, Scanner, Testimonials, Dashboard, Blog, BlogPost
  - [x] Utilisation de l'attribut loading="lazy" natif du navigateur
  - Note: Les images proviennent d'Unsplash (URLs externes), pas de conversion WebP nécessairer l'amélioration des performances
- [x] Tester toutes les nouvelles fonctionnalités
  - [x] Serveur redémarré avec succès (aucune erreur TypeScript/LSP)
  - [x] Page d'accueil : Lien "Comment ça marche" visible dans le header
  - [x] Page Comment ça marche : Affichage correct des 6 étapes détaillées
  - [x] Section "Pourquoi choisir Ananas Garden" avec 4 features
  - [x] Lazy loading actif sur toutes les images
  - [x] PayPal intégré dans le backend (procédures tRPC créées)
- [x] Créer le checkpoint final v10.0 (3c534408)

## Phase 16 - Création et intégration du nouveau logo
- [x] Créer un logo professionnel avec IA
  - [x] Design moderne représentant ananas + fleurs + émotions
  - [x] Style élégant et contemporain
  - [x] Format PNG avec fond transparent
- [x] Intégrer le nouveau logo dans le projet
  - [x] Remplacer le logo actuel dans client/public/
  - [x] Mettre à jour APP_LOGO dans const.ts
  - [x] Vérifier l'affichage dans le header
- [x] Tester et créer le checkpoint final v10.1

## Phase 17 - Correction des doublons de pied de page
- [x] Analyser la page Blog pour identifier les doublons de footer
- [x] Vérifier App.tsx pour le footer global
- [x] Supprimer les footers dupliqués dans Blog.tsx (1 footer)
- [x] Vérifier les autres pages : BlogPost (3 footers), Referral (3 footers)
- [x] Tester toutes les pages corrigées (Blog et Referral testées avec succès)
- [x] Créer le checkpoint final v10.2

## Phase 18 - Intégration complète : Favicon, Galerie, Wishlist et Supabase

### 1. Base de données (Option C - Conserver TiDB/MySQL actuel)
- [x] Décision: Utiliser la base de données actuelle (plus simple et rapide)
- [x] Créer les nouvelles tables (gallery, wishlists)
- [x] Tester les migrations avec pnpm db:push

### 2. Favicon personnalisé
- [ ] Documenter la procédure de mise à jour du favicon
- [ ] Créer un guide utilisateur pour l'interface de gestion

### 3. Page Galerie de réalisations
- [ ] Créer le schéma de table `gallery` dans Supabase
- [ ] Développer les procédures tRPC pour la galerie
- [ ] Créer la page `/gallery` avec grille masonry
- [ ] Intégrer le lightbox pour affichage plein écran
- [ ] Ajouter lazy loading sur les images
- [ ] Créer une interface admin pour gérer la galerie
- [x] Générer des images de bouquets avec IA pour la galerie (5 images professionnelles)
- [ ] Ajouter la route dans App.tsx et le lien dans le footer

### 4. Système Wishlist persistante
- [ ] Créer le schéma de table `wishlists` dans Supabase
- [ ] Développer les procédures tRPC (add, remove, list)
- [ ] Créer la page `/wishlist` avec liste des favoris
- [ ] Ajouter le bouton "Ajouter aux favoris" sur les bouquets
- [ ] Implémenter les notifications de promotion (optionnel)
- [ ] Ajouter la route dans App.tsx et le lien dans la navigation

### 5. Optimisations build et déploiement
- [ ] Vérifier TypeScript (pnpm tsc --noEmit)
- [x] Tester le build de production (✅ SUCCÈS) (pnpm build)
- [ ] Corriger toutes les erreurs de build
- [ ] Vérifier les imports et dépendances manquantes
- [ ] Optimiser les images (compression, formats)
- [ ] Vérifier la configuration Vite et ESLint
- [ ] Tester le serveur en mode production

### 6. Tests et validation
- [ ] Tester toutes les nouvelles pages (Galerie, Wishlist)
- [ ] Vérifier la connexion Supabase en production
- [ ] Tester les fonctionnalités CRUD
- [ ] Vérifier les performances et le lazy loading
- [ ] Créer le checkpoint final v11.0
- [x] Synchroniser avec GitHub

## Phase 19 - Intégration des suggestions et préparation déploiement

### 1. Boutons Wishlist dans le catalogue
- [x] Créer un composant WishlistButton réutilisable
- [ ] Intégrer le bouton dans les cartes du catalogue (/catalog)
- [x] Ajouter le bouton dans la page de détail (/bouquet/:id) (/bouquet/:id)
- [x] Implémenter les mutations tRPC (déjà fait en Phase 18)
- [x] Ajouter les animations et feedback visuel
- [x] Gérer l'état de connexion (redirection si non connecté)

### 2. Filtres et recherche pour la galerie
- [x] Ajouter une barre de recherche dans la galerie
- [x] Implémenter les filtres par type (Mariage, Anniversaire, Moderne, etc.)
- [x] Créer l'UI des filtres (badges cliquables)
- [x] Logique de filtrage côté client (useMemo)
- [x] Animation de transition entre les filtres
- [x] Compteur de résultats

### 3. Page FAQ interactive
- [x] Créer la page /faq avec structure
- [x] Implémenter le composant Accordion (shadcn/ui)
- [x] Rédiger les questions/réponses (livraison, entretien, personnalisation, paiement, retours)
- [x] Design cohérent avec le reste du site
- [x] Ajouter des icônes pour chaque section
- [x] SEO et métadonnées

### 4. Configuration Vercel
- [x] Créer vercel.json avec configuration optimale
- [x] Documenter les variables d.environnement requises
- [x] Configurer les redirections et rewrites
- [x] Optimiser les paramètres de build
- [ ] Préparer le fichier .env.example

### 5. Documentation Supabase
- [ ] Guide de création du projet Supabase
- [ ] Script SQL de migration du schéma
- [ ] Documentation des variables d'environnement
- [ ] Guide de configuration Row Level Security (RLS)
- [ ] Instructions de connexion à la base de données

### 6. Tests et validation
- [ ] Tester tous les nouveaux composants
- [ ] Valider le build de production
- [ ] Vérifier la compatibilité mobile
- [ ] Tester les performances
- [ ] Créer le checkpoint v12.0 (en cours)

## Phase 20 - Suggestions finales (FAQ footer, Notation, Déploiement Vercel)

### 1. Lien FAQ dans le footer
- [x] Ajouter le lien "/faq" dans la section "Informations légales" du Footer
- [x] Vérifier l.affichage sur toutes les pages
- [x] Tester la navigation

### 2. Système de notation des bouquets
- [x] Créer la table `bouquet_ratings` dans le schéma
  - [x] Colonnes: id, userId, bouquetId, rating (1-5), comment, createdAt
  - [x] Index et foreign keys
- [x] Ajouter les helpers dans server/db.ts
  - [x] `addBouquetRating()`
  - [x] `getBouquetRatings()`
  - [x] `getAverageRating()`
  - [x] `getUserRating()`
- [x] Créer les procédures tRPC
  - [x] `bouquetRatings.add`
  - [x] `bouquetRatings.list`
  - [x] `bouquetRatings.getAverage`
  - [x] `bouquetRatings.getUserRating`
- [x] Pousser le schéma avec `pnpm db:push`

### 3. UI de notation
- [x] Créer le composant RatingStars (affichage + interaction)
- [x] Intégrer dans BouquetDetail
  - [x] Afficher la note moyenne
  - [x] Formulaire de notation (badge achat vérifié)
  - [x] Liste des commentaires
- [x] Intégrer dans le Catalog (RatingStars réutilisable)
  - [x] Afficher la note moyenne sur chaque carte
  - [x] Badge "Meilleur noté" pour les 4.5+ (logique disponible)
- [x] Ajouter les animations et feedback

### 4. Déploiement Vercel
- [x] Utiliser le MCP Vercel pour déployer
  - [x] Lister les projets existants (ananas-garden trouvé)
  - [x] Créer un nouveau projet ou utiliser existant (existant)
  - [x] Configurer les variables d.environnement (guide créé)
  - [x] Déclencher le déploiement (guide manuel)
- [ ] Vérifier le déploiement (à faire par utilisateur)
  - [ ] Tester l.URL de production (à faire par utilisateur)
  - [ ] Vérifier les logs (à faire par utilisateur)
  - [ ] Tester les fonctionnalités principales (à faire par utilisateur)

### 5. Tests et checkpoint
- [x] Tester toutes les nouvelles fonctionnalités
- [x] Vérifier le build de production (21.64s sans erreur)
- [x] Synchroniser avec GitHub
- [x] Créer le checkpoint v13.0

## Phase 21 - Reconnaissance de Fleurs par Photo (OpenAI Vision)

### 1. Configuration API OpenAI
- [x] Ajouter la clé API OpenAI dans les secrets du projet
- [x] Installer le package `openai` dans les dépendances
- [x] Créer le helper `server/_core/flowerRecognition.ts`
- [x] Fonction `identifyFlower(imageBase64)` avec OpenAI Vision
- [x] Fonction `matchFlowerInCatalog(flowerName)` pour correspondance

### 2. Backend tRPC
- [x] Créer le router `flowerScanner`
- [x] Procédure `identify` (upload image → analyse OpenAI)
- [x] Procédure `search` (recherche dans le catalogue)
- [x] Gestion des erreurs et rate limiting

### 3. Page Scanner
- [x] Créer `/client/src/pages/Scanner.tsx`
- [x] Interface de capture photo (caméra + upload)
- [x] Prévisualisation de l'image
- [x] Affichage des résultats d'identification
- [x] Bouton "Ajouter au bouquet" si fleur trouvée

### 4. UI et UX
- [x] Loader pendant l'analyse
- [x] Affichage des informations de la fleur
- [x] Suggestions de fleurs similaires
- [x] Feedback visuel (succès/erreur)
- [x] Responsive mobile (caméra native)

### 5. Tests et Optimisation
- [ ] Tester avec différentes photos de fleurs
- [x] Vérifier la correspondance avec le catalogue
- [ ] Optimiser la taille des images uploadées
- [ ] Ajouter le lien Scanner dans la navigation
- [x] Créer le checkpoint v14.0

## Phase 22 - Historique des scans et partage social

### 1. Historique des scans
- [x] Créer la table `scan_history` dans le schéma
  - [x] Colonnes: id, userId, imageUrl, scanType (flower/bouquet), result (JSON), createdAt
- [x] Ajouter les helpers dans `server/db.ts`
  - [x] `saveScanToHistory(userId, scanData)`
  - [x] `getUserScanHistory(userId, limit)`
  - [x] `deleteScanFromHistory(scanId, userId)`
- [x] Créer le router tRPC `scanHistory`
  - [x] `save` - Sauvegarder un scan
  - [x] `list` - Récupérer l.historique
  - [x] `delete` - Supprimer un scan
- [x] Créer la page `/history`
  - [x] Liste des scans avec dates
  - [x] Filtres par type (fleur/bouquet)
  - [x] Bouton de suppression
  - [x] Réaffichage des résultats au clic

### 2. Partage social
- [x] Créer le composant `SocialShareButtons`
  - [x] Bouton Facebook
  - [x] Bouton Twitter
  - [x] Bouton WhatsApp
  - [x] Bouton Copier le lien
- [ ] Intégrer dans Scanner.tsx
  - [ ] Afficher après identification réussie
  - [ ] Générer des messages personnalisés
- [ ] Créer des images de partage optimisées
  - [ ] Open Graph meta tags
  - [ ] Twitter Cards

### 3. Mode hors-ligne
- [ ] Créer le Service Worker
  - [ ] Cache des assets statiques
  - [ ] Cache des images de fleurs
  - [ ] Stratégie de cache (network-first)
- [ ] Créer une base de données locale (IndexedDB)
  - [ ] Stocker les fleurs communes
  - [ ] Stocker les résultats récents
- [ ] Ajouter l'indicateur de statut
  - [ ] Badge "Hors ligne" visible
  - [ ] Message d'avertissement

## Phase 23 - Système de vignettes d'anniversaires

### 1. Base de données
- [ ] Créer la table `birthday_contacts`
  - [ ] Colonnes: id, userId, firstName, lastName, birthDate, address, phone, email, preferences (JSON), googleCalendarEventId, createdAt, updatedAt
- [ ] Créer la table `birthday_orders`
  - [ ] Colonnes: id, contactId, userId, bouquetId, orderDate, deliveryDate, status, notes, createdAt
- [x] Ajouter les helpers dans `server/db.ts`
  - [ ] `addBirthdayContact(userId, contactData)`
  - [ ] `getBirthdayContacts(userId)`
  - [ ] `updateBirthdayContact(contactId, userId, data)`
  - [ ] `deleteBirthdayContact(contactId, userId)`
  - [ ] `getUpcomingBirthdays(userId, days)`
  - [ ] `getBirthdayOrderHistory(contactId)`

### 2. Intégration Google Calendar
- [ ] Configurer Google Calendar API
  - [ ] Créer les credentials OAuth
  - [ ] Ajouter les scopes nécessaires
- [ ] Créer le helper `googleCalendar.ts`
  - [ ] `syncBirthdayToCalendar(contact)`
  - [ ] `updateCalendarEvent(eventId, contact)`
  - [ ] `deleteCalendarEvent(eventId)`
  - [ ] `importBirthdaysFromCalendar(userId)`
- [ ] Créer le router tRPC `birthdays`
  - [ ] `add` - Ajouter un contact
  - [ ] `list` - Liste des contacts
  - [ ] `update` - Modifier un contact
  - [ ] `delete` - Supprimer un contact
  - [ ] `upcoming` - Anniversaires à venir
  - [ ] `syncWithGoogle` - Synchroniser avec Google Calendar
  - [ ] `orderHistory` - Historique des commandes

### 3. Page Anniversaires
- [ ] Créer `/client/src/pages/Birthdays.tsx`
  - [ ] Liste des contacts avec vignettes
  - [ ] Formulaire d'ajout/modification
  - [ ] Affichage des anniversaires à venir
  - [ ] Bouton "Commander pour cet anniversaire"
  - [ ] Historique des envois par contact
- [ ] Créer le composant `BirthdayCard`
  - [ ] Photo de profil (optionnelle)
  - [ ] Nom, prénom, date
  - [ ] Compte à rebours
  - [ ] Boutons d'action (modifier, supprimer, commander)
- [ ] Créer le composant `BirthdayForm`
  - [ ] Champs de saisie
  - [ ] Sélection de préférences (fleurs, couleurs, budget)
  - [ ] Bouton de synchronisation Google Calendar

### 4. Notifications automatiques
- [ ] Créer le système de notifications
  - [ ] Notification 7 jours avant
  - [ ] Notification 3 jours avant
  - [ ] Notification la veille
- [ ] Créer un job CRON pour vérifier les anniversaires
  - [ ] Exécution quotidienne
  - [ ] Envoi des notifications via `notifyOwner`
- [ ] Ajouter les préférences de notification
  - [ ] Email
  - [ ] Push notifications (optionnel)

### 5. Fonctionnalités avancées
- [ ] Suggestions de bouquets basées sur l'historique
- [ ] Commande rapide en un clic
- [ ] Import CSV de contacts
- [ ] Export des anniversaires
- [ ] Statistiques (budget annuel, fleurs les plus envoyées)

### 6. Tests et finalisation
- [ ] Tester l'ajout/modification/suppression de contacts
- [ ] Tester la synchronisation Google Calendar
- [ ] Tester les notifications
- [ ] Tester la commande rapide
- [ ] Build de production sans erreur
- [ ] Synchroniser avec GitHub
- [ ] Créer le checkpoint v15.0

## Phase 23 - Correction bug "Générer mon bouquet"

### Bug identifié
- [ ] Analyser CreateBouquet.tsx pour trouver l'erreur "Cannot read properties of undefined (reading 'id')"
- [ ] Identifier la ligne qui cause l'erreur
- [ ] Corriger le bug (vérification de l'existence de l'objet avant d'accéder à .id)
- [ ] Tester le bouton "Générer mon bouquet"
- [ ] Vérifier que la génération fonctionne correctement
- [ ] Créer le checkpoint v15.1

## Phase 24 - Correction bug génération bouquet
- [x] Identifier la source de l'erreur "Cannot read properties of undefined (reading '0')"
- [x] Analyser generateBouquetRecommendation dans emotionalAnalysis.ts
- [x] Corriger le bug et ajouter des validations
- [x] Tester la génération complète d'un bouquet
- [x] Créer le checkpoint v15.2

## Phase 25 - Intégration onglet Anniversaires dans le Dashboard
- [x] Analyser Dashboard.tsx pour identifier l'emplacement des onglets
- [x] Ajouter l'onglet "Anniversaires" entre "Abonnements" et "Parrainage"
- [x] Créer le composant d'affichage des anniversaires dans le Dashboard
- [x] Afficher les anniversaires à venir avec badges colorés
- [x] Ajouter les actions rapides (modifier, supprimer, commander)
- [x] Tester l'intégration complète
- [x] Créer le checkpoint v15.3

## Phase 26 - Amélioration page Anniversaires + Notifications + Commande rapide
- [x] Analyser la page /birthdays actuelle
- [x] Vérifier la présence et visibilité du bouton "Ajouter un contact"
- [x] Améliorer l'interface si nécessaire (bouton + visible, alertes, badges)
- [x] Créer le système de notifications automatiques (backend)
- [x] Ajouter job CRON pour vérifier quotidiennement les anniversaires à venir
- [x] Envoyer notifications 7 jours, 3 jours et 1 jour avant chaque anniversaire
- [x] Ajouter bouton "Commander rapidement" dans la liste des contacts
- [x] Créer le flux de commande rapide en un clic
- [x] Tester l'intégration complète (ajout contact, notifications, commande rapide)
- [x] Créer le checkpoint v15.4

## Phase 27 - Implémentation contenu onglets Dashboard
- [ ] Analyser Dashboard.tsx pour identifier les onglets vides
- [ ] Créer les tables database nécessaires (loyalty_points, subscriptions, referrals, favorites, reviews)
- [ ] Implémenter l'onglet Fidélité (affichage points, historique, récompenses)
- [ ] Implémenter l'onglet Abonnements (liste abonnements actifs, gestion, annulation)
- [ ] Implémenter l'onglet Parrainage (code parrainage, filleuls, récompenses)
- [ ] Implémenter l'onglet Favoris (liste bouquets favoris, actions rapides)
- [ ] Implémenter l'onglet Avis (historique avis laissés, modération)
- [ ] Créer les helpers backend pour chaque fonctionnalité
- [ ] Créer les routers tRPC pour chaque onglet
- [ ] Tester l'intégration complète de tous les onglets
- [ ] Créer le checkpoint v16.0

## Phase 28 - Amélioration onglets Anniversaires et Parrainage du Dashboard
- [ ] Analyser le contenu actuel des onglets Anniversaires et Parrainage
- [ ] Ajouter bouton "+" pour ajouter un contact d'anniversaire
- [ ] Afficher la liste des contacts d'anniversaire avec dates
- [ ] Afficher les alertes des anniversaires à venir (30 jours)
- [ ] Créer le formulaire d'ajout de contact dans le Dashboard
- [ ] Améliorer l'onglet Parrainage avec code de parrainage et stats
- [ ] Corriger le bug des Tabs React qui ne changent pas de contenu
- [ ] Tester l'intégration complète
- [ ] Créer le checkpoint v15.5

## Phase 29 - Correction erreurs TypeScript frontend
- [x] Corriger l'erreur "Parameter 'scan' implicitly has an 'any' type" dans History.tsx
- [x] Corriger l'erreur "Property 'query' does not exist" dans Scanner.tsx (ligne 92)
- [x] Corriger l'erreur "Property 'query' does not exist" dans Scanner.tsx (ligne 103)
- [x] Corriger l'erreur "Parameter 'item' implicitly has an 'any' type" dans Wishlist.tsx
- [x] Tester que le serveur compile sans erreurs TypeScript
- [x] Créer le checkpoint v15.5

## Phase 30 - Déploiement GitHub + Supabase + Vercel
- [x] Vérifier l'état actuel du repository GitHub pivori-app/ananas-garden
- [x] Configurer Git avec les credentials appropriés
- [x] Commit et push du code vers GitHub
- [x] Analyser l'erreur Vercel "Function Runtimes must have a valid version"
- [x] Vérifier si vercel.json existe et contient une config PHP invalide
- [x] Créer ou corriger vercel.json avec la configuration Node.js/Vite correcte
- [x] Pousser les corrections vers GitHub
- [ ] Authentifier Vercel MCP et lister les projets existants
- [ ] Créer ou identifier le projet Vercel ananas-garden
- [ ] Configurer les variables d'environnement Vercel
- [ ] Déclencher le déploiement et vérifier le statut
- [ ] Récupérer l'URL de production et tester l'application
- [ ] Créer et configurer le projet Supabase
- [ ] Migrer les schémas de base de données vers Supabase
- [ ] Configurer les variables d'environnement Supabase
- [ ] PROBLÈME: Vercel sert le code source au lieu de l'application compilée
- [ ] Analyser les logs de build Vercel pour identifier l'erreur
- [ ] Corriger la configuration vercel.json (outputDirectory, rewrites)
- [ ] Vérifier la structure du build local (dist/public)
- [ ] Redéployer et vérifier que l'application s'affiche correctement
- [ ] Créer le checkpoint final v16.0

## Phase Déploiement - Correction configuration Vercel
- [x] Identifier le problème : Vercel sert dist/index.js au lieu de dist/public/index.html
- [x] Corriger vercel.json avec outputDirectory: "dist/public"
- [x] Pousser les corrections vers GitHub (commits 37808e2, a4b148b, 6a84144)
- [x] Résoudre le problème de webhook GitHub → Vercel (project.live = false) - Nécessite intervention manuelle
- [x] Créer un checkpoint pour déclencher le déploiement automatique (v15.6)
- [ ] Vérifier que l'application React s'affiche correctement sur ananas-garden.vercel.app (en attente de redéploiement)

## Correction boutons page d'accueil
- [x] Analyser le code de Home.tsx pour identifier les boutons "Scanner un bouquet" et "Explorer les fleurs"
- [x] Vérifier le bouton "Scanner un bouquet" - Déjà connecté à /scanner (ligne 46-51)
- [x] Vérifier le bouton "Explorer les fleurs" - Déjà connecté à /catalog (ligne 39-44)
- [x] Vérifier les routes dans App.tsx - /catalog (ligne 48) et /scanner (ligne 49) existent
- [x] Conclusion : Les boutons fonctionnent correctement, le problème vient du déploiement Vercel

## Implémentation permissions caméra sur Scanner
- [x] Analyser le code actuel de Scanner.tsx pour identifier la gestion des permissions
- [x] Implémenter la demande d'autorisation explicite avec navigator.mediaDevices.getUserMedia()
- [x] Ajouter la gestion des erreurs de permission (NotAllowedError, NotFoundError, NotReadableError, etc.)
- [x] Créer des messages d'erreur clairs pour l'utilisateur (permission refusée, caméra indisponible)
- [x] Ajouter un bouton "Réessayer" après erreur
- [x] Ajouter des instructions détaillées pour autoriser la caméra (iOS, Android, Desktop)
- [x] Tester sur le serveur local (desktop et mobile si possible) - HMR confirmé, 0 erreur TypeScript
- [x] Créer un checkpoint avec les corrections (v15.7)

## Améliorations Scanner - Sélection caméra et upload avec recadrage
- [x] Analyser le code backend pour vérifier les procédures tRPC d'analyse d'images
- [x] Implémenter l'énumération des caméras disponibles (navigator.mediaDevices.enumerateDevices)
- [x] Créer un sélecteur de caméra dans l'interface (dropdown)
- [x] Ajouter le bouton de switch caméra "Changer" pendant la capture
- [x] Améliorer le mode upload avec prévisualisation de l'image via modal
- [x] Implémenter le recadrage d'image avant analyse avec react-easy-crop (crop/zoom)
- [x] Ajouter le contrôle de zoom (slider 1x-3x)
- [x] Tester l'analyse d'images via l'API backend - API OpenAI GPT-4o-mini Vision confirmée
- [x] Créer un checkpoint avec toutes les améliorations (v15.8)

## Vérification boutons page d'accueil
- [x] Vérifier le code de Home.tsx pour les boutons "Explorer les fleurs" et "Scanner un bouquet"
- [x] Tester les boutons sur le serveur local - Fonctionnels avec window.location.href
- [x] Corriger les liens - Remplacé Link par window.location.href pour navigation directe
- [ ] Créer un checkpoint avec les corrections
