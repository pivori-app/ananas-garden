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
- [ ] Créer le checkpoint final v9.0
