# CONTEXT.md — Dossier de Projet CDA SkillSwap

> Fichier de contexte cumulé pour les sessions Claude Code et claude.ai.
> **À maintenir à jour après chaque session significative.**

---

## Soutenance

- **Date** : Mardi 13 mai 2026
- **Candidat** : Jérémy `[NOM_DE_FAMILLE]` *(à compléter)*
- **Titre visé** : Concepteur Développeur d'Applications (Niveau 6 RNCP)
- **École** : O'clock — Promotion Dublin (apothéose simulant un environnement entreprise)
- **Projet** : SkillSwap — https://skill-swap.fr
- **Rôle** : Lead Front

---

## État courant — 2026-05-08

### ✅ Fait

- Audit fonctionnel SkillSwap : `docs/audits/feature-inventory-cda.md` (commit `bea3330`)
- Scaffolding repo : `passage-titre/` (commit `806bc12`)
- Décision **fonctionnalité représentative** : F4 Messagerie temps réel (score 25/25)
- Décision **scénario jeu d'essai** : *"Alice envoie un premier message à Bob qu'elle suit"*
- Installation outils : Typst 0.14.2, Marp 4.4.0, Chromium 133
- Compilation Typst initiale OK (warnings polices, fallback DejaVu actif)
- Compilation Marp OK avec workaround `CHROME_PATH=/usr/bin/chromium`
- Plan d'attaque rédaction validé (sections 5-6-7-8 d'abord, puis 9-10-11, puis 1-4, puis ajouts)

### 🔄 En cours

- Rédaction section 7 (Réalisations — Messagerie temps réel)

### ⏳ À faire (ordre de rédaction validé)

