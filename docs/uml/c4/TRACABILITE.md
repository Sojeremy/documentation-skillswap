# Reconstruction C4 de l'architecture SkillSwap — traçabilité et écarts

**Date** : 25 août 2026 · **Nature** : reconstruction déterministe depuis le code
**Dépôt de référence** : `~/Desktop/projet-skillswap` (`O-clock-Dublin/projet-skillswap`),
le livrable d'équipe certifié — consulté en **lecture seule**, `git status --porcelain`
vide avant et après.

Ce document accompagne les quatre diagrammes de `docs/uml/c4/`. Il établit, pour
chaque élément et chaque relation, le fichier et la ligne qui le prouvent, puis
relève les écarts avec la figure `docs/uml/architecture/architecture.png`
actuellement utilisée par le dossier.

---

## 1. Méthode

### 1.1 Sources autorisées

Aucune inférence hors de cette liste. Chaque ligne des tableaux de §4 et §5
renvoie à l'une d'elles.

| Source | Lignes | Ce qu'elle établit |
|---|---|---|
| `devops/docker-compose.prod.yml` | 117 | services, volumes, réseaux, ports |
| `devops/nginx/prod.conf` | 111 | routage, terminaison TLS |
| `backend/src/app.ts` | 34 | routers montés et préfixes |
| `backend/src/realtime/socket.ts` | 446 | serveur Socket.IO, port partagé |
| `backend/config.ts` | 39 | variables d'environnement requises |
| `frontend/src/middleware.ts` | 54 | gardes de routes |
| `devops/backend/Dockerfile.prod` | 36 | image et port du backend |
| `devops/frontend/Dockerfile.prod` | 53 | image et port du frontend |

> **Un écart de chemin sur la liste fournie.** Le fichier de configuration n'est
> pas `backend/src/config.ts` — il n'existe pas — mais **`backend/config.ts`**,
> à la racine du dossier `backend/`. Le chemin est établi par `app.ts:4`
> (`import { config } from '../config.ts'`) et confirmé par
> `socket.ts:6` (`import { config } from '../../config.ts'`). C'est ce fichier,
> et lui seul, qui a été lu.

### 1.2 Outillage

- **PlantUML 1.2026.6**, exécuté par conteneur, image locale `plantuml/plantuml`
  (Graphviz 14.0.1 et JVM Temurin 17 embarqués). Rien n'a été installé.
- **C4-PlantUML 2.14.0beta1**, **vendorisée** dans `lib/` — trois fichiers,
  auto-suffisants (aucun `!includeurl`, aucun sprite distant), donc rendu
  reproductible hors ligne et indépendant de la version que l'image PlantUML
  embarque dans sa stdlib.

| Fichier | Taille | SHA-256 |
|---|---|---|
| `lib/C4.puml` | 68 301 o | `0369025f07c0eccab29b56eeae92e2f760e859b8203d42ee5421c7fcbd251744` |
| `lib/C4_Context.puml` | 21 872 o | `7e0b039f1a669d7fc3d9f26e806e2387327781c92718764902ac30efe479ae47` |
| `lib/C4_Container.puml` | 5 743 o | `219f235cd59307763aa00dfb8667d9c719c1fa1ab3f5e7b36cdc33ae3f363b84` |

Commande de rendu, identique pour les quatre diagrammes :

```bash
cd docs/uml/c4
docker run --rm -v "$PWD:/data" -w /data plantuml/plantuml -tsvg <fichier>.puml
```

### 1.3 Sortie

**SVG**, et non PNG. C'est le seul format vectoriel de la chaîne, donc le seul
insensible au facteur de réduction — et Typst le compile sans réserve
(vérifié : un SVG PlantUML rendu via Kroki compile sans erreur).

---

## 2. Lisibilité : mesures, pas estimations

### 2.1 Méthode de calcul

La police effective d'une figure est fixée par son **plus petit texte**, jamais
par sa moyenne :

```
police effective (pt) = plus petite font-size du SVG (px)
                      × (largeur de rendu en mm ÷ largeur source en px)
                      ÷ 0,35278 mm/pt
```

Les tailles sont lues dans les attributs `font-size` du SVG produit ; les
dimensions dans son `viewBox`. Rien n'est estimé.

Deux boîtes de rendu, sur A4 à marges de 2,5 cm :

| Orientation | Largeur disponible | Hauteur disponible |
|---|---|---|
| **Portrait** | 160 mm (zone de texte) | 230 mm (page pleine, place laissée à la légende) |
| **Paysage** | 230 mm | 160 mm |

*Paysage* désigne une figure pivotée d'un quart de tour sur une page A4 restée
portrait : sa largeur suit alors la hauteur de page. Aucune modification `.typ`
n'a été faite ; ce sont les deux boîtes cibles à retenir pour la phase suivante.

### 2.2 Le plancher de 12 px, et pourquoi il a été relevé

C4-PlantUML rend trois textes à **12 px** quand tout le reste est à 14 px : le
stéréotype (`«container»`), la technologie (`[nginx:alpine]`) et les étiquettes
de relation (`[HTTP/3000]`). Ces 12 px fixaient à eux seuls le facteur de
réduction de la figure entière.

