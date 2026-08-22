// =============================================================================
// Section 11 — Veille de sécurité (REAC §11)
// Volume cible : 1-2 pages
//
// PÉRIMÈTRE STRICT : période de formation uniquement (Apothéose, 6-29 janvier
// 2026). NE JAMAIS mentionner ici une veille conduite après le projet, ni un
// résultat d'audit de dépendances postérieur, ni un GHSA/CVE relevé depuis.
// La section 5 est PROSPECTIVE (ce qui serait mis en place) : c'est une
// proposition, pas une revendication d'action passée.
//
// FAITS VÉRIFIÉS (inventaire S14, dépôt d'équipe HEAD de73323) :
//   Outillage de veille pendant le projet ... NÉANT. 0 commit CVE/vulnerab/
//     audit/bump/advisory/GHSA. Aucun dependabot.yml, renovate.json, .snyk ni
//     rapport d'audit dans TOUT l'historique, toutes branches.
//   Mises à jour de dépendances pour raison de sécurité ... AUCUNE. Les 34
//     commits touchant package.json sur la période sont des ajouts fonctionnels.
//   Incident .env.docker : b8fa8d8 12/01 ajout (JWT_SECRET vide) → a00c001
//     13/01 secret rempli en clair → 6bd3e25 14/01 17:02 retrait du suivi +
//     .gitignore (l.14 aujourd'hui). Pas de réécriture d'historique, pas de
//     trace de rotation.
//   Doc de sécurité d'époque (arc42 08-crosscutting/security.md, branche
//     Documentation, 22/01) écrit « bcrypt (10 rounds) » alors que le code
//     utilise argon2 → écart réel, réconcilié après coup dans le fork.
//
// LES ANCIENS TODO DE CE FICHIER AFFIRMAIENT DES FAITS NON SOURÇABLES —
// « npm audit hebdomadaire pendant le développement », « Dependabot »,
// newsletters et podcasts suivis : aucune trace. Supprimés, ne pas réintroduire.
// =============================================================================

= Veille de sécurité <sec-veille>

== Périmètre et constat

Aucune veille de sécurité formalisée n'a été conduite pendant le projet : ni
journal dédié, ni source suivie, ni périodicité définie, ni outil automatisé de
suivi des vulnérabilités — le dépôt ne contient aucun fichier
#raw("dependabot.yml", lang: "txt"), aucune configuration Renovate, aucun
rapport d'audit de dépendances. La sécurité a été traitée par des choix
d'implémentation et par une réaction ponctuelle à un incident, décrits
ci-dessous. C'est une lacune identifiée, dont la remédiation est proposée en fin
de section.

== Une vulnérabilité identifiée et traitée pendant le projet

Le fichier d'environnement #raw("devops/.env.docker", lang: "txt") est ajouté au
suivi Git le 12 janvier, puis complété d'un #raw("JWT_SECRET", lang: "txt") en
clair le 13. Je l'ai retiré du suivi le 14 janvier (commit
#raw("6bd3e25", lang: "txt"), « fix(security): remove .env.docker from git
tracking »), et le #raw(".gitignore", lang: "txt") couvre désormais ce chemin,
ce qui prévient la récidive.

*Analyse de la mesure.* Retirer un fichier du suivi empêche les commits
ultérieurs de le réintroduire, mais ne supprime pas la valeur de l'historique
déjà écrit. Une remédiation complète aurait supposé une rotation du secret côté
serveur, et le cas échéant une réécriture d'historique. Cette limite est
assumée.

== Mesures de sécurité retenues pendant le projet

- *argon2* pour le hachage des mots de passe (#raw("auth.service.ts:21", lang: "ts")) — fonction
  à coût mémoire, résistante aux attaques par matériel dédié.
- *JWT en cookies #raw("httpOnly", lang: "ts") + #raw("secure", lang: "ts") + #raw("sameSite=strict", lang: "ts")* —
  le jeton n'est pas accessible au JavaScript client, ce qui neutralise son vol
  par XSS. L'ADR-007 rejette explicitement #raw("localStorage", lang: "ts") pour
  ce motif.
- *Rotation du refresh token* à chaque renouvellement, avec invalidation du
  précédent (#raw("auth.service.ts:103-108", lang: "ts")).
- *Origine CORS unique*, fournie par variable d'environnement, appliquée à
  Express et au handshake Socket.IO ; en production, le serveur refuse de
  démarrer si elle est absente.
- *Validation systématique des entrées* par schémas Zod, et requêtes
  paramétrées via l'ORM contre l'injection SQL.

Ces choix n'ont pas fait l'objet d'une justification écrite pendant le projet —
la documentation de sécurité d'époque mentionnait même bcrypt alors que le code
utilise argon2. L'écart a été relevé et corrigé lors de la reprise documentaire
pour ce dossier.

== Analyse OWASP conduite sur l'application

La couverture du référentiel OWASP Top 10 est présentée en
#ref(<sec-securite>, supplement: [section]). Quatre dettes y sont identifiées et
assumées : Helmet installé mais non monté, absence de Content-Security-Policy,
absence de limitation de débit, accessibilité non mesurée.

== Ce que je mettrais en place

*Outillage automatisé.* Activer Dependabot ou Renovate sur le dépôt, avec
regroupement des mises à jour mineures et de correctifs en une seule Pull
Request périodique — pour éviter le bruit qui fait qu'on finit par ne plus les
lire — et alerte immédiate, isolée, sur les avis critiques. La valeur de
l'outil tient à ce réglage : mal configuré, il produit un flux que l'équipe
apprend à ignorer.

*Contrôle en intégration continue.* Exécuter #raw("npm audit", lang: "txt") à
chaque passage de pipeline, bloquant au-delà d'un seuil de sévérité défini — par
exemple #emph[high] sur les dépendances directes — avec une dérogation
explicite et tracée pour les cas jugés non exploitables. La dérogation doit être
écrite quelque part : un seuil qu'on contourne silencieusement ne protège plus.

*Distinguer la vulnérabilité déclarée du risque réel.* Une dépendance vulnérable
n'est dangereuse que si le code appelle effectivement le chemin concerné. La
démarche consiste à vérifier trois choses : si le paquet est une dépendance
directe ou transitive ; s'il est chargé en production ou seulement en
développement et en test ; et si la condition d'exploitation décrite par l'avis
est réunie dans le contexte de l'application. Un paquet importé uniquement par
un fichier de test n'expose pas le service ; à l'inverse, une bibliothèque
traversée par chaque requête entrante mérite un traitement immédiat.

*Sources suivies.* Les bulletins de sécurité des projets critiques du socle —
Next.js, Express, Prisma, Socket.IO —, la base GitHub Advisory, les avis de
l'ANSSI et du CERT-FR, et les recherches en anglais sur les termes de
vulnérabilité (#raw("CVE", lang: "txt"), #raw("security advisory", lang: "txt"),
#raw("GHSA", lang: "txt")) associés aux paquets utilisés.

*Périodicité.* Revue hebdomadaire des alertes automatiques, revue mensuelle des
versions majeures du socle. La revue mensuelle sert à décider des montées de
version qui ne sont pas déclenchées par un avis mais par le risque de retard
accumulé.

*Traitement des dettes déjà identifiées.* Monter Helmet côté Express, définir
une Content-Security-Policy en mode observation avant enforcement, et ajouter
une limitation de débit sur les routes d'authentification.