1. **Étape 1** : Sections 5, 6, 7, 8 (cœur technique, le plus dense)
2. **Étape 2** : Sections 9, 10, 11 (tests, jeu d'essai, veille — alimentés par étape 1)
3. **Étape 3** : Sections 1, 2, 3, 4 (compétences, cahier des charges, entreprise, gestion projet)
4. **Étape 4** : Intro, conclusion, difficultés, lexique
5. **Étape 5** : Annexes
6. **Étape 6** : Slides Marp (soutenance orale 40 min)
7. **Étape 7 (J-1)** : Relecture, mise en forme finale, export PDF, impression

---

## Outils & Environnement

### Installés et fonctionnels

- **Typst 0.14.2** (`/usr/local/bin/typst`)
- **Marp CLI 4.4.0** (`@marp-team/marp-cli` global via npm)
- **Chromium 133.0.6943.126** (`/usr/bin/chromium`)
- **Firefox** (utilisé pour visualiser les PDFs Typst)
- **VS Code** (`/usr/bin/code`)
- **Node 24.11.0** + npm (via nvm)
- **Git** (origin: `git@github.com:Sojeremy/documentation-skillswap.git`)

### Hacks / Workarounds connus

- **Marp PDF** : utiliser `CHROME_PATH=/usr/bin/chromium marp ...` (le wrapper `chromium-browser` redirige vers snap qui n'est pas installé)
- **Apt cassé** : `archive.ubuntu.com` ne résout pas en DNS → pas de `sudo apt install` possible. Pour les paquets manquants : binaires GitHub direct, npm global, ou Snap si dispo.
- **Polices Typst** : Inter et JetBrains Mono non installées → fallback DejaVu Sans / DejaVu Sans Mono. Pour install (optionnel, améliore le rendu) :

  ```bash
  mkdir -p ~/.fonts && cd /tmp
  wget https://github.com/JetBrains/JetBrainsMono/releases/latest/download/JetBrainsMono.zip
  unzip -o JetBrainsMono.zip -d /tmp/jbmono
  cp /tmp/jbmono/fonts/ttf/*.ttf ~/.fonts/
  fc-cache -fv
  typst fonts | grep -iE "inter|jetbrains"
  ```

### Compilation

```bash
# Dossier
cd ~/Desktop/Documentation\ SkillSwap/projet-skillswap/passage-titre/dossier
typst compile main.typ output/dossier_de_projet.pdf

# Slides
cd ../slides
CHROME_PATH=/usr/bin/chromium marp soutenance.md --pdf -o output/presentation.pdf --theme-set theme/skillswap.css --allow-local-files

# Visualiser
firefox output/dossier_de_projet.pdf  # ou code output/...
```

---

## Contraintes critiques

### ⚠️ NE JAMAIS MODIFIER

- Le code prod dans `frontend/`, `backend/`, `devops/` (miroir du repo prod `O-clock-Dublin/projet-skillswap`)
- Le code applicatif est **figé**. Toute la dette tech identifiée par l'audit est **ASSUMÉE** et **DOCUMENTÉE comme dette V2** dans le dossier, jamais corrigée.

### ✅ MODIFIABLE

- `passage-titre/*` (le dossier projet et les slides)
- `docs/*` (la doc Arc42, audits, etc. — peut être enrichie)

---

## Décisions actées

### Fonctionnalité représentative — F4 Messagerie temps réel

Score 25/25 dans `docs/audits/feature-inventory-cda.md`. Composants principaux :

| Couche | Fichiers principaux |
|---|---|
| Frontend orchestrateur | `frontend/src/hooks/useMessaging.ts` (139 LOC) |
| Frontend sous-hooks | `frontend/src/hooks/messaging/*` (7 hooks) |
| Frontend UI | `frontend/src/components/organisms/ConversationPage/*` (11 organismes) |
| Frontend socket | `frontend/src/hooks/useSocket.ts`, `frontend/src/lib/socket-client.ts` |
| Backend Socket.IO | `backend/src/realtime/socket.ts` (446 LOC) |
| Backend middleware | `backend/src/middlewares/conv.middleware.ts` |
| Backend routes REST | `backend/src/routers/conv.router.ts` (8 routes) |
| Backend services | `backend/src/services/conv.service.ts`, `message.service.ts` |
| Tests | `conv.spec.test.ts`, `message.spec.test.ts`, `socket.spec.test.ts` |

### Scénario jeu d'essai (section 10)

**"Alice envoie un premier message à Bob qu'elle suit"** — active la branche `isFirstMessage` (`socket.ts:241`).

Pipeline complet :
1. Pré-requis : Alice follow Bob (`requireSimpleFollow` middleware)
2. Création conversation : `POST /api/v1/conversations`
3. Émission `message:send` Socket.IO (cookie JWT vérifié)
4. Validation participant + bornes (1 ≤ length ≤ 2000)
5. Persistance Prisma (Message + UPDATE Conversation.updatedAt en `Promise.all`)
6. Diffusion : `message:new` (room `conversation:42`) + `conversation:updated` (rooms `user:Alice` + `user:Bob`) + `conversation:new` (room `user:Bob`, branche premier message)
7. Optimistic UI résolu côté Alice (filtre `tempId < 0`)

### Captures d'écran

- **Environnement** : DEV local (seed 41 users, login `alice.dupont@example.com` / `password123`)
- **Outil** : Playwright + Chromium headless (à installer en local au projet : `cd passage-titre/dossier && npm init -y && npm i -D playwright && npx playwright install chromium`)
- **Viewports** : desktop 1440×900 + mobile 390×844
- **Naming** : `{section}-{description}-{viewport}.png` (ex. `07-conversation-list-desktop.png`)
- **Localisation** : `passage-titre/dossier/assets/captures-ui/`
- **Note de bas de page dans le dossier** : *"Captures réalisées en environnement de développement seedé (équivalent fonctionnel de la production)"*

### Diagrammes existants à réutiliser

Disponibles dans le repo, à référencer via `#image()` Typst :

- `docs/uml/architecture/architecture.png` → section 5.2 (architecture logicielle)
- `docs/uml/erd.png` ou `docs/documentation-implementation/arc42/diagrams/erd.svg` → section 5.4 (MEA)
- `docs/uml/user/use-cases.png` → section 5.6 (cas d'utilisation)
- `docs/uml/sequence/conversation.png` → section 5.7 (diagramme séquence — messagerie)
- `docs/uml/user/user-flow.png` → section 5.3 (parcours utilisateur)
- `docs/uml/deployement/deployement.png` → section 6 ou 7 selon contexte

Chemin relatif depuis `passage-titre/dossier/sections/` : `../../../docs/uml/...`

---

## Plan REAC officiel — rappel structurel

Plan en **11 sections** (page 6 du REAC v5) — projet en entreprise :

1. Liste des compétences mises en œuvre
2. Cahier des charges / expression des besoins
3. Présentation entreprise et service
4. Gestion de projet (planning, environnement humain, qualité)
5. Spécifications fonctionnelles (5.1-5.7 obligatoires)
6. Spécifications techniques (y compris sécurité)
7. Réalisations (4 sous-sections obligatoires : UI + métier + accès données + autres)
8. Éléments de sécurité
9. Plan de tests
10. Jeu d'essai
11. Veille sécurité

**Volume** : 30-40 pages dossier hors page de garde / sommaire / annexes (schémas inclus). Annexes 20 pages max.
**Format final** : `dossier_de_projet.pdf` (nom EXACT requis par O'clock).
**À imprimer** et remettre au jury le jour J.

---

## Outils MCP disponibles côté Claude Code

✅ **context7 MCP** est disponible. Utilisable pour récupérer la doc à jour de :

- Typst (https://typst.app/docs)
- Marp / Marpit (https://marpit.marp.app)
- Playwright (https://playwright.dev)
- Prisma, Next.js, Socket.IO, Zod, etc.

> **À chaque nouvelle session Claude Code, lui rappeler en intro** :
> *"Lis d'abord passage-titre/CONTEXT.md pour le contexte courant et passage-titre/BACKLOG.md pour les items en attente d'intégration. Quand tu rédiges ou modifies une section, vérifie si des items du BACKLOG y sont rattachés et intègre-les en marquant ✅. Tu as accès à context7 MCP pour la doc des libs (typst, marp, playwright, etc.)."*

---

## Liens utiles

### Repos GitHub

- **Repo doc** (celui-ci) : https://github.com/Sojeremy/documentation-skillswap
- **Repo prod** (read-only ici) : https://github.com/O-clock-Dublin/projet-skillswap

### Documentation publiée (Vercel)

- **Doc technique Arc42** : https://skillswap-docs.vercel.app
- **Guide utilisateur** : https://skillswap-guide.vercel.app
- **Storybook** : https://skillswap-storybook.vercel.app

### Application

- **Production** : https://skill-swap.fr
- **Health check** : https://skill-swap.fr/api/v1/health
- **DEV local** : http://localhost:8888 (après `npm run docker:up`)

---

## Workflow trio (claude.ai / Claude Code / Jérémy)

| Acteur | Responsabilité |
|---|---|
| **claude.ai** (Opus 4.7) | Rédige le contenu (Typst), arbitre les choix, garde la vue d'ensemble du dossier, prépare les prompts pour Claude Code |
| **Claude Code** (terminal) | Intègre les fichiers générés, audite le code prod, lance les scripts (captures, compilations), commit chaque étape |
| **Jérémy** | Valide les choix, fournit les détails projet (noms équipe, dates, choix tech), arbitre les arbitrages, visualise le PDF |

### Convention de commits

- `feat(passage-titre): ...` pour les ajouts au dossier
- `feat(dossier): section X — ...` pour chaque section rédigée
- `feat(slides): ...` pour les slides Marp
- `docs(audits): ...` pour les audits ou mises à jour de contexte
- `chore(passage-titre): ...` pour les correctifs mineurs (typos, formatting)

---

## Historique des sessions

| Date | Session | Réalisé | Commits |
|---|---|---|---|
| 2026-05-08 | S1 (matin) | Audit fonctionnel codebase | `bea3330` |
| 2026-05-08 | S2 (après-midi) | Scaffold `passage-titre/` Typst + Marp | `806bc12` |
| 2026-05-08 | S3 (soir) | Rédaction section 7 (Réalisations) | *à compléter* |
| 2026-05-08 | S4 | Audit ancrage code section 7 + ajustements | `44a97ed` (audit), `8ee168e` (ajustements) |
| 2026-05-08 | S5 | Création BACKLOG.md (3 items + 1 process) | <hash> |

*Chaque session significative ajoute une ligne ici en fin de travail.*