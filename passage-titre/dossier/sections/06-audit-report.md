# Audit ancrage code + forme — Section 6 (Spécifications techniques)

**Date** : 2026-05-08
**Auditeur** : Claude Code (Opus 4.7)
**Périmètre** : `passage-titre/dossier/sections/06-specifications-techniques.typ`
**Repo audité** : code prod miroir (read-only) — `frontend/package.json`,
`backend/package.json`, `backend/src/`, `devops/nginx/prod.conf`,
`docs/documentation-implementation/arc42/09-decisions/`

## Synthèse

**5 écarts identifiés** (dont 2 majeurs sur la dette technique), **8 ajustements
appliqués** (3 sur le contenu, 3 sur les proportions de tableaux, 2 sur les
commentaires CC-VERIFY remplacés par des notes d'audit confirmé).
**Aucun point d'arbitrage** laissé pendant — tous les écarts détectés étaient
des erreurs factuelles unilatéralement corrigeables.

Volume final : **3 pages** (footer 24-26, physique 25-27) — cible
strictement respectée. Compilation propre, 0 warning.

---

## Écarts trouvés et traitement

### Versions stack (7.1)

| Élément | Cité | Réel | Décision |
|---|---|---|---|
| Next.js | 16.1.1 | 16.1.1 (`frontend/package.json`) | ✓ conservé |
| Express | 5.2.1 | 5.2.1 (`backend/package.json`) | ✓ conservé |
| Prisma Client | 7.2.0 | 7.2.0 | ✓ conservé |
| PostgreSQL | 16 | postgres:16-alpine | ✓ conservé |
| Meilisearch | server 1.6 / client 0.55.0 | meilisearch:v1.6 + npm 0.55.0 | ✓ conservé |
| Socket.IO | 4.8.3 | 4.8.3 | ✓ conservé |

Toutes les versions du tableau stack sont confirmées. Commentaire
`CC-VERIFY` remplacé par une note "reconfirmées en audit S8".

### ADRs (7.2)

Les 11 ADRs cités existent tous dans `09-decisions/` (`001-nextjs.md` →
`011-socket-io.md`). Titres et décisions retenues conformes aux titres
réels des fichiers. Aucun ADR manquant ni en surnombre. Commentaire
`CC-VERIFY` remplacé par une note de confirmation.

### Sécurité transversale (7.4) — lignes-références

| Référence | Cité | Réel | Décision |
|---|---|---|---|
| argon2 | `auth.service.ts:21` | ✓ ligne 21 (`argon2.hash`) | conservé |
| Cookies httpOnly | `auth.controller.ts:68-94` | helpers entre l.63-94 (intervalle un peu plus large mais cohérent) | conservé |
| Refresh rotation | `auth.service.ts:103-108` | ✓ deleteMany + new generateRefreshToken | conservé |
| CORS | `app.ts` | ✓ origin: config.allowedOrigin, credentials: true (l.12-17) | conservé |
| HTTPS / Let's Encrypt | `nginx/prod.conf` | ✓ redirection 80→443 (l.18-29) + HSTS (l.51) | conservé |

Note d'audit ajoutée listant les lignes exactes pour réécouter rapidement
si nécessaire.

### Dette technique (7.4) — corrections majeures

#### D1 — "Helmet absent" → FAUX

- **Initial** : *"Helmet absent (en-têtes HTTP de sécurité par défaut non posés)"*
- **Réel** : `helmet@^8.1.0` est listé dans `backend/package.json` mais
  **jamais importé/monté** dans `backend/src/`. Vérifié par `grep -rn "helmet" backend/src/` → 0 résultat.
- **Réalité supplémentaire** : nginx en production pose lui-même les
  en-têtes équivalents (`X-Frame-Options "SAMEORIGIN"`, `X-Content-Type-Options "nosniff"`,
  `X-XSS-Protection "1; mode=block"`, `Strict-Transport-Security "max-age=31536000; includeSubDomains"`).
  L'effet attendu d'Helmet est donc *partiellement* obtenu côté
  reverse-proxy.
- **Décision** : reformulation complète en "Helmet installé mais non monté
  côté Express (la dépendance helmet@8.1.0 est présente mais n'est jamais
  appliquée — les en-têtes courants sont néanmoins posés par Nginx en
  façade)".

#### D2 — "rate-limiting global non en place (présent uniquement sur l'authentification)" → FAUX

- **Initial** : sous-entend qu'un rate-limit existe sur `/auth/*`.
- **Réel** : `grep -rn "rate.limit\|rateLimit"` dans `backend/src/` → 0 résultat.
  `express-rate-limit` n'est PAS dans `backend/package.json`. Aucune
  configuration `limit_req` / `limit_conn` côté Nginx non plus.
- **Décision** : reformulation honnête en "rate-limiting absent (aucune
  protection applicative contre l'abus en volume — ni express-rate-limit,
  ni limit côté Nginx)".

#### D3 — Ajout d'une 4e dette : "CSP stricte absente"

- **Découverte** : aucune directive `Content-Security-Policy` côté Express
  ni côté Nginx (`grep -E "Content-Security-Policy|CSP" devops/nginx/prod.conf`
  → 0 résultat).