La bibliothèque déclare ces trois tailles avec `?=` (`lib/C4.puml:122-126`),
donc une valeur posée avant l'inclusion l'emporte. `style-skillswap.puml` les
porte à 14 px. Effet sur le canevas admissible, à seuil de lisibilité constant
(9 pt sur 160 mm) :

| Plancher de police | Échelle requise | Canevas maximal en portrait |
|---|---|---|
| 12 px (défaut) | 0,2646 mm/px | 605 × 869 px |
| **14 px (retenu)** | **0,2268 mm/px** | **705 × 1 014 px** |

### 2.3 Le C2 complet ne tient pas — mesure

Un niveau C2 d'un seul tenant compte 10 nœuds et 15 relations.

| Disposition | Dimensions | Portrait | Paysage |
|---|---|---|---|
| C2 complet, disposition par défaut | 1 017 × 1 237 px | **5,35 pt** | **4,40 pt** |
| C2 complet, `LAYOUT_LEFT_RIGHT()` | 1 955 × 833 px | 2,78 pt | 4,00 pt |

Il lui faudrait 269 × 327 mm pour tenir 9 pt : plus qu'une page A4 dans les deux
sens. Conformément à la consigne, il est **découpé et non réduit**, en trois
vues. Les coutures sont explicites : `nginx` relie la vue 1/3 aux vues 3/3,
`backend` relie la vue 1/3 à la vue 2/3.

### 2.4 Résultat mesuré des quatre diagrammes retenus

| Diagramme | Source SVG | Police min | Portrait | Paysage | **Retenu** |
|---|---|---|---|---|---|
| `c1-contexte.svg` | 529 × 861 px | 14 px | **10,60 pt** ✔ | 7,37 pt | **portrait** |
| `c2a-entree-routage.svg` | 610 × 931 px | 14 px | **9,80 pt** ✔ | 6,82 pt | **portrait** |
| `c2b-persistance.svg` | 660 × 474 px | 14 px | 9,62 pt ✔ | **13,40 pt** ✔ | **paysage** |
| `c2c-chaine-tls.svg` | 753 × 658 px | 14 px | 8,43 pt ✘ | **9,65 pt** ✔ | **paysage** |

**Ratio de réduction : 0,643** pour les quatre — la figure est rendue à 64,3 %
de sa taille source. À comparer aux **5,3 %** de `use-cases.png` et aux
**10,9 %** de `architecture.png`.

Le paysage n'est pas un confort : **`c2c-chaine-tls` ne tient pas en portrait**
(8,43 pt) et tient en paysage (9,65 pt). Il fait par ailleurs gagner près de
4 pt à `c2b-persistance` (9,62 → 13,40). Il ne sauve en revanche **pas** le C2
d'un seul tenant, qui est trop haut dans les deux orientations — le découpage
restait nécessaire.

### 2.5 Dimensions de rendu à retenir

| Diagramme | Orientation | Largeur | Hauteur | Police effective |
|---|---|---|---|---|
| `c1-contexte` | portrait | 141,3 mm | 230,0 mm | 10,60 pt |
| `c2a-entree-routage` | portrait | 150,7 mm | 230,0 mm | 9,80 pt |
| `c2b-persistance` | paysage | 222,8 mm | 160,0 mm | 13,40 pt |
| `c2c-chaine-tls` | paysage | 183,1 mm | 160,0 mm | 9,65 pt |

---

## 3. Ce qui n'a pas été mis dans les diagrammes, et pourquoi

La consigne interdit d'inventer un système externe. Trois candidats plausibles
ont été écartés faute de preuve dans les sources autorisées :

| Candidat écarté | Pourquoi |
|---|---|
| Service SMTP / envoi d'e-mails | Aucune variable, aucun hôte, aucun service. `config.ts` n'expose que le port, l'origine CORS, le secret JWT, l'expiration de token et les trois clés Meilisearch. |
| Moteur d'indexation Google / crawler | `middleware.ts:5` porte le commentaire « `/profil` est PUBLIC pour le SEO (Google doit pouvoir indexer les profils) ». C'est un **commentaire d'intention**, pas un appel : aucun code n'appelle un service Google. De plus un crawler appelle le système, il n'est pas appelé par lui. |
| Stockage objet (S3 ou équivalent) | Les avatars sont sur un volume Docker local, `avatars_data` (`docker-compose.prod.yml:16`), servi en statique par le backend (`app.ts:26`). Aucun service distant. |

**PostgreSQL et Meilisearch ne sont pas des systèmes externes** : ce sont des
conteneurs de la pile (`docker-compose.prod.yml:49-65` et `67-79`). Ils
n'apparaissent donc pas en C1, mais en C2.

Il reste **un seul système externe réel** : Let's Encrypt.

---

## 4. Traçabilité — C1, diagramme de contexte

### 4.1 Éléments

| Élément | Type C4 | Source | Ce que la source dit |
|---|---|---|---|
| Visiteur | `Person` | `frontend/src/middleware.ts:15-16` | `isAuthenticated = !!refreshToken` — l'acteur non authentifié est l'absence de ce cookie |
| Membre | `Person` | `frontend/src/middleware.ts:15-16` | même ligne, valeur vraie du booléen |
| SkillSwap | `System` | `devops/docker-compose.prod.yml:3-110` | six services sous un unique projet Compose `skillswap-prod` (ligne 1) |
| Let's Encrypt | `System_Ext` | `devops/docker-compose.prod.yml:105` | `image: certbot/certbot` — client ACME |

