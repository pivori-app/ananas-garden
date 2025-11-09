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
- [ ] Créer un checkpoint de déploiement