- **Décision** : ajout d'une 4e zone de fragilité dans la liste des dettes
  V2.

#### D4 — RGAA / WCAG (audit accessibilité formel)

- **Initial** : "non mesuré via axe-core ou Lighthouse".
- **Réel** : `axe-core` apparaît dans `frontend/node_modules/` mais
  uniquement comme dépendance transitive de Playwright (non utilisé
  explicitement pour un audit). Aucun rapport d'audit formel dans le repo.
- **Décision** : conservé tel quel — la dette est exacte.

### Patterns transversaux (7.3)

Vérifications :

- "9 organismes dans `ConversationPage/`" → cohérent avec audit S5
  (4 .tsx top + 5 .tsx dans `MessageThread/` = 9). ✓
- `frontend/src/lib/validation/` → existe (4 fichiers .ts + 4 fichiers .test.ts). ✓
- Middlewares `checkAuth`, `requireSimpleFollow`, `isOwner`, `parseNumericParams`
  → tous présents dans `auth.middleware.ts` et `conv.middleware.ts`. ✓

Aucune correction nécessaire sur ces patterns.

---

## Audit forme (P-002) — anomalies détectées et corrigées

### F1 — Tableau Stack technique : colonne "Composant" trop étroite

- **Initial** : `columns: (8em, 1fr, 6em)` — cassait "Recherche full-text"
  en 2 lignes, idem "Tests backend" / "Tests frontend".
- **Décision** : `columns: (10em, 1fr, 6em)` — toutes les cellules tiennent
  désormais en 1 ligne pour la colonne 1.

### F2 — Tableau ADRs : colonne "Sujet" écrasée par la 3e colonne `1.5fr`

- **Initial** : `columns: (3em, 1fr, 1.5fr)` — la 3e colonne plus large
  écrasait la 2e, cassant "Architecture des composants UI" en 3 lignes,
  "Validation des entrées" et "Communications temps réel" en 2 lignes.
- **Décision** : `columns: (3em, 11em, 1fr)` — colonne "Sujet" en largeur
  fixe suffisante (max "Architecture des composants UI" tient en 2 lignes
  contrôlées), colonne "Décision retenue" prend tout le reste.

### F3 — Tableau Sécurité transversale : colonne "Domaine" trop étroite

- **Initial** : `columns: (10em, 1fr)` — cassait "Hashing mots de passe"
  en 3 lignes, "Validation des entrées" en 2 lignes.
- **Décision** : `columns: (12em, 1fr)` — labels tiennent en 1-2 lignes max.

---

## Recommandations pour Jérémy

1. **Helmet à brancher en V2** : la dépendance étant déjà installée, le
   coût d'intégration est minime. `app.use(helmet())` dans `backend/src/app.ts`
   ajoute immédiatement les en-têtes manquants (et corrige doublement
   l'écart de doc). Item à ajouter au BACKLOG section 8 si tu veux le
   tracer pour la V2.

2. **Rate-limiting absent — recommandation forte** : absence totale de
   protection contre l'abus. Pour la soutenance, mentionner explicitement
   en section 8 (Sécurité fonctionnelle) ou 12 (Difficultés) que c'est une
   dette identifiée — montre la lucidité technique. Solution V2 simple :
   `express-rate-limit` sur `/api/v1/auth/*` (login, register, refresh).

3. **CSP stricte** : absence également notable. À ajouter au BACKLOG si
   tu veux compléter la liste des dettes V2 mentionnées dans le dossier.

4. **Volume section 6 = 3 pages** ✓ : cible strictement respectée.
   Pas d'action requise.

5. **Continuer l'audit P-002 sur les sections suivantes** : les sections
   8 (Sécurité fonctionnelle), 9 (Plan de tests) et 10 (Jeu d'essai) vont
   probablement contenir des tableaux similaires. Anticiper les
   proportions `columns:` adaptées dès la rédaction par claude.ai.

---

## Volume final compilé

- **Section 6 dans le PDF** : pages footer **24 → 26** = **3 pages**
  (cible 3p ✓)
- **PDF total** : **62 pages** (vs 60 avant — l'ajout du paragraphe
  dette technique a coûté +2p, compensé par la compression des tableaux)
- **Compilation** : OK, 0 warning, 0 erreur
- **Tableaux** : tous équilibrés, aucune cellule cassée

---

## Mise à jour CONTEXT.md

```markdown
| 2026-05-08 | S8 | Audit ancrage code + forme section 6 | <hash audit>, <hash feat> |
```

## Statut Helmet / RGAA / rate-limit (récap exécutif)

| Dette | Initial | Audit S8 | Statut réel |
|---|---|---|---|
| Helmet | "absent" | Installé `^8.1.0` mais non monté | À brancher en V2 (1 ligne de code) |
| RGAA / WCAG | "non audité formellement" | Confirmé : pas de rapport `axe-core`/Lighthouse | Conservé tel quel |
| Rate-limiting | "présent sur auth uniquement" | **Aucun rate-limit nulle part** | Reformulé honnêtement |
| CSP | (non mentionné) | **Absente côté Express ET côté Nginx** | Nouveau point ajouté |
| En-têtes Helmet | (sous-entendu absents) | **Posés par Nginx** (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS) | Mention ajoutée |