### 4.2 Relations

| Relation | Protocole / port | Source | Ce que la source dit |
|---|---|---|---|
| Visiteur → SkillSwap | HTTPS/443 | `devops/nginx/prod.conf:33-34` | `listen 443 ssl http2` sur `skill-swap.fr` |
| Membre → SkillSwap | HTTPS/443 + WebSocket | `nginx/prod.conf:33`, `85-94` | `location /socket.io/` avec `Upgrade` / `Connection "upgrade"` |
| SkillSwap → Let's Encrypt | ACME sur HTTPS/443 | `docker-compose.prod.yml:110` | `while :; do certbot renew; sleep 12h ...` |
| Let's Encrypt → SkillSwap | HTTP/80, `/.well-known/acme-challenge/` | `nginx/prod.conf:21-23` | `location /.well-known/acme-challenge/ { root /var/www/certbot; }` |

---

## 5. Traçabilité — C2, diagramme de conteneurs

### 5.1 Les six services

| Conteneur | Image / technologie | Source | Port |
|---|---|---|---|
| `nginx` | `nginx:alpine` | `docker-compose.prod.yml:81-82` | **publie** 80 et 443 (`:85-87`) |
| `frontend` | Next.js standalone, `node:24` | `frontend/Dockerfile.prod:27,43`, `compose:30-33` | `expose: 3000` (`compose:35-36`), `ENV PORT=3000` (`Dockerfile.prod:50`) |
| `backend` | Express + Socket.IO, `node:24` | `backend/Dockerfile.prod:15`, `compose:4-7` | `expose: 3000` (`compose:9-10`), `EXPOSE 3000` (`Dockerfile.prod:36`) |
| `postgres` | `postgres:16-alpine` | `compose:49-50` | aucun `expose` ni `ports` ; port 5432 par `compose:18` |
| `meilisearch` | `getmeili/meilisearch:v1.6` | `compose:67-68` | `expose: 7700` (`compose:71-72`) |
| `certbot` | `certbot/certbot` | `compose:104-105` | aucun port |

**Un seul service publie des ports vers l'hôte** : `nginx`. Les cinq autres sont
en `expose` ou sans port — injoignables depuis l'extérieur du réseau Compose.
Vérification :

```
$ awk '/^  [a-z_-]+:/{s=$1} /^    (ports|expose):/{print s" "$1}' devops/docker-compose.prod.yml
backend: expose:      frontend: expose:      meilisearch: expose:      nginx: ports:
```

**Aucun bloc `networks:` n'est déclaré** — tout passe par le réseau par défaut
du projet Compose.

### 5.2 Les cinq volumes

| Volume | Monté dans | Chemin conteneur | Mode | Source |
|---|---|---|---|---|
| `avatars_data` | `backend` | `/app/public/avatars` | rw | `compose:16` ; servi par `app.ts:26` |
| `postgres_data` | `postgres` | `/var/lib/postgresql/data` | rw | `compose:56` |
| `meilisearch_data` | `meilisearch` | `/meili_data` | rw | `compose:79` |
| `certbot_www` | `nginx` / `certbot` | `/var/www/certbot` | **ro** / rw | `compose:90` / `compose:108` |
| `certbot_conf` | `nginx` / `certbot` | `/etc/letsencrypt` | **ro** / rw | `compose:91` / `compose:109` |

Déclarés en bloc `volumes:` (`compose:112-117`).

### 5.3 Relations, vue 1/3 — entrée et routage

| Relation | Protocole / port | Source | Ce que la source dit |
|---|---|---|---|
| Visiteur → nginx | HTTPS/443 | `prod.conf:33-34` | `listen 443 ssl http2` |
| — redirection | HTTP/80 → 301 | `prod.conf:16-17, 26-28` | `listen 80` puis `return 301 https://$server_name$request_uri` |
| Membre → nginx | HTTPS/443 + WebSocket | `prod.conf:33`, `85-89` | en-têtes `Upgrade` sur `/socket.io/` |
| nginx → frontend | HTTP/3000 | `prod.conf:5-8`, `59-60` | `upstream frontend { server frontend:3000; }` ; `location / { proxy_pass http://frontend; }` |
| nginx → frontend (statiques) | HTTP/3000 | `prod.conf:97-103` | `location ~* \.(js\|css\|png\|…)$ { proxy_pass http://frontend; }` |
| nginx → backend | HTTP/3000, `/api/` | `prod.conf:10-13`, `72-73` | `upstream backend { server backend:3000; }` ; `location /api/ { proxy_pass http://backend; }` |
| nginx → backend | WebSocket/3000, `/socket.io/` | `prod.conf:85-94` | `proxy_pass http://backend/socket.io/` + `Upgrade` |
| frontend → backend | **HTTP/3000**, interne, hors Nginx | `page.tsx:60`, `:82`, `profil/[id]/page.tsx:64`, `sitemap.ts:34` | fetch au rendu serveur, ISR 3 600 s, vers `INTERNAL_API_URL` = `http://backend:3000` (`devops/.env.prod.example:27`) |
| — ordre de démarrage | `depends_on` | `compose:41-42` | forme courte, sans condition |

