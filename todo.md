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
- [ ] Créer un checkpoint final v3.0
