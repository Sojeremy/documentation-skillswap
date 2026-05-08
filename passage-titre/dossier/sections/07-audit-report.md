# Audit ancrage code — Section 7 (Réalisations)

**Date** : 2026-05-08
**Auditeur** : Claude Code (Opus 4.7)
**Périmètre** : `passage-titre/dossier/sections/07-realisations.typ`
**Repo audité** : code prod miroir (read-only) — `frontend/`, `backend/`, `prisma/`

## Synthèse

**13 écarts identifiés**, dont **3 majeurs** (chiffres faux, code incorrect),
**6 moyens** (extraits divergents du vrai code), **4 mineurs** (LOC approximatives,
formulations).
**12 ajustements appliqués** dans `07-realisations.typ`.
**1 point d'arbitrage** laissé à Jérémy (faute UX `"à clôturer"` dans le toast).
État général : la narration tient, le ton est conservé, l'ancrage code est
désormais aligné sur le vrai dépôt. Le PDF compile sans erreur.

---

## Écarts trouvés et traitement

### Extraits de code

#### E1 — Bloc d'orchestration `useMessaging` (section 7.2)
- **Initial Typst** : `useEffect` `onConversationClosed` simplifié sans logique
  `if (conversationId === selectedConvId) clearSelection()`. Toast lissé en
  `"a clôturé l'échange"`. Appel `useConversationActions(...)` avec 4 props.
- **Réel prod** (`frontend/src/hooks/useMessaging.ts:55-86`) : présence de la
  branche `clearSelection` ; toast avec **faute UX** (`"à clôturer un échange"` —
  "à" + "clôturer" infinitif) ; appel `useConversationActions(...)` avec **11 props**.