> **Correction du 25 août 2026 — cette ligne disait le contraire.**
>
> La première rédaction de ce tableau affirmait qu'**aucun appel HTTP du frontend
> vers le backend n'était attesté**, et l'arête ne portait sur le diagramme que
> l'étiquette « Démarrage seulement / `depends_on` ».
>
> **Le périmètre qui avait produit ce constat.** Les sources autorisées pour la
> reconstruction (§1.1) ne comportaient, côté frontend, que
> `frontend/src/middleware.ts` — retenu pour les gardes de routes. Ce fichier
> n'émet effectivement aucune requête : il lit un cookie et redirige
> (`middleware.ts:27-37`). Dans ce périmètre, le constat était exact, et la seule
> trace d'un lien frontend → backend était le `depends_on` de `compose:41-42`.
>
> **Ce que l'élargissement à `frontend/src/` a révélé.** Trois fichiers émettent
> des requêtes au rendu serveur, en ISR 3 600 s :
>
> | Fichier:ligne | Requête |
> |---|---|
> | `frontend/src/app/page.tsx:60` | `GET /api/v1/search/top-rated?limit=6` |
> | `frontend/src/app/page.tsx:82-83` | `GET /api/v1/categories/top-rated?limit=8` |
> | `frontend/src/app/(app)/profil/[id]/page.tsx:64` | `GET /api/v1/profiles/public/${id}` |
> | `frontend/src/app/sitemap.ts:34-35` | `GET /api/v1/search/top-rated?limit=1000` |
>
> Les trois résolvent leur URL par la même chaîne de repli —
> `INTERNAL_API_URL || NEXT_PUBLIC_API_URL || 'http://localhost:3000'`
> (`page.tsx:27-30`, `profil/[id]/page.tsx:33-36`, `sitemap.ts:4-7`) — et
> `INTERNAL_API_URL` vaut **`http://backend:3000`** en production
> (`devops/.env.prod.example:27`, injecté par `env_file` en `compose:37-38`).
> L'ISR est déclaré au niveau page en `page.tsx:33` et `profil/[id]/page.tsx:39`.
>
> **Conséquence sur le modèle.** Deux chemins distincts atteignent l'API : le
> navigateur par Nginx en HTTPS, et le conteneur frontend en HTTP direct sur le
> réseau Compose, hors proxy. L'arête de la vue 1/3 porte désormais « Rendu
> serveur ISR (3 600 s) : landing, profils publics, sitemap / HTTP/3000 interne,
> hors Nginx ». Le `depends_on` de `compose:41-42` n'est donc pas un simple ordre
> de confort : le frontend a réellement besoin du backend au rendu.
>
> **Réserve.** Le `.env.docker` réellement déployé n'est pas dans le dépôt ; seuls
> `devops/.env.docker.example:31` et `devops/.env.prod.example:27` y figurent, et
> tous deux portent `http://backend:3000`. Si `INTERNAL_API_URL` était laissée
> vide, la chaîne de repli passerait à `NEXT_PUBLIC_API_URL`, soit
> `https://skill-swap.fr` — et le trafic ressortirait alors par Nginx.

**Le port partagé.** `socket.ts:74-85` — `initSocket(httpServer: HttpServer)`
construit `new Server(httpServer, …)` : Socket.IO se **greffe sur le serveur HTTP
existant** au lieu d'ouvrir un port propre. Le fait est confirmé côté routage :
`prod.conf:10-13` définit un seul upstream `backend:3000`, utilisé aussi bien
par `location /api/` que par `location /socket.io/`.

### 5.4 Relations, vue 2/3 — persistance du backend

| Relation | Protocole / port | Source | Ce que la source dit |
|---|---|---|---|
| backend → postgres | TCP/5432 | `compose:18` | `command: ['wait-for-postgres.sh', 'postgres', '5432', 'node', 'dist/index.js']` |
| — ordre de démarrage | `service_healthy` | `compose:19-21` | attente du healthcheck `pg_isready` (`compose:57-65`) |
| backend → meilisearch | HTTP/7700 | `config.ts:12`, `compose:71-72` | `meilisearchHost: process.env.MEILISEARCH_HOST \|\| 'http://localhost:7700'` ; `expose: '7700'` |
| — ordre de démarrage | `service_started` | `compose:22-23` | condition plus faible que pour postgres |
| backend → `avatars_data` | montage `/app/public/avatars` | `compose:16`, `app.ts:26` | `app.use('/avatars', express.static(path.join(process.cwd(), 'public/avatars')))` |

### 5.5 Relations, vue 3/3 — chaîne TLS

| Relation | Protocole / port | Source | Ce que la source dit |
|---|---|---|---|
| certbot → Let's Encrypt | ACME sur HTTPS/443 | `compose:110` | boucle `certbot renew` toutes les 12 h |
| Let's Encrypt → nginx | HTTP/80 | `prod.conf:21-23` | `location /.well-known/acme-challenge/ { root /var/www/certbot; }` |
| certbot → `certbot_www` | rw | `compose:108` | `- certbot_www:/var/www/certbot` |
| nginx → `certbot_www` | **ro** | `compose:90` | `- certbot_www:/var/www/certbot:ro` |
| certbot → `certbot_conf` | rw | `compose:109` | `- certbot_conf:/etc/letsencrypt` |
| nginx → `certbot_conf` | **ro** | `compose:91`, `prod.conf:37-38` | `ssl_certificate /etc/letsencrypt/live/skill-swap.fr/fullchain.pem` |

