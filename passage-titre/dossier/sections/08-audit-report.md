# Audit ancrage code + forme — Section 8 (Éléments de sécurité)

**Date** : 2026-05-08
**Auditeur** : Claude Code (Opus 4.7)
**Périmètre** : `passage-titre/dossier/sections/08-securite.typ`
**Repo audité** : code prod miroir (read-only)
**Item BACKLOG résolu** : **B-008-1** (audit code-vs-doc spécifique aux numéros
de ligne sécurité)

## Synthèse

**1 seul écart majeur identifié sur les 8 références ligne-par-ligne**
auditées (référence #2 "Cloisonnement par rooms" mal cadrée — pointait
vers le début du handler `conversation:join` au lieu des instructions
`socket.join` effectives). **1 ajustement appliqué** + commentaire
`CC-VERIFY` remplacé par une note de résolution. Les 4 dettes de sécurité
V2 mentionnées dans le tableau sont toutes confirmées contre le code
prod. Volume final **3 pages** (cible strictement respectée). Compilation
propre, tableaux équilibrés, aucune anomalie forme à corriger.

---

## Vérifications ligne-par-ligne (B-008-1) — récapitulatif

| # | Référence avant | Réalité prod | Décision |
|---|---|---|---|
| 1 | `socket.ts:88-122` (Auth handshake) | l.88 (`io.use((socket, next) => {`) → l.122 (`});`) | ✓ **conservé** — exact |
| 2 | `socket.ts:131-134` (Cloisonnement par rooms) | l.131 = `socket.on('conversation:join', ...)` (entrée du handler) ; l.133 = validation `conversationId` ; **les vraies instructions `socket.join` sont en l.128 (room user) et l.155 (room conversation)** | ❌ **corrigé** → `socket.ts:128, 155` |
| 3 | `socket.ts:136-152` (Vérif participant `conversation:join`) | l.136 (`prisma.userHasConversation.findUnique`) → l.152 (`return;`) | ✓ **conservé** — exact |
| 4 | `socket.ts:167-186` (Validation bornes message) | l.167 (`socket.on('message:send', ...)`) → l.186 (`}` fin du 2e check `content.length > 2000`) | ✓ **conservé** — exact |
| 5 | `socket.ts:214-220` (Refus si `Close`) | l.214 (`if (!conv || conv.status === 'Close')`) → l.220 (`}`) | ✓ **conservé** — exact |
| 6 | `socket.ts:222-230` (Vérif participant `message:send`) | l.222 (`// Verify that the sender ...`) → l.230 (`}`) | ✓ **conservé** — exact |
| 7 | `MessageInput.tsx:41` (`disabled` quand `Close`) | l.41 (`disabled={conversationStatus === 'Close'}`) | ✓ **conservé** — exact |
| 8 | `conv.middleware.ts:78-115` (`requireSimpleFollow`) | l.78 (`export const requireSimpleFollow`) → l.115 (`};`) | ✓ **conservé** — exact |

**Bilan** : 7/8 exactes, 1/8 corrigée. La référence #2 a été enrichie au
passage avec une précision pédagogique : *"inscription à la room personnelle
à la connexion ; inscription à la room conversation seulement après
vérification participant"* — distinction qui rend le contrôle plus
intelligible.

---

## Vérifications dettes V2 (sous-section "Limites assumées")

Toutes confirmées par audit grep contre le code prod :

| Dette | Vérification | Statut |
|---|---|---|
| Helmet installé non monté | `grep -rn "helmet" backend/src/` → 0 résultat | ✓ confirmé |
| Rate-limiting absent | `grep -rn -i "rate.limit\|rateLimit\|express-rate" backend/src/ backend/package.json` → 0 résultat | ✓ confirmé |
| CSP absente | `grep -in "content.security.policy\|CSP" devops/nginx/prod.conf` → 0 résultat | ✓ confirmé |
| Validation Socket non-Zod | `grep -in "zod\|Zod\|schema" backend/src/realtime/socket.ts` → 0 résultat | ✓ confirmé |

Aucune correction de contenu nécessaire sur le tableau des dettes.

---

## Audit forme (P-002) — analyse visuelle des 3 pages

| Page (footer) | Contenu | Verdict forme |
|---|---|---|
| p.41 | Intro + Auth Socket.IO + début tableau "6 contrôles" | ✓ propre, transitions narratives fluides |
| p.42 | Suite tableau "6 contrôles" + paragraphe gating REST + début "Défense en profondeur" | ✓ tableau (12em/1fr/8em) parfaitement équilibré sur les 6 lignes — colonne "Mécanisme" lisible |
| p.43 | Défense en profondeur (3 lignes) + intégralité tableau "Dettes V2" (4 lignes) | ✓ les 2 tableaux (`12em/1fr` chacun) tiennent sur la page sans débordement |

**Aucune anomalie forme détectée.** Pas d'ajustement de proportions
nécessaire. La section 8 est dimensionnée correctement dès la rédaction
par claude.ai (qui a appris des patterns des audits précédents).

---

## Recommandations pour Jérémy

1. **Item B-008-1 ✅ résolu** : à déplacer dans la section "Items résolus"
   du BACKLOG.md, avec mention `Résolu en S9 (commit <hash feat>)`.

2. **Continuer l'audit P-002 sur sections 9-10-11** : le pattern empirique
   appris au fil des audits (proportions `(N em, 1fr)` ou `(N em, 1fr, M em)`
   avec N adapté au plus long label, jamais deux `fr` consécutifs) tient.
   Les sections 9 (Plan de tests) et 10 (Jeu d'essai) auront probablement
   des tableaux REAC larges — anticiper.

3. **Pas de nouvelle dette technique découverte** lors de cet audit. Les
   3 nouveaux items B-008-2/3/4 (Helmet, rate-limit, CSP) ajoutés en S8
   couvrent déjà le périmètre. Pas d'action sur le BACKLOG côté nouveaux
   items.

---

## Volume final compilé

- **Section 8 dans le PDF** : pages footer **41 → 43** = **3 pages**
  (cible 3p ✓ strictement respectée)
- **PDF total** : **65 pages** (vs 62 avant — +3p naturels d'expansion
  du contenu sécu, hors tableau des dettes qui a été dimensionné en
  amont par claude.ai)
- **Compilation** : OK, 0 warning, 0 erreur
- **Tableaux** : tous équilibrés, aucune cellule cassée, lisibilité
  jury garantie

---

## Mise à jour CONTEXT.md

```markdown
| 2026-05-08 | S9 | Audit ancrage code + forme section 8 (résout B-008-1) | <hash audit>, <hash feat> |
```
