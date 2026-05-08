# BACKLOG — Items à intégrer dans le Dossier de Projet CDA

> Items issus des audits, arbitrages et discussions successives — à intégrer
> au fur et à mesure de la rédaction des sections cibles.
>
> **Convention** : à chaque rédaction de section, le rédacteur (claude.ai
> ou Claude Code) lit ce fichier et coche les items concernés en passant
> leur statut à ✅. Les items résolus sont déplacés en bas du fichier.
>
> **Statut** : 🔴 à faire · 🟡 en cours · ✅ fait · ❌ rejeté

---

## Items par section cible

### Section 5 — Spécifications fonctionnelles

#### B-005-1 ✅ Audit ancrage code section 5

- **Source** : audit S5 (Claude Code, `05-audit-report.md`)
- **Résultat** : 8 écarts identifiés (dont 3 majeurs sur les extraits SQL),
  8 ajustements appliqués. Volume final 19 pages (cible 5-7 dépassée
  mais non réduite par décision Jérémy + claude.ai).
- **Décidé en** : S5 (2026-05-08)

---

### Section 6 — Spécifications techniques

#### B-006-1 ✅ Audit ancrage code + forme section 6

- **Source** : audit S8 (Claude Code, `06-audit-report.md`)
- **Résultat** : 5 écarts identifiés (dont 2 majeurs sur la dette technique
  — Helmet et rate-limiting), 8 ajustements appliqués (3 contenu + 3
  proportions de tableaux + 2 commentaires CC-VERIFY confirmés). Volume
  final 3 pages (cible respectée).
- **Décidé en** : S8 (2026-05-08)

---

### Section 8 — Sécurité

#### B-008-2 🔴 Brancher Helmet côté Express (1 ligne)

- **Source** : audit S8, recommandation 1 de Claude Code (`06-audit-report.md` D1)
- **Fichier prod** : `backend/package.json` (dep installée), `backend/src/app.ts` (jamais utilisée)
- **Action V2** : `import helmet from 'helmet'; app.use(helmet());` dans `app.ts`. Le coût est minime (1 ligne de code) et corrige immédiatement la dette en posant les en-têtes de sécurité côté Express (en plus de ceux déjà posés par Nginx en façade).
- **Décidé en** : S8 (2026-05-08)

#### B-008-3 🔴 Ajouter rate-limiting sur les routes auth

- **Source** : audit S8, recommandation 2 de Claude Code (`06-audit-report.md` D2)
- **Fichier prod** : aucun rate-limit nulle part actuellement (ni `express-rate-limit`, ni `limit_req` Nginx)
- **Action V2** : ajouter `express-rate-limit` au moins sur `/api/v1/auth/login`, `/register`, `/refresh` (protection brute-force). Configuration suggérée : 5 tentatives / 15 minutes par IP sur ces 3 routes.
- **Décidé en** : S8 (2026-05-08)

#### B-008-4 🔴 Ajouter une Content-Security-Policy stricte

- **Source** : audit S8, recommandation 3 de Claude Code (`06-audit-report.md` D3)
- **Fichier prod** : `devops/nginx/prod.conf` — actuellement aucune directive CSP
- **Action V2** : définir une CSP stricte côté Nginx (en complément des autres en-têtes déjà posés). Démarrer en mode `Content-Security-Policy-Report-Only` avant d'enforcer.
- **Décidé en** : S8 (2026-05-08)

---

### Section 12 — Difficultés rencontrées

#### B-012-3 🔴 Migration `fix_snake_case` non-rename (DROP + ADD = perte de données)

- **Source** : audit S5, recommandation 2 de Claude Code
- **Fichier prod** : `backend/prisma/migrations/20260117012249_fix_snake_case/migration.sql`
- **Action** : mentionner comme dette d'irréversibilité dans la sous-section
  "Difficultés techniques" si Jérémy le juge pertinent. En l'état, la migration
  fait `DROP COLUMN avatarUrl` puis `ADD COLUMN avatar_url`, ce qui perd les
  données existantes — acceptable en dev (seed) mais risqué en prod avec
  utilisateurs réels.
- **Cadrage proposé** :
  > Une migration de renommage (`fix_snake_case`) a été générée par Prisma
  > sous forme `DROP COLUMN avatarUrl` + `ADD COLUMN avatar_url` plutôt qu'un
  > `RENAME COLUMN`. Cette opération perd les avatars existants. En contexte
  > de l'apothéose (BDD seedée régulièrement), l'effet a été nul ; en prod
  > réelle avec utilisateurs, un script de réimport ou une migration manuelle
  > serait à prévoir. À traiter en V2 par une migration de rattrapage.
- **Décidé en** : S5 (2026-05-08, recommandation Claude Code)

#### B-012-1 🔴 Faute UX *"à clôturer un échange"*

- **Source** : audit S4, point d'arbitrage de Claude Code (E1 dans `07-audit-report.md`)
- **Fichier prod** : `frontend/src/hooks/useMessaging.ts:61`
- **Action** : mentionner comme dette UX V2 documentée, sans correction (code prod figé)
- **Cadrage proposé** :
  > Lors de l'audit final, une faute orthographique a été identifiée dans un toast déclenché par l'event Socket.IO `conversation:closed` : le toast affiche *"X à clôturer un échange"* au lieu de *"X a clôturé un échange"*. Le statut figé du code prod pour la soutenance ne permet pas de correction immédiate ; cette dette UX est documentée et programmée pour la V2.