### 5.6 API montée par le backend — `app.ts`

Non représenté au niveau C2 (c'est du C3), mais relevé parce qu'il établit le
préfixe unique porté par le routage nginx :

| Élément | Ligne | Contenu |
|---|---|---|
| CORS | `app.ts:12-17` | `origin: config.allowedOrigin`, `credentials: true` |
| Statique avatars | `app.ts:26` | `/avatars` → `public/avatars` |
| Health check | `app.ts:28-30` | `GET /api/v1/health` |
| Routeur applicatif | `app.ts:32` | `app.use('/api/v1', apiRouter)` — **préfixe unique** |
| Gestionnaire d'erreurs | `app.ts:34` | `errorHandler`, monté en dernier |

`nginx/prod.conf:72` route `location /api/` : plus large que `/api/v1`, mais
cohérent — tout `/api/*` atterrit sur le backend.

### 5.7 Variables d'environnement — `backend/config.ts`

| Variable | Ligne | Défaut | Obligatoire en production ? |
|---|---|---|---|
| `PORT` ou `API_PORT` | `config.ts:4` | `3000` | non |
| `ALLOWED_ORIGIN` | `config.ts:5` | `*` en dev | **oui** — `getEnv` lève (`config.ts:38`) |
| `JWT_SECRET` | `config.ts:6-10` | `dev-only-insecure-secret` en dev | **oui** |
| `TOKEN_EXPIRE` | `config.ts:11` | `3600` en dev | **oui** |
| `MEILISEARCH_HOST` | `config.ts:12` | `http://localhost:7700` | non |
| `MEILI_MASTER_KEY` | `config.ts:13` | `''` | non |
| `MEILI_API_KEY` | `config.ts:14` | `''` | non |
| `NODE_ENV` | `config.ts:1` | — | posé à `production` par `compose:14` |

Le mécanisme est explicite : `getEnv` (`config.ts:22-39`) accepte une valeur par
défaut **hors production** et lève une erreur au démarrage sinon. Trois variables
sont donc bloquantes en production : `ALLOWED_ORIGIN`, `JWT_SECRET`,
`TOKEN_EXPIRE`.

> **Constat.** `DATABASE_URL` **n'apparaît pas dans `config.ts`** — la chaîne de
> connexion échappe entièrement au module de configuration et à son contrôle de
> présence au démarrage. La seule trace dans les sources autorisées est
> `compose:18`, qui donne l'hôte `postgres` et le port `5432` en arguments du
> script d'attente. Les trois clés Meilisearch, elles, ont un défaut vide et ne
> sont pas contrôlées non plus : un backend de production démarre sans elles.

---

## 6. Écarts entre `architecture.png` et ce que le code montre

La comparaison porte sur la **source embarquée dans le PNG** (chunk `iTXt`
`plantuml`, 120 lignes), c'est-à-dire le texte qui a réellement produit l'image
— pas sur un `.puml` du dépôt, qui pourrait en différer.

### 6.1 Écarts de fait

| # | Ce que `architecture.png` affirme | Ce que le code montre | Preuve |
|---|---|---|---|
| 1 | `ChatUI <--> SocketServer : WebSocket` — le client Socket.IO parle **directement** au backend, hors de la gateway | Tout le WebSocket passe par nginx | `prod.conf:85-94` route `/socket.io/` vers l'upstream `backend:3000` ; le backend n'a **aucun port publié** (`compose:9-10`, `expose` et non `ports`) — il est injoignable depuis l'extérieur |
| 2 | Aucune terminaison TLS, aucun port, aucun certificat | HTTPS obligatoire, redirection 80 → 443, certificat Let's Encrypt | `prod.conf:33` (`listen 443 ssl http2`), `:37-38` (chemins des certificats), `:26-28` (301), `compose:85-87` (`80:80`, `443:443`) |
| 3 | La gateway fait du **« Rate limiting »** | Aucune directive de limitation | `grep -nE "limit_req\|limit_conn\|limit_rate" devops/nginx/prod.conf` → **aucun résultat** |
| 4 | Les acteurs atteignent les pages du frontend directement, via des composants `[Public]` / `[Private]` | Le frontend est lui aussi derrière nginx | `prod.conf:59-60` — `location / { proxy_pass http://frontend; }` |
| 5 | `[Public]` et `[Private]` sont des composants de l'architecture | Ces composants n'existent nulle part | La garde de routes est une liste de chemins dans `middleware.ts:6` et `:9`, pas un composant |
| 6 | « Profile Page » est derrière `[Private]` | `/profil` est **public**, délibérément | `middleware.ts:6` — `protectedRoutes` ne contient que `/recherche`, `/conversation`, `/mon-profil` ; `middleware.ts:5` documente le choix : « `/profil` est PUBLIC pour le SEO » |
| 7 | `Membre -left-> [Visiteur]` — une flèche d'un acteur vers un autre | Aucune relation de ce type n'a de correspondant | Aucune source ne l'établit ; c'est un artefact d'alignement visuel |
| 8 | Le service `certbot` n'apparaît pas | Sixième service de la pile, en boucle permanente | `compose:104-110` |
| 9 | Aucun volume n'apparaît | Cinq volumes nommés, dont deux montés deux fois | `compose:112-117`, montages `:16, 56, 79, 90-91, 108-109` |
| 10 | Aucun protocole ni port sur aucune arête | Chaque arête a un protocole et un port établis | §5.3 à §5.5 ci-dessus |
| 11 | Le stockage des avatars n'apparaît pas | Volume `avatars_data` servi en statique par le backend | `compose:16`, `app.ts:26` |

### 6.2 Écart de méthode

Le douzième écart n'est pas une erreur de fait mais de niveau. `architecture.png`
mélange dans une seule figure :

- des **composants applicatifs** (« Auth Controller », « Search Controller »,
  « API Client (fetch) ») — niveau C3 ;
- des **conteneurs** (« PostgreSQL », « Meilisearch », « Nginx ») — niveau C2 ;
- des **pages** du frontend (« Landing Page (SEO / SSG) », « Searching Page
  (SSR) ») — niveau C3, et sur un axe différent des contrôleurs ;
- des **abstractions inventées** (`[Public]`, `[Private]`) qui n'appartiennent à
  aucun niveau.

C'est ce mélange qui produit les 1 395 × 1 228 px de la figure, donc les
**4,3 pt** effectifs mesurés à 95 % de 160 mm — un texte 2,6 fois plus petit que
le corps du dossier. Les quatre diagrammes de ce dossier tiennent chacun un seul
niveau, ce qui est la condition pour qu'ils tiennent aussi sur une page.

### 6.3 Ce que `architecture.png` a de juste

Par équité, et parce que la reconstruction le confirme :

- l'existence des cinq briques principales — frontend, gateway, backend,
  PostgreSQL, Meilisearch ;
- l'indexation Meilisearch pilotée par le backend, cohérente avec les trois clés
  de `config.ts:12-14` ;
- la coexistence REST + WebSocket dans le backend, notée sur l'arête
  `SocketServer --> MessageAPI : routes REST coexistantes` — juste sur le fond,
  mais sans le fait essentiel qu'il s'agit du **même port**.

---

## 7. Inventaire des livrables

| Fichier | Rôle |
|---|---|
| `style-skillswap.puml` | plancher de police à 14 px, inclus par les quatre diagrammes |
| `c1-contexte.puml` / `.svg` | C4 niveau 1 — contexte |
| `c2a-entree-routage.puml` / `.svg` | C4 niveau 2, vue 1/3 |
| `c2b-persistance.puml` / `.svg` | C4 niveau 2, vue 2/3 |
| `c2c-chaine-tls.puml` / `.svg` | C4 niveau 2, vue 3/3 |
| `lib/C4*.puml` | C4-PlantUML 2.14.0beta1 vendorisée |
| `TRACABILITE.md` | ce document |

Aucun fichier `.typ` n'a été modifié. Le dépôt d'équipe est intact.

---

## 8. Niveaux C3 et C4 — traçabilité

**Ajout du 25 août 2026.** Même contrat que le C2 : chaque composant et chaque
relation adossés à un fichier et une ligne, aucune inférence, sources dans le
dépôt d'équipe consulté en lecture seule.

### 8.1 Le recoupement dependency-cruiser

La configuration n'est pas dans le dépôt — elle est dans l'outillage jetable
hors dépôt, `~/Desktop/skillswap-audit/tooling/depcruise.config.cjs`, avec
dependency-cruiser **18.1.1** installé au même endroit. Elle a été **rejouée**
sur le dépôt d'équipe, sortie dans `/tmp`, aucune écriture :

```bash
cd ~/Desktop/projet-skillswap
depcruise backend/src backend/config.ts backend/index.ts \
  --config ~/Desktop/skillswap-audit/tooling/depcruise.config.cjs \
  --output-type json
```

Résultat : **72 modules, 169 dépendances, 0 erreur, 5 avertissements** —
reproduction exacte du chiffre porté par §7.3 du dossier. Les cinq
avertissements relèvent tous de la règle `hors-services-vers-persistance` :

| Module | Import | Requêtes `prisma.*.*` |
|---|---|---|
| `backend/src/realtime/socket.ts` | l. 5, `{ prisma }` | **8** — l. 136, 189, 245, 266, 298, 306, 361, 402 |
| `backend/src/middlewares/conv.middleware.ts` | l. 3, `{ prisma }` | **3** — l. 32, 56, 99 |
| `backend/src/middlewares/error.middleware.ts` | l. 6, `{ Prisma }` | **0** — namespace de types, pas le client |
| `backend/src/mappers/member.mapper.ts` | l. 3, `{ prisma }` | **1** — l. 14 |
| `backend/src/lib/auth.ts` | l. 4, `{ prisma, type User }` | **1** — l. 23 |

La nuance de §7.3 sur `error.middleware.ts` est vérifiée par la casse de
l'import : `Prisma` (majuscule, le namespace) et non `prisma` (l'instance).

