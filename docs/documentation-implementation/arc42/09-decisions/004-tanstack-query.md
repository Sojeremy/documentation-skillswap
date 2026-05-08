# ADR-004 : TanStack Query (Rejeté)

## Statut

**Rejeté** (2026-01-22)

> Évalué pendant la phase de cadrage frontend, écarté au profit d'une
> composition de hooks React natifs. Conservé dans l'index ADR à titre de
> trace de la décision pour le jury.

## Décideurs

- **Jérémy** — Lead Front (instruction de la décision)
- **Pôle Front** (Yvan, Quentin) — revue collégiale

## Contexte

Le frontend SkillSwap doit gérer du **state serveur** côté React :

- chargement des conversations, messages, profils, résultats de recherche ;
- mises à jour optimistes (envoi de message, follow/unfollow, notation) ;
- annulation des fetchs au démontage (changement de conversation/page) ;
- propagation temps réel des nouveaux messages et notifications.

La question initiale était : **doit-on adopter TanStack Query (React Query)
4.x** comme couche de cache/refetch standardisée, ou bâtir une solution sur
les hooks React natifs ?

## Décision

**Rejeté.** SkillSwap n'utilise **aucune** librairie externe de cache de
requêtes ou de store global. La gestion d'état repose sur :

- les hooks React natifs (`useState`, `useEffect`, `useCallback`, `useRef`) ;
- un `Context` unique (`AuthProvider`) pour l'utilisateur connecté ;
- `AbortController` pour le cancel-on-unmount des fetchs ;
- **Socket.IO** (cf. [ADR-011](./011-socket-io.md)) pour la propagation
  push des messages et notifications, ce qui dispense d'un mécanisme de
  refetch périodique côté client.

Vérification empirique : `grep "@tanstack" frontend/package.json` ne renvoie
rien ; `grep "useQuery\|useMutation" frontend/src/hooks/` non plus.

## Pourquoi ce rejet

| Critère                        | TanStack Query                                    | Hooks natifs (retenu)                                                   |
|--------------------------------|---------------------------------------------------|-------------------------------------------------------------------------|
| Bundle ajouté                  | ~30 KB gzippé (lib + devtools)                    | 0 (déjà dans React)                                                     |
| Cache cross-route              | Natif (queryKey global)                           | Pas un besoin : chaque route monte/démonte ses hooks                    |
| Optimistic UI                  | Natif via `onMutate`                              | Réalisable manuellement avec `setState` + `tempId` (cf. `useConversationActions.ts`) |
| Refetch sur focus / reconnect  | Natif                                             | Pas un besoin : Socket.IO pousse les updates → refetch périodique inutile |
| Courbe d'apprentissage         | Concepts spécifiques (queryKey, staleTime, etc.)  | Concepts React standards (formation interne minimale)                   |
| Devtools                       | Excellent (panel dédié)                           | React DevTools standard                                                 |
| Risque de double emploi avec Socket.IO | Élevé (gestion d'invalidation à coordonner) | Aucun (les listeners Socket.IO mutent directement le state)             |

Le **point bloquant** a été le risque de double emploi avec Socket.IO :
adopter TanStack Query aurait imposé d'écrire des invalidations
(`queryClient.invalidateQueries`) à chaque event Socket.IO entrant, alors
que la même UI pouvait être obtenue plus simplement en branchant les
listeners directement sur les setters d'état React (cf.
[`useMessaging.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/useMessaging.ts) qui appelle
`updateConversationLastMessage` depuis `onConversationUpdate`).

## Alternatives considérées

| Alternative                  | Pour                                  | Contre                                                            | Verdict         |
|------------------------------|---------------------------------------|-------------------------------------------------------------------|-----------------|
| **TanStack Query**           | Cache + revalidation natifs, devtools | Bundle, double emploi avec Socket.IO, courbe d'apprentissage      | **Rejeté**      |
| **Redux Toolkit + RTK Query** | Cache + outil débogage standardisés   | Boilerplate lourd pour l'équipe, sur-dimensionné pour ce besoin  | Rejeté          |
| **Zustand**                  | Léger, store global simple            | Pas de cache HTTP, store global non nécessaire (pas d'état UI partagé entre routes) | Rejeté          |
| **SWR**                      | API plus simple que TanStack          | Mêmes problèmes : bundle + double emploi avec Socket.IO           | Rejeté          |
| **Hooks React natifs + AbortController** | 0 dépendance, alignement Socket.IO direct | Plus de boilerplate par hook (cancel manuel, gestion erreurs) | **Retenu**      |

## Conséquences

### Positives

- **Zéro dépendance** ajoutée pour le state serveur — bundle frontend plus
  léger.
- **Alignement direct avec Socket.IO** : les listeners
  (`onConversationUpdate`, `onConversationClosed`, `onConversationNew`)
  appellent directement les setters React des hooks de liste/messages.
  Pas de couche d'invalidation intermédiaire.
- **Apprentissage React natif renforcé** pour l'équipe — `useEffect` +
  `AbortController` + `useCallback` deviennent maîtrisés à fond plutôt que
  cachés derrière une abstraction.
- **Tests plus simples** : pas besoin de wrapper `<QueryClientProvider>` ou
  de mocker un `queryClient` dans les tests Vitest.

### Négatives

- **Plus de boilerplate par hook** : chaque hook qui fetch doit gérer
  manuellement `loading/error/data`, l'`AbortController` au cleanup, et
  l'éventuel optimistic update.
- **Pas de devtools dédié** — le debug s'appuie sur React DevTools
  uniquement.
- **Risque de duplication de logique** entre hooks (pattern de cancel,
  pattern de pagination cursor) — mitigé par les hooks composables dans
  `hooks/messaging/` et `hooks/profile/`.

### Risques

- Si SkillSwap évolue vers un **cache cross-route persistant** (ex.
  préchargement de profils dans la home pour les afficher instantanément
  sur `/recherche`), il faudra ré-évaluer cette décision. À ce stade, le
  besoin n'a pas été observé.

## Note pour le jury Titre Pro CDA

Cet ADR illustre une **évaluation lucide des alternatives** plutôt que
l'adoption mimétique d'une librairie populaire. Le choix repose sur quatre
arguments factuels (bundle, double emploi avec Socket.IO, courbe
d'apprentissage, alignement avec l'architecture temps réel) et la décision
est **traçable au code** : `frontend/package.json` ne référence ni
`@tanstack/react-query` ni équivalent ; aucun fichier `frontend/src/`
n'importe `useQuery` ou `useMutation`.

## Références

- Stratégie réellement adoptée : [`05-building-blocks/frontend.md`](../05-building-blocks/frontend.md) — section « Pas de state management externe »
- Façade hooks composables : [`useMessaging.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/useMessaging.ts) (140 LOC)
- Optimistic UI manuel : [`useConversationActions.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/messaging/useConversationActions.ts) (l.100-118)
- Cancel-on-unmount : [`useSearch.ts`](https://github.com/Sojeremy/documentation-skillswap/blob/main/frontend/src/hooks/useSearch.ts) (202 LOC, AbortController)
- ADR couplé : [ADR-011 Socket.IO](./011-socket-io.md) (architecture push qui rend TanStack Query redondante)

---

[← Retour à l'index](./index.md)
