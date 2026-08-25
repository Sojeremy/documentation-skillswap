# Cas d'utilisation et arborescence — reconstruction déterministe

**Date** : 25 août 2026 · **Dépôt de référence** : `~/Desktop/projet-skillswap`
(livrable d'équipe certifié), consulté en **lecture seule**.

Ces figures remplacent `docs/uml/user/use-cases.png` et
`docs/uml/user/arborescence.png`. Mêmes règles que pour les niveaux C3 et C4 :
chaque élément adossé à un fichier et une ligne, aucune inférence.

---

## 1. Règle appliquée

> **Un cas d'utilisation par route réellement montée, une contrainte d'accès par
> middleware réellement appliqué.** Aucun cas d'usage sans route correspondante.

Périmètre : les routes montées sur `/api/v1` par `backend/src/app.ts:32`
(`app.use('/api/v1', apiRouter)`), à travers les huit préfixes de
`routers/index.router.ts:13-20`.

**Deux acteurs, et deux seulement.** `backend/prisma/schema.prisma:56-58`
déclare `enum RoleOfUser { Membre }` — une seule valeur. Le seed de production
crée un rôle unique (`models/seeding.ts:31`, confirmé l. 140 : `1 role created`).
**Il n'existe pas d'administrateur dans le modèle de données.** Le *Visiteur*
n'est pas un rôle mais l'absence d'authentification : côté frontend l'absence du
cookie `refreshToken` (`middleware.ts:15-16`), côté API l'absence de `checkAuth`.

---

## 2. Les 37 routes, avec leur chaîne de middlewares

Deux routes sont montées hors du routeur applicatif et ne figurent pas dans ce
décompte : `GET /api/v1/health` (`app.ts:28`) et le service statique
`/avatars` (`app.ts:26`).

### 2.1 `/api/v1/auth` — 5 routes

| Méthode et chemin | Middlewares | Accès | Source |
|---|---|---|---|
| `POST /register` | `validate('body')` | **public** | `auth.router.ts:14` |
| `POST /login` | `validate('body')` | **public** | `:15` |
| `POST /logout` | — | **public** | `:16` |
| `POST /refresh` | — | **public** | `:17` |
| `GET /me` | `checkAuth` | membre | `:18` |

### 2.2 `/api/v1/profiles` — 14 routes

| Méthode et chemin | Middlewares | Accès | Source |
|---|---|---|---|
| `PATCH /avatar` | `checkAuth`, `uploadAvatar.single` | membre | `profile.router.ts:35-40` |
| `DELETE /avatar` | `checkAuth` | membre | `:42` |
| `POST /skills` | `checkAuth`, `validate` | membre | `:43-48` |
| `POST /interests` | `checkAuth`, `validate` | membre | `:50-55` |
| `POST /availabilities` | `checkAuth`, `validate` | membre | `:57-62` |
| `PATCH /password` | `checkAuth`, `validate` | membre | `:64-69` |
| `DELETE /` | `checkAuth` | membre | `:71` |
| `GET /public/:id` | `parseNumericParams` | **public** | `:75` |
| `GET /:id` | `checkAuth`, `parseNumericParams` | membre | `:77` |
| `PATCH /:id` | `checkAuth`, `parseNumericParams`, **`isOwner`** | membre propriétaire | `:79-85` |
| `POST /:id/rating` | `checkAuth`, `parseNumericParams`, `validate`, **`requireFollow`** | membre suivant la cible | `:87-94` |
| `DELETE /skills/:id` | `checkAuth`, `parseNumericParams` | membre | `:96-101` |
| `DELETE /interests/:id` | `checkAuth`, `parseNumericParams` | membre | `:103-108` |
| `DELETE /availabilities/:id` | `checkAuth`, `parseNumericParams` | membre | `:110-115` |

### 2.3 `/api/v1/conversations` — 9 routes

| Méthode et chemin | Middlewares | Accès | Source |
|---|---|---|---|
| `GET /` | `checkAuth` | membre | `conv.router.ts:30` |
| `POST /` | `validate`, `checkAuth`, **`requireSimpleFollow`** | membre suivant le destinataire | `:32-38` |
| `GET /:id` | `validate`, `checkAuth` | membre | `:40-45` |
| `DELETE /:id` | `validate`, `checkAuth` | membre | `:47-52` |
| `GET /:id/messages` | `validate` ×2, `checkAuth` | membre | `:56-62` |
| `POST /:id/messages` | `validate` ×2, `checkAuth` | membre | `:64-70` |
| `PATCH /:id/message/:messageId` | `validate` ×2, `checkAuth` | membre | `:72-78` |
| `DELETE /:id/message/:messageId` | `validate`, `checkAuth` | membre | `:80-85` |
| `PATCH /:id/close` | `validate`, `checkAuth` | membre | `:86-91` |

### 2.4 Les quatre autres préfixes — 9 routes

| Méthode et chemin | Middlewares | Accès | Source |
|---|---|---|---|
| `GET /follows/followers` | `checkAuth` | membre | `follow.router.ts:81` |
| `GET /follows/following` | `checkAuth` | membre | `:82` |
| `POST /follows/:id/follow` | `checkAuth`, `parseNumericParams` | membre | `:83` |
| `DELETE /follows/:id/follow` | `checkAuth`, `parseNumericParams` | membre | `:84-89` |
| `GET /categories/top-rated` | `validate('query')` | **public** | `category.router.ts:34-38` |
| `GET /skills/` | `checkAuth` | membre | `skill.router.ts:45` |
| `GET /availabilities/` | `checkAuth` | membre | `availability.router.ts:25` |
| `GET /search/` | `checkAuth`, `validate('query')` | membre | `search.router.ts:59-64` |
| `GET /search/top-rated` | `validate('query')` | **public** | `:66` |

### 2.5 Synthèse

| | Nombre |
|---|---|
| Routes montées sur `/api/v1` | **37** |
| dont **publiques** (aucun `checkAuth`) | **7** |
| dont réservées au membre | **30** |
| Contraintes métier au-delà de `checkAuth` | **3** — `isOwner`, `requireFollow`, `requireSimpleFollow` |

Répartition des sept routes publiques : les quatre routes d'authentification
(`register`, `login`, `logout`, `refresh`), plus `GET /profiles/public/:id`,
`GET /categories/top-rated` et `GET /search/top-rated`.

### 2.6 Un middleware déclaré et jamais utilisé

`requireMutualFollow` est exporté par `conv.middleware.ts:48-76` et **importé
par aucun routeur** :

```
$ grep -rn "requireMutualFollow" backend/src --include=*.ts | grep -v conv.middleware.ts
(aucun résultat)
```

C'est du code mort. La distinction compte pour la suite : le middleware
réellement appliqué à l'évaluation est `requireFollow`, qui vérifie un lien
**unidirectionnel** — `followerId: connectedUser, followedId: targetId`
(`conv.middleware.ts:32-37`).

---

## 3. Écarts avec `use-cases.png`

Comparaison faite sur la **source PlantUML embarquée dans le PNG** (chunk
`iTXt` `plantuml`, 232 lignes, directive `@startuml UC_SkillSwap_Complet`) —
donc le texte qui a réellement produit l'image.

### 3.1 Vue d'ensemble

| | Figure actuelle | Reconstruction |
|---|---|---|
| Cas d'usage déclarés | **49** | **37**, un par route |
| Acteurs | 2 — Visiteur, Membre | 2, identiques |
| Chemin, méthode HTTP | aucun | sur chaque cas |
| Contrainte d'accès | aucune | le middleware réellement appliqué |
| Police effective à 152 mm | **2,1 pt** | **9,1 à 14,6 pt** |

### 3.2 Cas d'usage sans route correspondante

Douze des quarante-neuf cas ne correspondent à aucune route. Ce sont pour la
plupart des sous-étapes d'interface reliées en `<<include>>`, qui décrivent un
écran et non un service.

| Cas d'usage de la figure | Ce que le code montre |
|---|---|
| « Voir le concept » | aucune route, aucun écran |
| « Voir les catégories » | sous-étape de la landing ; la route `GET /categories/top-rated` existe mais n'est pas ce cas |
| « Renseigner ses informations » | corps de `POST /auth/register` |
| **« Accepter les CGU »** | **aucune trace** : ni champ dans `validation/auth.validation.ts`, ni route, ni page |
| « Saisir ses identifiants » | corps de `POST /auth/login` |
| « Rédiger sa biographie » | champ de `PATCH /profiles/:id` |
| **« Définir le niveau »** | **aucun champ de niveau** : `model UserHasSkill` (`schema.prisma:75-85`) ne porte que `userId` et `skillId` ; aucune occurrence de `level`, `niveau` ou `proficiency` dans le schéma |
| « Saisir un mot-clé », « Filtrer par catégorie », « Voir les résultats » | paramètres de `GET /search` |
| « Voir ses compétences », « Voir ses disponibilités », « Voir sa note moyenne » | champs de la réponse de `GET /profiles/:id` |
| « Donner une note », « Écrire un commentaire » | champs du corps de `POST /profiles/:id/rating` |

### 3.3 L'écart de fond : la contrainte d'évaluation

| | |
|---|---|
| **Ce qu'affirme la figure** | « Évaluer un membre **(suivi mutuel requis)** » |
| **Ce que montre le code** | `profile.router.ts:92` applique `requireFollow({ source: 'params', field: 'id', allowSelf: false })`, qui interroge `prisma.follow.findFirst({ where: { followerId: connectedUser, followedId: targetId } })` — `conv.middleware.ts:32-37`. **Un seul sens.** Il suffit de suivre la personne pour la noter ; la réciproque n'est pas exigée. |
| **Aggravant** | `requireMutualFollow`, qui ferait exactement ce que la figure annonce, existe en `conv.middleware.ts:48-76` mais n'est **jamais importé**. La figure décrit une règle de sécurité qui n'est pas celle du produit. |

### 3.4 Routes sans cas d'usage

Six routes réelles n'apparaissent nulle part dans la figure :

| Route | Source |
|---|---|
| `POST /auth/refresh` | `auth.router.ts:17` |
| `GET /auth/me` | `:18` |
| `DELETE /profiles/avatar` | `profile.router.ts:42` |
| `PATCH /conversations/:id/message/:messageId` | `conv.router.ts:72-78` — la figure ne connaît que la suppression d'un message |
| `GET /skills/` | `skill.router.ts:45` |
| `GET /availabilities/` | `availability.router.ts:25` |

### 3.5 Écart de représentation

La figure n'indique **aucune méthode HTTP, aucun chemin, aucune contrainte
d'accès**. Rien n'y distingue une route publique d'une route sous `checkAuth` :
la seule séparation est « Zone Visiteur » / « Zone Membre », qui range les cas
par acteur supposé et non par garde effective. Les sept routes publiques et les
trois contraintes métier — `isOwner`, `requireFollow`, `requireSimpleFollow` —
sont invisibles.

C'est aussi ce qui explique les 2 863 px de large : quarante-neuf ellipses et
onze rectangles imbriqués, rendus à 152 mm, soit **5,3 % de la taille source**.

---

## 4. Arborescence

### 4.1 Une figure sans source

`docs/uml/user/arborescence.png` est la **seule figure du dossier qui n'existe
qu'en PNG**. Elle ne porte aucun chunk `plantuml` — ses seuls chunks texte sont
`srgb`, `gamma` et `dpi` — donc elle n'a pas été produite par PlantUML et n'est
pas régénérable. C'est aussi la seule des six figures d'origine à être
identique bit à bit entre le dépôt de documentation et le livrable d'équipe
(md5 `e182551c…`).

### 4.2 Les sept routes réelles

Relevé exhaustif des `page.tsx` de `frontend/src/app/` :

| Route rendue | Fichier | Groupe | Zone selon `middleware.ts` |
|---|---|---|---|
| `/` | `app/page.tsx` | — | **publique** |
| `/profil/[id]` | `app/(app)/profil/[id]/page.tsx` | `(app)` | **publique** |
| `/connexion` | `app/(auth)/connexion/page.tsx` | `(auth)` | auth (l. 9) |
| `/inscription` | `app/(auth)/inscription/page.tsx` | `(auth)` | auth (l. 9) |
| `/recherche` | `app/(app)/recherche/page.tsx` | `(app)` | membre (l. 6) |
| `/conversation` | `app/(app)/conversation/page.tsx` | `(app)` | membre (l. 6) |
| `/mon-profil` | `app/(app)/mon-profil/page.tsx` | `(app)` | membre (l. 6) |

Les deux groupes de routes `(app)` et `(auth)` sont des parenthèses de
regroupement : ils n'apparaissent pas dans l'URL. **Le groupe ne détermine pas
la protection** — `/profil/[id]` est rangé sous `(app)` mais reste public,
parce qu'il est absent de `protectedRoutes` (`middleware.ts:6`) et que le
commentaire de la ligne 5 documente ce choix : « `/profil` est PUBLIC pour le
SEO ». C'est la distinction que la reconstruction porte visuellement : les
zones sont établies sur ce que le middleware **protège réellement**, pas sur
l'intention de rangement.

Hors matcher (`middleware.ts:43-53`) : `app/robots.ts` et `app/sitemap.ts`,
ainsi que `api`, `_next/static`, `_next/image`, `favicon.ico` et tout chemin
comportant un point.

### 4.3 Écarts avec `arborescence.png`

Les nœuds de la figure actuelle, relevés sur le rendu :

| Nœud de la figure | Existe dans le code ? |
|---|---|
| `/ (Landing)` | **oui** — `app/page.tsx` |
| `/auth` | non — aucun segment `auth` dans l'URL ; `(auth)` est un groupe, invisible |
| `/auth/login` | non — la route est `/connexion` |
| `/auth/register` | non — la route est `/inscription` |
| `/profile/edit` | non — la route est `/mon-profil` |
| `/search` | non — la route est `/recherche` |
| `/profile/[id]` | non — la route est `/profil/[id]` |
| `/conversations` | non — la route est `/conversation`, au singulier |
| `/conversations/[id]` | **non** — aucune route dynamique de conversation |
| `/conversations/[id]/messages` | **non** |
| `/conversations/[id]/rating` | **non** |

**Un nœud sur onze correspond à une route réelle.** Les dix autres décrivent un
schéma d'URL anglophone et hiérarchique qui n'a jamais été implémenté : le
produit livré utilise des URL francophones et plates, et la conversation
sélectionnée est portée par l'état du composant, pas par un segment d'URL.

Trois écarts de nature s'y ajoutent :

1. **Le classement des zones est faux sur un point décisif.** La figure place
   `/profile/[id]` dans la zone « member (auth requis) ». La route réelle
   `/profil/[id]` est **publique**, délibérément, pour l'indexation. C'est
   l'inverse de ce que la figure affirme.
2. **Trois routes de conversation dessinées n'existent pas.**
   `/conversations/[id]`, `/conversations/[id]/messages` et
   `/conversations/[id]/rating` — cette dernière étiquetée « flow » — n'ont
   aucun `page.tsx`.
3. **La légende du dossier hérite de l'erreur.** Elle mentionne une « page CGU »
   et des « mentions légales » parmi les écrans publics : aucun fichier, aucune
   route, aucun champ CGU nulle part dans le code.

---

## 5. Rendu — mesures

Même méthode qu'aux sections précédentes : la police effective est fixée par le
plus petit texte du SVG. Boîtes cibles avec les marges actuelles :
**portrait 160 × 244 mm**, **paysage 247 × 157 mm**.

| Diagramme | Source | Orientation | Rendu | Police |
|---|---|---|---|---|
| `uc1-acces-compte` | 556 × 1 064 px | portrait | 127,5 × 244,0 mm | **9,10 pt** |
| `uc2-profil` | 438 × 910 px | portrait | 117,4 × 244,0 mm | **10,64 pt** |
| `uc3-social-decouverte` | 643 × 966 px | portrait | 160,0 × 240,4 mm | **9,87 pt** |
| `uc4-messagerie-rest` | 552 × 927 px | portrait | 145,3 × 244,0 mm | **10,45 pt** |
| `uc5-messagerie-temps-reel` | 434 × 484 px | portrait | 160,0 × 178,4 mm | **14,63 pt** |
| `arborescence` | 1 057 × 550 px | **paysage** | 247,0 × 128,5 mm | **9,27 pt** |

**Ratio de réduction : 0,643** pour les six, comme pour tous les diagrammes
reconstruits. À comparer aux **0,053** de `use-cases.png`.

### 5.1 Le découpage des cas d'utilisation

Trente-sept cas d'usage ne tiennent pas sur une page. Le découpage suit les
domaines, comme pour l'ERD, et se cale sur les préfixes de routeur :

| Vue | Domaine | Routes |
|---|---|---|
| 1/5 | accès public, authentification, compte | 10 |
| 2/5 | gestion de son profil | 9 |
| 3/5 | découverte et social | 9 |
| 4/5 | messagerie REST | 9 |
| 5/5 | messagerie temps réel | 4 events |

Les 37 routes se répartissent sur les vues 1 à 4 ; la vue 5/5 porte les quatre
events Socket.IO, qui ne sont pas des routes REST et ne sont pas gardés par
`checkAuth` mais par `io.use` (`realtime/socket.ts:88-122`). Ils figurent en
zone distincte pour cette raison.

**Un constat de méthode, mesuré.** Sur la vue 2/5, raccourcir le titre du
diagramme a fait passer la largeur de 747 à 438 px — le titre, et non les
ellipses, fixait la largeur minimale. Les titres des six figures ont été
raccourcis en conséquence.

---

## 6. Inventaire

| Fichier | Remplace |
|---|---|
| `uc1-acces-compte.puml` / `.svg` | `docs/uml/user/use-cases.png` (1/5) |
| `uc2-profil.puml` / `.svg` | idem (2/5) |
| `uc3-social-decouverte.puml` / `.svg` | idem (3/5) |
| `uc4-messagerie-rest.puml` / `.svg` | idem (4/5) |
| `uc5-messagerie-temps-reel.puml` / `.svg` | idem (5/5) |
| `arborescence.puml` / `.svg` | `docs/uml/user/arborescence.png` |
| `TRACABILITE.md` | ce document |

Rendu, identique pour les six :

```bash
cd docs/uml/_reconstruits
docker run --rm -v "$PWD:/data" -w /data plantuml/plantuml -tsvg <fichier>.puml
```

Aucun fichier `.typ` n'a été modifié. Le dépôt d'équipe est intact.

---

## 7. Phase 5 — parcours utilisateur et MCD

**Ajout du 25 août 2026.**

### 7.1 User-flow — une hypothèse invalidée d'entrée

J'attendais que `user-flow.png` porte les mêmes routes anglophones que
`arborescence.png`, puisqu'elles partagent leurs sources. **C'est faux.** La
source embarquée dans le PNG (chunk `iTXt`, 88 lignes, directive
`@startuml userflow`) utilise les routes françaises réelles :
`/connexion`, `/inscription`, `/recherche`, `/profil/[id]`, `/mon-profil`,
`/conversation`. Elle nomme même correctement les groupes `(auth)/` et `(app)/`
et cite `middleware.ts`.

Cette figure est donc, de loin, la plus juste des six d'origine.

### 7.2 Transitions vérifiées une à une

| Transition de la figure | Verdict | Source |
|---|---|---|
| `home --> login` / `register` | conforme | `HeroSection.tsx:47` |
| `home --> search` | conforme | `HeroSection.tsx:50`, `CategoriesSection.tsx:91`, `MembersSection.tsx:103` |
| `home --> profile_public` | conforme | teaser SEO |
| `profile_public --> login` « CTA inscription / connexion » | conforme, et plus précis dans le code : `?redirect=<pathname>` | `ProfileTeaser.tsx:38-39` |
| `login --> search` « redirect=/recherche (ou ?redirect=…) » | **conforme** | `connexion/page.tsx:18` puis `:28` — `searchParams.get('redirect') \|\| '/recherche'` |
| `register --> search` « succès → redirect=/recherche » | **FAUX** | `inscription/page.tsx:41` — `window.location.href = '/mon-profil'`, en dur. Le paramètre `redirect` n'est **jamais lu** à l'inscription. |
| `search --> profile_full` | conforme | — |
| `profile_full --> profile_edit` « si propriétaire » | conforme | `ProfileHeader.tsx:68` |
| `profile_full --> conversation` | conforme | `ProfileFull.tsx:164` puis `:170` |
| `conversation --> rating` | conforme | dialog post-clôture |
| garde middleware | conforme | `middleware.ts:27-30` |

**Un écart de fond, trois transitions manquantes.**

L'écart : à l'inscription, la destination est `/mon-profil`, pas `/recherche`.
La conséquence n'est pas cosmétique — un visiteur qui arrive sur un profil
public, clique « s'inscrire » et reçoit `/inscription?redirect=/profil/12`
(`ProfileTeaser.tsx:39`) atterrit sur `/mon-profil` : **sa destination est
perdue**. Le paramètre est produit mais jamais consommé.

Les trois transitions absentes de la figure :

| Transition | Source |
|---|---|
| déconnexion → `/` | `Header/index.tsx:34` |
| suppression de compte → `/inscription` | `useAccount.ts:44` |
| conversation créée → `/conversation?id=<id>` | `ProfileFull.tsx:170` — l'identifiant passe par la *query string*, pas par un segment d'URL |

### 7.3 MCD — réagencement : ce que la mesure impose

Objectif : réduire les croisements et regrouper les cinq domaines de §6.4.1,
**sans toucher au contenu**. Les croisements sont comptés par intersection
géométrique des pattes dans le SVG, extrémités communes exclues.

| Agencement | Croisements | Dimensions | Portrait | Paysage |
|---|---|---|---|---|
| **Actuel** (6 rangées × 3 colonnes) | 10 | 404 × 765 px | **10,85 pt** ✓ | 6,98 pt |
| `mocodo -t arrange` (auto) | **6** | 810 × 599 px | 6,72 pt | 8,92 pt ✘ |
| `-t arrange:3` | 6 | 799 × 626 px | 6,81 pt | 8,53 pt ✘ |
| `-t arrange:4` | 7 | 719 × 617 px | 7,57 pt | 8,66 pt ✘ |
| `-t arrange:5` | 6 | 673 × 635 px | 8,09 pt | 8,41 pt ✘ |
| Manuel, 11 rangées, domaines groupés | 8 | 427 × 1 093 px | 7,59 pt ✘ | 4,89 pt |
| **Manuel, 7 rangées, domaines groupés** *(retenu)* | 10 | 434 × 787 px | **10,55 pt** ✓ | 6,79 pt |

**Aucun agencement ne satisfait les deux objectifs à la fois.** La raison est
structurelle : Mocodo fixe la police des cardinalités à **12 px**, contre 14 px
pour les diagrammes C4. Le canevas admissible à 9 pt tombe donc à
**605 × 922 px en portrait** et 933 × 593 px en paysage. Or tout agencement qui
réduit les croisements rend le diagramme *carré* — entre 673 et 810 px de côté —
et un carré de cette taille ne tient dans aucune des deux boîtes.

L'agencement automatique échoue de peu : 810 × 599 px, soit 6 px de trop en
hauteur pour la boîte paysage. Trois leviers ont été essayés sans effet sur ce
point : `arrange:3/4/5` (contrainte de largeur), `--adjust_width` (0,95 et 0,90 —
la largeur descend à 739 px, la hauteur reste à 599) et `--gutters`, qui ne
concerne pas l'espacement mais la visibilité des gouttières latérales.

**Retenu** : l'agencement manuel à 7 rangées. Il n'améliore pas le compte de
croisements — 10, comme l'actuel — mais il atteint le second objectif : les cinq
domaines sont groupés spatialement, de haut en bas *Compétences*, *Identité*,
*Social*, *Disponibilités*, *Échange*, avec `user` au centre. Le coût en
lisibilité est de 0,30 pt (10,85 → 10,55), soit 3 %.

Si la priorité est le nombre de croisements plutôt que le groupement, l'agencement
automatique les fait passer de 10 à 6, mais il faut alors accepter 8,92 pt —
sous le seuil que toutes les autres figures du dossier respectent.

### 7.4 Diff de contenu — vérification exigée

Comparaison sémantique, et non relecture : les deux fichiers `.mcd` sont
analysés et comparés comme ensembles d'entités (nom + attributs) et
d'associations (nom + pattes + cardinalités + attributs).

```
$ python3 diff_mcd.py docs/_generated/database/mcd.mcd docs/uml/_reconstruits/mcd.mcd
ENTITÉS      : 7 avant, 7 après   — identiques (noms et attributs)
ASSOCIATIONS : 11 avant, 11 après — identiques (noms, pattes, cardinalités, attributs)

VERDICT : CONTENU STRICTEMENT IDENTIQUE
```

Le réagencement ne porte que sur la position des cellules dans la grille et sur
les commentaires d'en-tête. Les cardinalités particulières sont préservées à
l'identique, y compris le `02` de `participe_à` et le `11` des trois pattes de
`message`.

### 7.5 Mesures de rendu

| Diagramme | Source | Orientation | Rendu | Police |
|---|---|---|---|---|
| `user-flow` | 929 × 689 px | **paysage** | 211,7 × 157,0 mm | **9,04 pt** |
| `mcd` | 434 × 787 px | portrait | 134,6 × 244,0 mm | **10,55 pt** |

Ratio de réduction : 0,643 pour le user-flow (plancher 14 px), 0,750 pour le MCD
(plancher 12 px imposé par Mocodo).

### 7.6 Inventaire ajouté

| Fichier | Remplace |
|---|---|
| `user-flow.puml` / `.svg` | `docs/uml/user/user-flow.png` |
| `mcd.mcd` / `mcd.svg` | réagencement de `docs/_generated/database/mcd.mcd` — contenu identique |

`docs/_generated/database/mcd.mcd` n'a pas été modifié : il reste la dérivation
certifiée du catalogue. Aucun fichier `.typ` n'a été modifié en phase 5. Le
dépôt d'équipe est intact.