Les quatre règles d'erreur — controller → models, router → services,
router → models, services → présentation — sont à **zéro violation**, ainsi que
la règle `no-circular`.

### 8.2 C3 backend — matrice inter-couches mesurée

Volumes réels, fichiers de test exclus :

| Couche | Fichiers | Lignes |
|---|---|---|
| `routers/` | 9 | 315 |
| `middlewares/` | 5 | 328 |
| `controllers/` | 7 | 497 |
| `services/` | 7 | 1 744 |
| `validation/` | 5 | 221 |
| `lib/` | 4 | 163 |
| `models/index.ts` | 1 | 8 |
| `mappers/` | 1 | 55 |
| `realtime/socket.ts` | 1 | 446 |

Arcs internes, comptés dans le graphe dependency-cruiser (nombre d'imports) :

| Arc | Imports | Vue |
|---|---|---|
| `app.ts` → routers | 1 | 1/2 |
| routers → middlewares | 11 | 1/2 |
| routers → controllers | 9 | 1/2 |
| routers → validation | 5 | 1/2 |
| controllers → services | 7 | 1/2 |
| controllers → validation | 3 | 1/2 |
| services → validation | 3 | 1/2 |
| services → models | **7 — chemin autorisé** | 2/2 |
| middlewares → models | 2 — *fuite* | 2/2 |
| realtime → models | 1 — *fuite* | 2/2 |
| mappers → models | 1 — *fuite* | 2/2 |
| lib → models | 1 — *fuite* | 2/2 |

Les quatre arcs de fuite portent les **cinq** avertissements : `middlewares`
en contribue deux, un par fichier.

### 8.3 C3 frontend — volumes et un constat de structure

| Répertoire | Fichiers | Lignes |
|---|---|---|
| `app/` | 13 | 938 |
| `components/atoms/` | 19 | 1 891 |
| `components/molecules/` | 10 | 663 |
| `components/organisms/` | 45 | 4 973 |
| `components/layouts/` | 1 | 33 |
| `components/providers/` | 1 | 166 |
| `hooks/` | 24 | 2 073 |
| `lib/` | 10 | 1 193 |
| `middleware.ts` | 1 | 54 |

Répartition des 45 organismes : `ProfilePage/` 14, `ConversationPage/` 12,
`Header/` 6, `HomePage/` 5, `SearchPage/` 5, racine 3.

> **Constat.** `components/` contient **cinq** répertoires, pas quatre. Trois
> sont des niveaux Atomic Design (`atoms`, `molecules`, `organisms`) ;
> `layouts/` et `providers/` n'en sont pas — un fichier chacun,
> `MainLayout.tsx` et `AuthProvider.tsx`. Le niveau `templates/` est **absent**.
> Le niveau `pages/` est tenu par les routes de l'App Router, hors de
> `components/`. §7.3 du dossier décrit « quatre niveaux — atoms, molécules,
> organismes, et pages (routes Next.js) » : c'est exact sur les niveaux
> nommés, mais le dossier ne mentionne pas les deux répertoires
> supplémentaires. Ils sont portés en gris sur la vue 1/2.

Répartition Server/Client des 11 composants de `app/` : **6 Server Components,
5 Client Components** (`'use client'` en tête de fichier).

### 8.4 C4 — le chemin `message:send`, fichier par fichier

| # | Étape | Fichier:ligne | Ce que fait la ligne |
|---|---|---|---|
| 1 | Saisie | `components/organisms/ConversationPage/MessageThread/MessageInput.tsx:28, :44` | `onSend()` sur Entrée et sur clic |
| 2 | Thread | `.../MessageThread/index.tsx:133-136` | `handleSend()` → `onSendMessage(state.messageContent)` |
| 3 | Page | `app/(app)/conversation/page.tsx:62` | `onSendMessage={handleSendMessage}` |
| 4 | Orchestrateur | `hooks/useMessaging.ts:108, :133` | réexpose `handleSendMessage` |
| 5 | Optimistic UI | `hooks/messaging/useConversationActions.ts:100-118` | `tempId = -Date.now()` (l.104), `addOptimisticMessage` (l.114), `socketSendMessage` (l.115) |
| 6 | Émission | `hooks/useSocket.ts:93-100` | `socketRef.current.emit('message:send', { conversationId, message })` (l.96-99) |
| 7 | Client socket | `lib/socket-client.ts:87-92` | `io(SOCKET_URL, { withCredentials: true, autoConnect: false, path: '/socket.io' })` |
| 8 | Handshake | `backend/src/realtime/socket.ts:88-122` | `cookies.accessToken` (l.93), `jwt.verify` (l.103), `socket.data.userId` entier > 0 (l.113-117) |
| 9 | Handler | `socket.ts:167-347` | cinq gardes, deux `Promise.all`, trois émissions |
| 10 | Persistance | `socket.ts:189, 245, 266` | `conversation.findUnique`, `message.create`, `conversation.update` |

Les cinq gardes du handler, dans l'ordre du code :

| Garde | Ligne | Condition |
|---|---|---|
| `conversationId` | 172 | entier strictement positif |
| `content` | 180 | non vide après `trim()`, ≤ 2000 caractères |
| Statut | 214 | conversation existante et `status !== 'Close'` |
| Participation | 224 | `userIds.includes(userId)` |
| Destinataire | 235 | `receiverId` trouvé |

Les deux `Promise.all` :

| Lignes | Contenu |
|---|---|
| 244-270 | `prisma.message.create` (245) **et** `prisma.conversation.update` (266) |
| 297-314 | `prisma.follow.findUnique` (298) **et** `prisma.rating.findUnique` (306) — branche premier message seulement |

Les trois émissions :

| Événement | Ligne | Cible | Condition |
|---|---|---|---|
| `message:new` | 289 | `room(conversationId)` | toujours |
| `conversation:new` | 321 | `user:${receiverId}` | `isFirstMessage` (l. 241, testé l. 295) et `senderUser` non nul (l. 319) |
| `conversation:updated` | 342 | `user:${participantId}`, pour chaque participant | toujours |

Concordance avec le dossier : l'annexe B reproduit `socket.ts:167-347`
verbatim ; §8 cite `useConversationActions.ts:100-118`, `tempId = -Date.now()`,
`addOptimisticMessage`, le `Promise.all` et `socket.ts:167-347`. Le C4 ne
contient aucun élément absent de ces deux emplacements.

### 8.5 Mesures de rendu — sept diagrammes

Même méthode qu'en §2 : la police effective est fixée par le plus petit texte
du SVG, hors glyphes espaceurs à 0 px. Boîtes cibles avec les marges actuelles
(x : 2,5 cm, y : 2 cm), place réservée à une légende de trois lignes :
**portrait 160 × 244 mm**, **paysage 247 × 157 mm**.

| Diagramme | Source | Orientation | Rendu | Police |
|---|---|---|---|---|
| `c3a-backend-chaine` | 633 × 958 px | portrait | 160,0 × 242,1 mm | **10,03 pt** |
| `c3b-backend-acces-donnees` | 1 062 × 677 px | **paysage** | 246,3 × 157,0 mm | **9,20 pt** |
| `c3c-frontend-atomic` | 630 × 945 px | portrait | 160,0 × 240,0 mm | **10,08 pt** |
| `c3d-frontend-donnees` | 679 × 1 045 px | portrait | 158,5 × 244,0 mm | **9,27 pt** |
| `c4a-message-send-ui` | 626 × 829 px | portrait | 160,0 × 211,9 mm | **10,14 pt** |
| `c4b-message-send-emission` | 517 × 1 064 px | portrait | 118,6 × 244,0 mm | **9,10 pt** |
| `c4c-message-send-serveur` | 702 × 982 px | portrait | 160,0 × 223,8 mm | **9,05 pt** |

**Ratio de réduction : 0,643** pour les sept, comme pour le C1 et le C2 — c'est
le ratio imposé par le plancher de police de 14 px (§2.2).

### 8.6 Les découpages, et pourquoi ils étaient nécessaires

Trois niveaux ont dû être découpés. Dans chaque cas la mesure du diagramme
d'un seul tenant est donnée, ainsi que ce qu'il aurait fallu de papier.

| Niveau | D'un seul tenant | À 9 pt il faudrait | Verdict |
|---|---|---|---|
| C3 backend | 1 277 × 1 628 px | 289,6 × 369,2 mm | 2 vues |
| C3 frontend | 597 × 1 110 px (déjà resserré) | 135,4 × 251,7 mm | 2 vues |
| **C4 `message:send`** | **942 × 2 278 px** | **213,6 × 516,6 mm** | **3 vues** |

Le C4 mérite un mot : la consigne demandait **un seul diagramme**. Il n'est pas
réalisable au seuil de 9 pt. En disposition verticale il demande 516,6 mm de
haut, soit plus de deux pages A4 ; en disposition gauche-droite il atteint
**4 280 px de large**, soit 970,6 mm. Coupé en deux à la frontière du socket, la
seule partie frontend fait encore 497 × 1 623 px, soit 368,1 mm de haut. La
cause est structurelle : le chemin traverse **dix rangs** successifs, et un rang
coûte environ 24 mm de page à 9 pt.

Il est donc rendu en **trois vues**, avec coutures nommées :

- **1/3 — de la saisie au hook orchestrateur** : couture `useMessaging.ts` ;
- **2/3 — du hook à l'émission** : coutures `useMessaging.ts` et `io.use` ;
- **3/3 — serveur** : couture `socket-client.ts`.

Un diagramme unique reste possible si l'on préfère une figure à la lisibilité :
il rendrait à **4,25 pt** sur une pleine page portrait, soit deux fois plus
petit que le corps du dossier. C'est un arbitrage à trancher, pas une
impossibilité technique.

### 8.7 Inventaire ajouté

| Fichier | Rôle |
|---|---|
| `c3a-backend-chaine.puml` / `.svg` | C3 backend, vue 1/2 — chaîne de traitement REST |
| `c3b-backend-acces-donnees.puml` / `.svg` | C3 backend, vue 2/2 — les cinq fuites de couche |
| `c3c-frontend-atomic.puml` / `.svg` | C3 frontend, vue 1/2 — composition de l'interface |
| `c3d-frontend-donnees.puml` / `.svg` | C3 frontend, vue 2/2 — garde de routes et données |
| `c4a-message-send-ui.puml` / `.svg` | C4, vue 1/3 |
| `c4b-message-send-emission.puml` / `.svg` | C4, vue 2/3 |
| `c4c-message-send-serveur.puml` / `.svg` | C4, vue 3/3 |
| `lib/C4_Component.puml` | ajout au vendor — `c20a5cff…5602`, auto-suffisant |

Aucun fichier `.typ` n'a été modifié. Le dépôt d'équipe est intact.
