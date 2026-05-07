# Audit stack & versions cross-doc (axe 1 / S2)

**Date** : 2026-05-07 · **Commit correctif** : `d1a5310`

## Objectif

Confronter la doc publiée (MkDocs Arc42, Docusaurus user-docs) à la table de vérité de la stack telle que déployée en production, pour éliminer toute mention de version obsolète, fausse ou imprécise. Règle appliquée : **doc = miroir fidèle de la prod actuelle, pas archive ni journal de bord** (pas d'historicité fictive).

## Sources de vérité (repo PROD)

- `frontend/package.json`, `backend/package.json`
- `backend/prisma/schema.prisma`
- `devops/{backend,frontend}/Dockerfile.{dev,prod}`
- `devops/docker-compose.{dev,prod}.yml`
- `frontend/src/app/globals.css` (vérification Tailwind 4)

## Table de vérité PROD (synthèse)

| Techno | Version PROD | Source |
|---|---|---|
| Next.js | `16.1.1` | `frontend/package.json` |
| React + ReactDOM | `19.2.3` | `frontend/package.json` |
| TypeScript | front `^5` / back `^5.9.3` | `*/package.json` |
| Tailwind CSS | `^4.1.18` (sans `tailwind.config.*`, `@theme inline` dans `globals.css`) | `frontend/package.json` + `globals.css` |
| Zod | `^4.3.5` (front + back) | `*/package.json` |
| Express | `^5.2.1` | `backend/package.json` |
| Prisma + `@prisma/client` | `^7.2.0` (generator `prisma-client-ts`, datasource `postgresql`) | `backend/package.json` + `schema.prisma` |
| argon2 | `^0.44.0` | `backend/package.json` |
| jsonwebtoken | `^9.0.3` | `backend/package.json` |
| socket.io | `^4.8.3` | `backend/package.json` |
| meilisearch (client npm) | `^0.55.0` | `backend/package.json` |
| Meilisearch (serveur) | `v1.6` (`getmeili/meilisearch:v1.6`) | `docker-compose.*.yml` |
| PostgreSQL | `postgres:16-alpine` | `docker-compose.*.yml` |
| Node | `node:24` (dev + prod, front + back) | Dockerfiles |
| Engines node `package.json` | ⚠️ vide (ni front ni back) | — |

## Périmètre scanné (repo DOC) et méthode

Audit conduit en deux temps :

1. **Extraction PROD** : commande de lecture des `package.json`, Dockerfiles, `docker-compose*.yml`, `schema.prisma` pour produire la table de vérité ci-dessus.
2. **Scan DOC** : `grep -rEn -i` sur 12 patterns de versions (Next, Express, Prisma, Tailwind, TypeScript, React, Zod, argon2, Meilisearch, Node, PostgreSQL, `tailwind.config.*`) avec extensions `*.md`/`*.mdx`, exclusions `node_modules/`, `.next/`, `dist/`. Cibles :

```
docs/documentation-implementation/
docs/documentation-strategy/01-stack.md
user-docs/docs/
README.md DEPLOYMENT.md frontend/README.md devops/README.md
```

## Résultats : 76 hits initiaux — classification

| Bucket | Hits | Détail |
|---:|---:|---|
| ✅ Aligné avec la prod | 67 | Postgres `16-alpine`, Meilisearch `v1.6`, `node:24` Dockerfiles cités, Express `^5.2.1`, React `19.2.3`, Prisma `^7.2.0`, argon2 `^0.44.0`, Zod `^4.3.5`, TypeScript `^5`, Next.js `16.1.1`/`16` (5 occ.), connection strings `5432`/`postgresql://`. |
| ⚠️ Écart à corriger | 9 | Cf. tableau corrections ci-dessous. |
| 🕰️ Reformulation ADR | 1 | `09-decisions/001-nextjs.md` — sortie de la mention `Next.js 14`, enrichissement du statut. |

Aucun hit `tailwind.config.*` (cohérent Tailwind 4). Aucun hit `Tailwind` avec version (voir Observations annexes).

## Corrections appliquées (commit `d1a5310`)

| # | Fichier · ligne | Avant | Après |
|---|---|---|---|
| 1 | `documentation-implementation/index.md:22` | `**Next.js 14** - Framework React avec App Router` | `**Next.js 16.1.1** - Framework React avec App Router` |
| 2 | `arc42/02-constraints/index.md:73` | `Next.js 14 (App Router)` | `Next.js 16.1.1 (App Router)` |
| 3 | `arc42/04-solution-strategy/index.md:9` | `**Next.js 14**` | `**Next.js 16.1.1**` |
| 4 | `arc42/12-glossary/index.md:24` | `Système de routing Next.js 14 basé sur le système de fichiers` | `Système de routing Next.js basé sur le système de fichiers` |
| 5 | `arc42/02-constraints/index.md:10` | `**Node.js 20+** \| Version LTS \| Support long terme, performances` | `**Node.js 24** \| Version utilisée en production \| Cohérent avec Dockerfiles dev/prod` |
| 6 | `arc42/05-building-blocks/index.md:38` | `Express 5, Node.js 20+` | `Express 5, Node.js 24` |
| 7 | `arc42/10-quality/testing.md:13` | `test runner natif de Node** (≥ 22)` | `test runner natif de Node** (Node 24)` |
| 8 | `documentation-strategy/01-stack.md:15` | `Node 20+` | `Node 24` |
| 9 | `documentation-strategy/01-stack.md:95` | `Node 20+` | `Node 24` |

## Reformulation ADR 001 — option D (sans historicité fictive)

Fichier : `docs/documentation-implementation/arc42/09-decisions/001-nextjs.md`.

**Contexte** : la version `Next.js 14` mentionnée dans la décision n'a jamais existé en prod — le projet a toujours été en `16.1.1`. C'était un reliquat de template ou de génération initiale, pas une étape historique réelle. Toute reformulation préservant `(initialement v14)` ou un faux journal de migration `v14 → v15 → v16` aurait fabriqué un historique fictif, démasquable en oral. La règle appliquée : la doc reflète la prod actuelle, sans inventer de passé pour la justifier.

| Section | Avant | Après |
|---|---|---|
| `## Statut` | `Accepté (2024-12)` | `Accepté (2024-12). Implémenté en Next.js 16.1.1.` |
| `## Décision` | `**Adopter Next.js 14 avec App Router** plutôt que Pages Router ou Create React App.` | `**Adopter Next.js avec App Router** plutôt que Pages Router ou Create React App.` |

Les sections `## Contexte`, `## Alternatives considérées`, `## Conséquences`, `## Structure adoptée` étaient déjà neutres vis-à-vis de la version (App Router, Server Components, SSR/SSG, optimisations automatiques — features stables depuis Next.js 13). Aucune modification de leur contenu.

## Note méthodologique — trou de pattern détecté en vérification post-fix

Le hit n°5 (`02-constraints/index.md:10` — `**Node.js 20+** | Version LTS`) n'a **pas** été remonté par le `grep` d'audit initial. Cause : le pattern `\bnode[^[:alnum:]]+v?[0-9]+(\.[0-9]+)?` ne matche pas la séquence `Node.js 20+` car `.js` casse la séquence non-alphanumérique attendue (le `j` est alnum). Le hit a été détecté par la vérification post-fix `grep -rEn -i 'node[^[:alnum:]]*20\+|node\.?js\s*20\+'` du prompt Claude Code, plus permissive sur la forme `Node.js`.

Conséquence : le grep d'audit initial a sous-estimé le périmètre d'1 hit. Pour les audits futurs, le pattern Node sera élargi à `\bnode(\.?js)?\b` suivi du qualifieur de version. Aucun autre hit potentiellement manqué détecté à la relecture.

## Observations annexes (dette V2 reconnue, hors périmètre A1)

1. **Tailwind absent du glossaire 12.4** — Le tableau de versions de `arc42/12-glossary/index.md` (lignes 100–118) liste Next.js, React, TypeScript, Zod, Express, Prisma, argon2, Meilisearch, PostgreSQL, mais **pas Tailwind CSS**. Ajout suggéré en V2 : ligne `| Tailwind CSS | ^4.1.18 | frontend/package.json |`.

2. **Engines `package.json` vides** — Ni `frontend/package.json` ni `backend/package.json` ne pinnent la version Node dans le bloc `engines`. La cohérence repose uniquement sur les Dockerfiles (`FROM node:24`). Dette mineure : ajouter `"engines": { "node": ">=24" }` aux deux `package.json` en V2 pour formaliser la contrainte.

3. **Generator Prisma `prisma-client-ts` non documenté** — Le `schema.prisma` utilise `provider = "prisma-client-ts"` (generator récent de Prisma 7), avec output `./generated/prisma`. La doc publiée ne mentionne nulle part ce generator (0 hit `prisma-client-js` / `prisma-client-ts` dans toute la doc). Enrichissement V2 suggéré : section dédiée dans `building-blocks/database.md` ou ligne dans le glossaire 12.4.

## Conclusion

La stack publiée affichait 9 écarts factuels sur 76 mentions de versions auditées (ratio ~12 %). Les écarts se concentraient sur deux reliquats : `Next.js 14` (4 hits) et `Node.js 20+` (4 hits + 1 détecté en post-fix). Tous corrigés et alignés sur la table de vérité PROD par le commit `d1a5310`. L'ADR 001 a été reformulé sans historicité fictive, conformément à la règle "doc = miroir fidèle de la prod actuelle". Aucune régression silencieuse détectée sur Tailwind 4 (cohérent : pas de `tailwind.config.*`, `@theme inline` présent en prod) ni sur Node 24 (Dockerfiles unifiés).

Trois dettes mineures sont documentées en observations annexes pour traitement V2 (Tailwind glossaire, engines Node, generator `prisma-client-ts`).