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

*(aucun item pour l'instant)*

---

### Section 8 — Sécurité

#### B-008-1 🔴 Audit code-vs-doc spécifique aux numéros de ligne sécurité

- **Source** : audit S4, recommandation 5 de Claude Code
- **Action** : avant rédaction définitive, recroiser les références `socket.ts:88-122` (auth), `socket.ts:222-230` (vérif participant `message:send`), `socket.ts:214-220` (refus si `Close`) avec le code prod réel — risque de divergence comme pour la section 7.
- **Décidé en** : S4 (2026-05-08)

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

---

## Items résolus

*(les items ✅ sont déplacés ici pour garder l'historique sans encombrer la todo)*

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