- **Décidé en** : S4 (2026-05-08, arbitrage claude.ai)

#### B-012-2 🔴 Index composite `(conversationId, id DESC)` manquant en BDD

- **Source** : audit S4, recommandation 4 de Claude Code
- **Fichier prod** : `backend/prisma/schema.prisma:Message`
- **Action** : mentionner comme optimisation V2 dans une sous-section "Limites techniques identifiées"
- **Cadrage proposé** :
  > La pagination cursor-based des messages exploite la clé primaire `id` (autoincrement) comme curseur, performant via l'index primaire seul. L'ajout d'un index composite `@@index([conversationId, id(sort: Desc)])` accélérerait spécifiquement la requête fréquente `WHERE conversationId = ? AND id < cursor ORDER BY id DESC` lors du chargement de l'historique paginé. À évaluer en V2 avec mesure de la latence sur tables longues.
- **Décidé en** : S4 (2026-05-08)

---

### Section 13 — Conclusion / Perspectives V2

#### B-013-1 🔴 Récap agrégé des dettes V2 mentionnées dans le dossier

- **Source** : transversal (sections 7, 8, 9, 12 quand rédigées)
- **Action** : compiler une liste synthétique de toutes les V2 mentionnées au fil du dossier pour la cohérence narrative finale
- **À faire après** : sections 7, 8, 9, 12 toutes rédigées et auditées
- **Décidé en** : S4 (2026-05-08)

---

## Items transverses / Process

### P-001 🔴 Audit code-vs-doc systématique pour chaque section technique

- **Source** : audit S4, recommandation 5 de Claude Code
- **Pattern** : claude.ai rédige → Claude Code audite l'ancrage code → ajustements → validation Jérémy → commits séparés (`chore(dossier): audit ...` + `feat(dossier): section X — ...`)
- **Sections concernées** : 5, 6, 8, 9, 10 (les sections 1, 2, 3, 4, 11, 12, 13, 14 sont moins exposées au risque code-vs-doc, l'audit y est moins critique)
- **Format de rapport** : `passage-titre/dossier/sections/{NN}-audit-report.md` (cf. `07-audit-report.md` comme référence)

### P-002 🔴 Audit forme/lisibilité du PDF compilé (en complément de P-001)

- **Source** : recommandation Jérémy, S6 (2026-05-08)
- **Pattern** : à chaque audit Claude Code, en plus de l'ancrage code, vérifier le rendu visuel
- **Méthode** : après compilation, générer des PNG des pages auditées via `pdftoppm -r 150 -f X -l Y output/dossier_de_projet.pdf /tmp/page`, puis lire ces images pour identifier :
  - Extraits de code qui débordent (overflow horizontal)
  - Tableaux maladroitement cassés (cellules tronquées)
  - Diagrammes mal dimensionnés (illisibles ou trop grands)
  - Sauts de page malheureux (titre orphelin, image séparée de sa caption)
  - Incohérences typographiques
- **Action** : ajustement Typst si nécessaire (`width:` réduit, `pagebreak(weak: true)`, raccourci d'extraits) sans modifier le contenu narratif
- **Inclusion** : à intégrer au prompt Claude Code dès le prochain audit (sections 6, 8, 9, 10, 11)

### P-003 🔴 Compression finale du dossier (à faire à J-2)

- **Source** : alerte volume claude.ai, S6 (2026-05-08)
- **Constat** : sections 5 (19p) + 7 (18p) déjà à 37p ; toutes les autres sections rédigées vont pousser le total bien au-delà des 40p REAC
- **Action initiale (S7, présente)** : compression de 5 et 7 vers 8-10p et 10-12p, déport contenu volumineux vers annexes
- **Action finale (J-2)** : passe de polish global du dossier complet
  - Vérification volume total ≤ 40 pages
  - Déport additionnel vers annexes si dépassement
  - Cohérence narrative globale, pas de redondance entre sections
  - Vérification annexes ≤ 20 pages
- **Décidé en** : S6 (2026-05-08, claude.ai + Jérémy)

---

## Items résolus

*(les items ✅ sont déplacés ici pour garder l'historique sans encombrer la todo)*

#### B-008-1 ✅ Audit code-vs-doc spécifique aux numéros de ligne sécurité

- **Source** : audit S4, recommandation 5 de Claude Code
- **Résolu en** : S9 (2026-05-08), audit complet des 8 références ligne-par-ligne dans `08-audit-report.md`
- **Résultat** : 7/8 références exactes ; 1 corrigée (`socket.ts:131-134` → `socket.ts:128, 155` pour le contrôle "Cloisonnement par rooms" — pointait vers le début du handler `conversation:join` au lieu des instructions `socket.join` effectives).
- **Commit feat** : voir CONTEXT.md S9

---

## Comment Claude Code utilise ce fichier

À chaque nouvelle session, dans le prompt d'init :

> Lis `passage-titre/CONTEXT.md` pour le contexte courant + `passage-titre/BACKLOG.md`
> pour les items en attente. Quand tu rédiges/modifies une section, vérifie si des
> items du BACKLOG y sont rattachés et intègre-les. Marque les items traités ✅
> et déplace-les dans la section "Items résolus" en fin de fichier.

À chaque nouvelle décision/recommandation issue d'une session :

> claude.ai produit un cadrage textuel. Claude Code l'ajoute à `BACKLOG.md` au
> bon endroit (section cible) avec un nouvel identifiant `B-{section}-{n}`.