- **Décision** : ajusté en version conforme au vrai code (faute incluse pour
  fidélité au repo prod, qui est figé). Appel `useConversationActions` rétabli
  avec ses 10 props nommées (`selectedConvWithMessages` mentionné en
  commentaire pour ne pas alourdir l'extrait).
- **Justification** : audit `feature-inventory-cda.md` cité explicitement la
  faute comme "petite faute UX que le jury peut voir en démo" — la masquer
  rendrait le dossier divergent du repo.

#### E2 — Pattern optimistic UI (section 7.2)
- **Initial Typst** : `addOptimisticMessage({...})` avec un objet message
  complet ; déduplication décrite dans `useConversationMessages` ; **timeout
  10 s** affirmé.
- **Réel prod** (`frontend/src/hooks/messaging/useConversationActions.ts:100-118`,
  `:57-65`) : signature `addOptimisticMessage(tempId, content, sender)` à
  3 arguments séparés ; déduplication dans `useConversationActions.onMessage`
  via filtre `newMessage.sender?.id === user?.id` qui **ignore** le retour
  serveur (l'optimistic local reste en place, pas de substitution) ; **aucun
  timeout** dans le code actuel.
- **Décision** : extrait substitué par le vrai code ; bloc déduplication
  ajouté ; mention du timeout corrigée → "compromis assumé : pas de
  réconciliation automatique, point identifié comme dette V2".
- **Justification** : différence sémantique majeure. Le timeout 10 s aurait
  été une affirmation factuellement fausse devant un jury qui consulte le code.

#### E3 — Promise.all création message + update conversation (section 7.3)
- **Initial Typst** : extrait correct, déjà fidèle au vrai code (`socket.ts:244-270`).
- **Décision** : conservé sans modification.

#### E4 — Pagination cursor-based (section 7.3)
- **Initial Typst** : fonction nommée `listMessagesByConversation`, signature à
  3 paramètres positionnels, technique `cursor: { id: cursor }, skip: cursor ? 1 : 0`,
  `take: limit + 1` pour `hasMore`, retour `{ items, hasMore, nextCursor }`.
- **Réel prod** (`backend/src/services/message.service.ts:5-95`) : fonction
  nommée `getConversationMessagesService`, paramètre objet, technique
  `id: { lt: params.cursor }` (less-than direct), `take: limit`, retour `{ data,
  nextCursor }` (pas de `hasMore` explicite — `nextCursor === null` signale la
  fin). Limit clampée à `[1, 100]` côté serveur.
- **Décision** : extrait réécrit pour refléter la vraie technique (`lt: cursor`),
  mention du clamping ajoutée dans le commentaire associé.
- **Justification** : la technique `lt: cursor` est plus directe et plus juste
  pédagogiquement que la version `cursor + skip`.

#### E5 — Schéma Prisma (section 7.3)
- **Initial Typst** : enum `ConversationStatus`, contrainte `@db.VarChar(2000)`
  sur `Message.content`, index composite `@@index([conversationId, createdAt(sort: Desc)])`,
  relations `"MessagesSent"` / `"MessagesReceived"`.
- **Réel prod** (`backend/prisma/schema.prisma:149-194`) : enum
  `StatusOfConversation`, **pas de** `@db.VarChar`, **pas d'index composite**,
  relations `"SenderUser"` / `"ReceiverUser"`. Champ `title` sur `Conversation`
  (omis dans l'extrait initial). Présence de `@map("created_at")` /
  `@map("updated_at")` sur tous les champs temporels.
- **Décision** : extrait substitué par le vrai schéma.
- **Justification** : 4 erreurs factuelles dans un seul extrait — risque
  élevé que le jury repère la divergence.

#### E6 — Auth Socket par cookie JWT (section 7.4)
- **Initial Typst** : extrait simplifié (omet `if (!secret)` et la gestion
  `decoded.sub` string).
- **Réel prod** (`backend/src/realtime/socket.ts:88-122`) : présence de la
  vérif `if (!secret)` et coercion de `decoded.sub` si string.
- **Décision** : conservé tel quel — la simplification est pédagogique et le
  bloc reste correct sémantiquement.

#### E7 — Middleware `requireSimpleFollow` (section 7.4)
- **Initial Typst** : `?? Number(req.params.id)` (nullish coalescing) ; commentaire
  d'erreur "must be a positive integer" ; messages francisés.
- **Réel prod** (`backend/src/middlewares/conv.middleware.ts:78-115`) :
  `|| Number(req.paramsId)` (OR logique sur falsy + propriété `paramsId`
  attachée par middleware `parseNumericParams`) ; message exact "must be a
  valid id."
- **Décision** : extrait corrigé sur les 3 points (opérateur, propriété, message).
- **Justification** : le `??` vs `||` change la sémantique (`??` ne tombe pas
  sur 0/'' alors que `||` oui). Le jury peut le pointer.

### Chiffres et métriques

| Élément | Initial Typst | Réel | Ajusté |
|---|---:|---:|---|
| `useMessaging.ts` LOC | 139 | 139 | ✓ conservé |
| `socket.ts` LOC | 446 | 446 | ✓ conservé |
| Hooks `messaging/` | 7 | 7 | ✓ conservé |
| Routes REST conv. | 8 | **9** | ❌→✓ corrigé |
| Schémas Zod conv. | 4 | **7** | ❌→✓ corrigé |
| Composants UI ConversationPage | "11 organismes" | 9 .tsx + 2 hooks locaux | ❌→✓ corrigé en *"9 composants UI + 2 hooks locaux"* |
| Tests dédiés (3 spec files) | 3 | 3 | ✓ conservé |
| Events Socket entrants | 4 | 4 | ✓ conservé |
| Events Socket sortants | 6 | 6 (`error`, `joined`, `new` msg, `new` conv, `updated`, `closed`) | ✓ conservé |
| LOC `useConversationList` | 85 | **95** | ❌→✓ corrigé |
| LOC `useSelectedConversation` | 40 | **64** | ❌→✓ corrigé |
| LOC `useConversationMessages` | 110 | **163** | ❌→✓ corrigé |
| LOC `useFollowedUsers` | 55 | **30** | ❌→✓ corrigé |
| LOC `useGlobalSocket` | 95 | 94 | ⚠ corrigé en 94 |
| LOC `useConversationActions` | 185 | 184 | ⚠ corrigé en 184 |
| LOC `useMessagingScroll` | 60 | **111** | ❌→✓ corrigé |
| Lignes handler `message:send` | 167-347 | 167-347 | ✓ conservé |

### Chemins et références

| Chemin/Référence | Vérification | Décision |
|---|---|---|
| `docs/uml/sequence/conversation.png` | ✓ existe | **Activé** : `#image("../../../docs/uml/sequence/conversation.png", width: 100%)` à la place du placeholder rect. |
| `docs/uml/sequence/conversation.puml` | ✓ existe (footnote) | conservé |
| `docs/documentation-implementation/arc42/09-decisions/004-tanstack-query.md` | ✓ existe | conservé |
| `docs/documentation-implementation/arc42/09-decisions/003-prisma.md` | ✓ existe | conservé |
| ADR-011 Socket.IO mention | `011-socket-io.md` ✓ existe | conservé (cité en commentaire) |
| Captures UI `../assets/captures-ui/07-*.png` | ⏳ à générer | placeholders rect conservés |

---

## Recommandations pour Jérémy

1. **Faute UX `"à clôturer un échange"`** (`useMessaging.ts:61` du repo prod) :
   conservée dans l'extrait Typst pour fidélité. Trois options à arbitrer
   avec claude.ai : (a) la garder telle quelle et ne rien dire, (b) la
   mentionner explicitement comme dette UX dans la section 12 (Difficultés),
   (c) ouvrir une PR de correction sur le repo prod avant la soutenance —
   nécessiterait de lever le statut "code figé".

2. **Volume section 7 = 18 pages** (cible initiale 8-12). Le diagramme PNG
   conversation.png consomme une pleine page, et le bilan technique en fin
   de section ajoute du volume. Trois pistes : (a) accepter — la section 7
   est *centrale* et 18 pages sur 44 est cohérent ; (b) réduire en
   condensant les sous-sections 7.1 (4 captures actuellement, 2-3 suffiraient
   peut-être) ; (c) déplacer le schéma Prisma complet en annexe et garder
   un extrait minimal en 7.3. Recommandation : **(a)** — la cible 8-12
   semble sous-évaluée pour une fonctionnalité multi-couches.

3. **Wrapper `socketSendMessage`** : l'extrait optimistic UI fait référence à
   `socketSendMessage` sans en montrer le contenu. Il vient du hook
   `useSocket` (`frontend/src/hooks/useSocket.ts:93-100`) qui encapsule
   `socket.emit('message:send', ...)`. Si claude.ai trouve l'extrait
   ambigu pour le jury, ajouter un mini bloc 3 lignes citant
   `useSocket.ts:93-100`.

4. **Index composite manquant côté DB** : la pagination cursor-based exploite
   uniquement la PK `id` (autoincrement) — elle est performante par index
   primaire mais un index `(conversationId, id DESC)` accélérerait la requête
   `where conversationId AND id < cursor`. À mentionner comme dette V2 si
   tu veux du concret pour la section 12 ou 13.

5. **Section 7 et autres sections** : seule la 07 a été auditée code-vs-doc.
   Les sections 5, 6, 8, 9, 10 (rédigées par claude.ai par la suite ou à
   rédiger) gagneraient à passer par le même filtre — surtout la section 8
   (Sécurité) qui cite des numéros de ligne précis (`socket.ts:88-122`,
   `:222-230`, `:214-220`) à recroiser.

---

## Volume final compilé

- **Section 7 dans le PDF** : pages **13 → 30** = **18 pages** (cible 8-12 dépassée)
- **PDF total** : **44 pages** (incluant page de garde, sommaire 3 niveaux,
  les 14 sections squelette + annexes placeholder)
- **Compilation** : OK (warnings polices Inter / JetBrains Mono → fallback
  DejaVu actif comme prévu dans `template.typ`)
- **Erreurs** : 0
- **Diagramme `conversation.png`** : ✓ rendu en pleine page

---

## Mise à jour CONTEXT.md

Ligne ajoutée à l'historique des sessions :

```markdown
| 2026-05-08 | S4 | Audit ancrage code section 7 + ajustements | <hash> |
```
