# Jeu d'essai CDA — artefacts produits

Environnement : stack Docker de développement (copie du dépôt d'équipe),
PostgreSQL 16 seedé (41 utilisateurs), point d'entrée http://localhost:8888.
Scénario exécuté le 2026-08-23. Acteurs : Alice Dupont (id 1) et Bob Martin (id 27),
mot de passe du seed `password123`. Conversation créée : « Jeu d'essai CDA » (id 17).

Captures produites avec Playwright (deux contextes navigateur simultanés).
Playwright ne fait PAS partie du livrable d'équipe : il n'a servi qu'à produire
ces illustrations, et ne doit pas être présenté comme une couverture de test.

| Fichier | Étape |
|---|---|
| etape-1-follow.png | 1 — Alice sur le profil de Bob, lien de suivi actif |
| etape-2a-dialog-creation.png | 2 — dialogue de création, Bob sélectionné |
| etape-2b-conversation-creee.png | 2 — conversation créée, fil vide |
| etape-3a-bob-avant-reception.png | 3 — Bob avant réception |
| etape-3b-alice-avant-envoi.png | 3 — Alice, message saisi |
| etape-3c-alice-optimistic.png | 3 — Alice, message affiché immédiatement |
| etape-4a-bob-notification.png | 4 — Bob reçoit le toast « Alice a démarré un nouvel échange » |
| etape-4b-bob-apres-reception.png | 4 — Bob après stabilisation |
| etape-5-alice-reconciliation.png | 5 — Alice après retour serveur, sans doublon |
| sql-00-etat-initial.txt | Requêtes R1, R1bis, T0 (avant scénario) |
| sql-01-verifications.txt | Requêtes R2 à R6 (après scénario) |
