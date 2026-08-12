// =============================================================================
// Section 12 — Difficultés rencontrées (ajout O'clock, hors REAC strict)
// Volume cible : 1-2 pages
// Sous-sections : techniques, méthodologiques, humaines
// =============================================================================

= Difficultés rencontrées et solutions <sec-difficultes>

== Difficultés techniques

=== Authentification socket par cookie httpOnly
// TODO : décrire le problème — Socket.IO ne lit pas nativement les cookies
// httpOnly côté serveur. Solution : parser le header Cookie manuellement
// (lib `cookie`) dans le middleware io.use(), vérifier le JWT, attacher
// userId à socket.data. Réf code : socket.ts:88-122.

=== Optimistic UI sans dupliquer les messages
// TODO : décrire — l'envoi d'un message optimistic affiche le message côté
// expéditeur immédiatement (id temporaire), puis l'event `message:new` arrive
// avec l'id réel. Risque de doublon. Solution : remplacer l'optimistic par
// le message persisté dans `addMessage` (clé sur id temporaire/réel).

=== Synchronisation Meilisearch ↔ Postgres
// TODO : décrire — chaque modification de profil/skills doit ré-indexer
// l'utilisateur dans Meilisearch. Solution : appeler `indexMember(userId)`
// depuis les services qui modifient User/Skills/Rating + script de
// ré-indexation complète (`scripts/reindex-search.ts`).

== Difficultés méthodologiques

=== Découpage des US en tâches techniques
// TODO : difficulté à estimer initialement, surévaluation des US "simples".
// Solution adoptée : refining systématique en début de sprint, découpage en
// sous-tâches GitHub Issues, planning poker pour les estimations.

=== Synchronisation front/back
// TODO : décrire — interface API DTO non figée au début, modifications
// fréquentes côté back qui cassent le front. Solution adoptée : contract-first
// avec DTO partagés (lib/api-types.ts côté front), code review front + back
// croisée sur les routes nouvelles.

== Difficultés humaines

=== Niveaux hétérogènes au sein de l'équipe
// TODO : décrire la répartition de la charge en fonction des aptitudes
// de chacun, mentoring sur les sujets sensibles, pair-programming.

=== Distance (équipe 100% remote)
// TODO : Discord vocal permanent compense partiellement. Rituels Scrum bien
// suivis. Difficulté = lecture du non-verbal, fatigue Discord.

