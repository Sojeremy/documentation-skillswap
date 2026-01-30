# Guide d'Optimisation SEO - SkillSwap

> **Date de creation**: 27 janvier 2026
> **Derniere mise a jour**: 27 janvier 2026
> **Branch**: `SEO`
> **Domaine**: `https://skill-swap.fr`
> **Statut**: ✅ Phases 0-2 implementees | ⏳ Phases 3-4 futures

[← Retour au README](./README.md)

---

## Statut rapide

| Phase   | Description                   | Statut      |
| ------- | ----------------------------- | ----------- |
| Phase 0 | Documentation                 | ✅ Complete |
| Phase 1 | robots.txt + sitemap          | ✅ Complete |
| Phase 2 | Metadata + SSR + ISR + Teaser | ✅ Complete |
| Phase 3 | JSON-LD                       | ⏳ Futur    |
| Phase 4 | OG images + pages categories  | ⏳ Futur    |

---

## Table des matieres

1. [Introduction au SEO](#1-introduction-au-seo)
2. [Audit SEO actuel](#2-audit-seo-actuel)
3. [Concepts cles expliques](#3-concepts-cles-expliques)
4. [Plan d'implementation](#4-plan-dimplementation)
5. [Code et exemples](#5-code-et-exemples)
6. [Checklist finale](#6-checklist-finale)

---

## 1. Introduction au SEO

### Qu'est-ce que le SEO ?

Le **SEO** (Search Engine Optimization) est l'ensemble des techniques pour ameliorer la visibilite d'un site web dans les resultats des moteurs de recherche (Google, Bing, etc.).

### Pourquoi c'est crucial pour SkillSwap ?

```text
┌─────────────────────────────────────────────────────────────────┐
│  Utilisateur cherche "cours de guitare paris" sur Google        │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. SkillSwap - Cours de guitare a Paris | Marie D.      │ ← TOP 3 = 75% des clics
│  │ 2. Superprof - Professeurs de guitare                   │   │
│  │ 3. Allegro Musique - Cours particuliers                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Si SkillSwap n'est pas dans le top 10 → invisible              │
└─────────────────────────────────────────────────────────────────┘
```

**Objectif** : Que chaque profil SkillSwap soit indexe et bien classe pour les recherches liees aux competences proposees.

---

## 2. Audit SEO actuel

### Ce qui est deja en place

| Element                | Statut | Fichier                  |
| ---------------------- | ------ | ------------------------ |
| Metadata de base       | ✅     | `app/layout.tsx`         |
| Open Graph (accueil)   | ✅     | `app/page.tsx`           |
| Lang="fr"              | ✅     | `app/layout.tsx`         |
| next/font optimization | ✅     | `app/layout.tsx`         |
| next/image             | ✅     | `next.config.ts`         |
| Skip-to-content        | ✅     | `layouts/MainLayout.tsx` |
| Routes protegees       | ✅     | `middleware.ts`          |

### Ce qui manque (priorite haute → basse)

| Element                       | Impact SEO | Priorite | Description                          |
| ----------------------------- | ---------- | -------- | ------------------------------------ |
| Sitemap.xml dynamique         | ⭐⭐⭐⭐⭐ | P0       | Google decouvre toutes les pages     |
| robots.txt                    | ⭐⭐⭐⭐   | P0       | Controle ce que Google peut crawler  |
| Metadata dynamiques profils   | ⭐⭐⭐⭐⭐ | P1       | Titre/description uniques par profil |
| Server Component profils      | ⭐⭐⭐⭐⭐ | P1       | HTML pre-rendu pour les crawlers     |
| JSON-LD (donnees structurees) | ⭐⭐⭐⭐   | P2       | Rich snippets dans Google            |
| Canonical tags                | ⭐⭐⭐     | P2       | Evite le contenu duplique            |
| ISR (Incremental Static)      | ⭐⭐⭐     | P2       | Performance + fraicheur du contenu   |
| Open Graph images             | ⭐⭐       | P3       | Belles previews sur reseaux sociaux  |
| Pages categories statiques    | ⭐⭐       | P3       | `/competences/javascript` indexables |

### Variables d'environnement actuelles

```bash
# frontend/.env (actuel)
NEXT_PUBLIC_API_URL=http://localhost:4000   # URL du backend

# A AJOUTER pour le SEO
NEXT_PUBLIC_SITE_URL=https://skill-swap.fr  # URL du site (production)
```

---

## 3. Concepts cles expliques

### 3.1 Sitemap.xml

#### Definition

Un fichier XML qui liste toutes les URLs publiques de ton site. C'est une "carte" pour les moteurs de recherche.

#### Exemple concret pour SkillSwap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Page d'accueil -->
  <url>
    <loc>https://skill-swap.fr/</loc>
    <lastmod>2026-01-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Page recherche -->
  <url>
    <loc>https://skill-swap.fr/recherche</loc>
    <lastmod>2026-01-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Profils utilisateurs (generes dynamiquement) -->
  <url>
    <loc>https://skill-swap.fr/profil/42</loc>
    <lastmod>2026-01-25</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://skill-swap.fr/profil/156</loc>
    <lastmod>2026-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... tous les profils publics ... -->
</urlset>
```

#### Pourquoi "dynamique" ?

Les profils changent (nouveaux inscrits, profils supprimes). Le sitemap doit se regenerer automatiquement depuis la base de donnees.

#### Impact

- Google decouvre les nouvelles pages plus rapidement
- Les profils orphelins (sans liens) sont quand meme indexes
- Meilleure couverture de l'indexation

---

### 3.2 robots.txt - Choix statique vs dynamique

#### Definition

Un fichier texte a la racine du site qui indique aux robots ce qu'ils peuvent ou ne peuvent pas explorer.

#### Comparaison des approches

| Critere             | `robots.txt` (statique) | `robots.ts` (dynamique)      |
| ------------------- | ----------------------- | ---------------------------- |
| Simplicite          | ✅ Fichier texte simple | Code TypeScript              |
| URL sitemap         | ❌ Hardcodee            | ✅ Selon environnement       |
| Bloquer staging/dev | ❌ Non                  | ✅ `Disallow: /` en dev      |
| Coherence codebase  | Fichier texte isole     | ✅ TypeScript comme le reste |
| Maintenance         | Modifier manuellement   | Logique centralisee          |

#### Notre choix : `robots.ts` (dynamique)

**Raisons :**

1. **URL du sitemap variable selon l'environnement** :

   ```typescript
   // Production : https://skill-swap.fr/sitemap.xml
   // Dev local  : http://localhost:3000/sitemap.xml
   ```

2. **Bloquer l'indexation en dev/staging** :

   ```typescript
   // Evite que Google indexe un environnement de test par erreur
   if (process.env.NODE_ENV !== 'production') {
     return { rules: { userAgent: '*', disallow: '/' } };
   }
   ```

3. **Coherence** : Tout le projet est en TypeScript, autant rester coherent

4. **Flexibilite** : Facile d'ajouter des regles conditionnelles plus tard

#### Exemple pour SkillSwap

```text
# Genere dynamiquement par robots.ts

User-agent: *

# Pages publiques - autorisees
Allow: /
Allow: /recherche
Allow: /profil/

# Pages privees - interdites (necessitent authentification)
Disallow: /conversation
Disallow: /mon-profil

# Pages d'authentification - inutiles a indexer
Disallow: /connexion
Disallow: /inscription

# Fichiers techniques Next.js
Disallow: /_next/
Disallow: /api/

# Sitemap (URL dynamique selon environnement)
Sitemap: https://skill-swap.fr/sitemap.xml
```

#### Pourquoi bloquer ces pages ?

```text
SANS robots.txt                    AVEC robots.txt
─────────────────                  ─────────────────

Google crawle TOUT :               Google crawle INTELLIGEMMENT :
  /                    ✓             /                    ✓
  /profil/42           ✓             /profil/42           ✓
  /conversation        ✗ (inutile)   /conversation        ✗ (bloque)
  /mon-profil          ✗ (prive)     /mon-profil          ✗ (bloque)
  /connexion           ✗ (inutile)   /connexion           ✗ (bloque)
  /_next/static/...    ✗ (technique) /_next/static/...    ✗ (bloque)

→ Gaspillage du "crawl budget"     → Crawl budget optimise
→ Pages privees potentiellement     → Seul le contenu public
  exposees dans l'index               est indexe
```

---

### 3.3 Metadonnees dynamiques

#### Definition

Les balises `<title>` et `<meta name="description">` dans le `<head>` HTML. C'est ce qui s'affiche dans les resultats Google.

#### Le probleme actuel

Actuellement dans `app/(app)/profil/[id]/layout.tsx` :

```typescript
export const metadata: Metadata = {
  title: 'Profil - SkillSwap', // ← Statique, identique pour tous !
  description: "Consultez le profil d'un membre SkillSwap...",
};
```

```text
RESULTAT ACTUEL (metadata statique)
───────────────────────────────────

Tous les profils ont le meme titre :
┌─────────────────────────────────────────────────────┐
│ Profil - SkillSwap                                  │ ← Titre generique
│ https://skill-swap.fr/profil/42                     │
│ Consultez le profil d'un membre SkillSwap...        │ ← Description generique
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Profil - SkillSwap                                  │ ← Meme titre !
│ https://skill-swap.fr/profil/156                    │
│ Consultez le profil d'un membre SkillSwap...        │ ← Meme description !
└─────────────────────────────────────────────────────┘

→ Google penalise le contenu duplique
→ L'utilisateur ne sait pas ce qu'il va trouver
→ Taux de clic faible
```

#### La solution

```text
APRES (metadata dynamique avec generateMetadata)
────────────────────────────────────────────────

Chaque profil a un titre unique :
┌─────────────────────────────────────────────────────┐
│ Marie Dupont - Cours de JavaScript | SkillSwap      │ ← Titre unique
│ https://skill-swap.fr/profil/42                     │
│ Marie propose des cours de JavaScript, React et     │ ← Description unique
│ Node.js a Paris. 4.8★ (12 avis) - Disponible...     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Jean Martin - Cours de Guitare | SkillSwap          │ ← Titre unique
│ https://skill-swap.fr/profil/156                    │
│ Jean donne des cours de guitare acoustique et       │ ← Description unique
│ electrique a Lyon. Debutants bienvenus. 4.5★...     │
└─────────────────────────────────────────────────────┘

→ Contenu unique = meilleur classement
→ L'utilisateur sait exactement ce qu'il trouve
→ Taux de clic eleve
```

#### Comment fonctionne generateMetadata() ?

`generateMetadata()` est une fonction **asynchrone** exportee depuis une page Next.js. Elle est appelee **cote serveur** AVANT le rendu de la page.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  REQUETE : GET /profil/42                                               │
│                                                                         │
│  1. Next.js recoit la requete                                           │
│                     ↓                                                   │
│  2. Appelle generateMetadata({ params: { id: '42' } })                  │
│                     ↓                                                   │
│  3. La fonction fetch le profil depuis l'API                            │
│                     ↓                                                   │
│  4. Retourne { title: 'Alice...', description: '...' }                  │
│                     ↓                                                   │
│  5. Next.js injecte ces metadata dans le <head> HTML                    │
│                     ↓                                                   │
│  6. Rend le composant page                                              │
│                     ↓                                                   │
│  7. Envoie le HTML complet au navigateur (ou a Googlebot)               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Point cle** : Googlebot recoit directement le HTML avec les bonnes balises `<title>` et `<meta>`, sans avoir besoin d'executer du JavaScript.

#### Pourquoi un Server Component ?

Next.js App Router propose deux types de composants :

| Type                                  | Execution          | Acces aux donnees              | SEO              |
| ------------------------------------- | ------------------ | ------------------------------ | ---------------- |
| **Server Component**                  | Serveur uniquement | Fetch direct, pas d'API client | ✅ Optimal       |
| **Client Component** (`'use client'`) | Navigateur         | useEffect + fetch              | ❌ Problematique |

```text
CLIENT COMPONENT (actuel)              SERVER COMPONENT (objectif)
─────────────────────────              ───────────────────────────

1. Navigateur charge la page           1. Serveur recoit la requete
2. JavaScript s'execute                2. Serveur fetch les donnees
3. useEffect() declenche fetch         3. Serveur genere le HTML complet
4. Donnees arrivent                    4. HTML envoye au navigateur
5. React re-render avec donnees

Googlebot voit :                       Googlebot voit :
┌────────────────────┐                 ┌────────────────────────────┐
│ <title>Profil</title>                │ <title>Alice - JS</title>  │
│ <div id="root">   │                 │ <h1>Alice Dupont</h1>      │
│   <!-- VIDE -->   │                 │ <p>Developpeuse Web...</p> │
│ </div>            │                 │ <ul>                       │
│ <script src="...">│                 │   <li>JavaScript</li>      │
└────────────────────┘                 │   <li>React</li>           │
                                       │ </ul>                      │
❌ Contenu invisible                   └────────────────────────────┘

                                       ✅ Contenu indexable
```

#### Architecture de la page profil

Le defi : la page actuelle utilise `'use client'` pour les interactions (bouton "Contacter", etc.). On ne peut pas simplement retirer cette directive.

**Solution : separer Server et Client**

```text
AVANT (tout en Client Component)
────────────────────────────────

app/(app)/profil/[id]/
├── layout.tsx        ← metadata statique (probleme!)
└── page.tsx          ← 'use client' + useEffect pour fetch


APRES (separation Server/Client)
────────────────────────────────

app/(app)/profil/[id]/
├── layout.tsx        ← SUPPRIME (metadata gerees dans page.tsx)
└── page.tsx          ← Server Component + generateMetadata()
                         ↓
                         Importe et rend <ProfileClient />

components/organisms/ProfilePage/
└── ProfileClient.tsx ← 'use client' (parties interactives)
```

#### Etapes d'implementation detaillees

**Etape 1 : Creer la fonction de fetch serveur**

```typescript
// Dans page.tsx (Server Component)
const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

async function getProfile(id: string) {
  const response = await fetch(`${apiUrl}/api/v1/profiles/${id}`, {
    next: { revalidate: 3600 }, // ISR : cache 1 heure
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.data;
}
```

**Pourquoi `INTERNAL_API_URL` ?**

- Dans Docker, le serveur Next.js ne peut pas appeler `localhost:8888`
- Il doit utiliser le nom du service Docker : `http://backend:3000`
- Meme logique que pour le sitemap

**Etape 2 : Implementer generateMetadata()**

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);

  // Profil non trouve → metadata par defaut
  if (!profile) {
    return {
      title: 'Profil non trouve - SkillSwap',
      description: "Ce profil n'existe pas.",
    };
  }

  // Construire titre et description dynamiques
  const skills =
    profile.skills?.map((s) => s.skill?.name).filter(Boolean) || [];
  const mainSkill = skills[0] || 'Membre';
  const title = `${profile.firstname} ${profile.lastname} - ${mainSkill} | SkillSwap`;

  const description = profile.bio
    ? `${profile.bio.slice(0, 150)}...`
    : `${profile.firstname} propose ses competences : ${skills.join(', ')}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteUrl}/profil/${id}`,
    },
    alternates: {
      canonical: `${siteUrl}/profil/${id}`, // URL canonique
    },
  };
}
```

**Etape 3 : Rendre la page (Server Component)**

```typescript
// Pas de 'use client' ici !
export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    notFound(); // Affiche la page 404
  }

  // Passer les donnees au composant client
  return <ProfileClient profile={profile} />;
}
```

**Etape 4 : Extraire les parties interactives**

```typescript
// components/organisms/ProfilePage/ProfileClient.tsx
'use client';

import { ProfileHeader, SkillsSection, ... } from './';

interface ProfileClientProps {
  profile: Profile;
}

export function ProfileClient({ profile }: ProfileClientProps) {
  // Toute la logique interactive ici :
  // - Bouton "Contacter"
  // - Actions utilisateur connecte
  // - etc.

  return (
    <div>
      <ProfileHeader profile={profile} />
      <SkillsSection skills={profile.skills} />
      {/* ... */}
    </div>
  );
}
```

#### Pourquoi supprimer layout.tsx ?

Le fichier `layout.tsx` actuel definit des metadata statiques :

```typescript
// app/(app)/profil/[id]/layout.tsx (ACTUEL)
export const metadata: Metadata = {
  title: 'Profil - SkillSwap', // ← Ecrase les metadata dynamiques !
};
```

**Probleme** : Dans Next.js, les metadata du layout ont priorite sur celles de la page. Meme si `page.tsx` a `generateMetadata()`, le titre restera "Profil - SkillSwap".

**Solution** : Supprimer ce layout (ou retirer ses metadata) pour que `generateMetadata()` de la page prenne effet.

#### Resume du flux de donnees

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  REQUETE GET /profil/42                                                 │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────────┐                                                    │
│  │ generateMetadata │ ──fetch──▶ API /profiles/42 ──▶ { Alice, JS... } │
│  └────────┬────────┘                                                    │
│           │ return { title: 'Alice - JS | SkillSwap' }                  │
│           ▼                                                             │
│  ┌─────────────────┐                                                    │
│  │   ProfilePage   │ ──fetch──▶ (meme donnees, cachees)                 │
│  │ (Server Comp.)  │                                                    │
│  └────────┬────────┘                                                    │
│           │ return <ProfileClient profile={...} />                      │
│           ▼                                                             │
│  ┌─────────────────┐                                                    │
│  │ ProfileClient   │ (Client Component - interactivite)                 │
│  └────────┬────────┘                                                    │
│           │                                                             │
│           ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ HTML FINAL                                                       │   │
│  │ <html>                                                           │   │
│  │   <head>                                                         │   │
│  │     <title>Alice Dupont - JavaScript | SkillSwap</title>         │   │
│  │     <meta name="description" content="Alice propose..." />       │   │
│  │     <link rel="canonical" href=".../profil/42" />                │   │
│  │   </head>                                                        │   │
│  │   <body>                                                         │   │
│  │     <h1>Alice Dupont</h1>                                        │   │
│  │     <p>Developpeuse Web...</p>                                   │   │
│  │     ...                                                          │   │
│  │   </body>                                                        │   │
│  │ </html>                                                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ✅ Googlebot indexe immediatement le contenu complet                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Donnees structurees (JSON-LD)

#### Definition

Du code JSON invisible pour l'utilisateur mais lisible par Google. Ca lui permet de comprendre le **sens** de ta page.

#### Schema.org

C'est un vocabulaire standardise (cree par Google, Microsoft, Yahoo) pour decrire des entites : Person, Organization, Product, Event, etc.

#### Exemple pour un profil SkillSwap

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Marie Dupont",
    "description": "Developpeuse Web passionnee, je propose des cours de JavaScript et React",
    "image": "https://skill-swap.fr/avatars/marie.jpg",
    "url": "https://skill-swap.fr/profil/42",
    "knowsAbout": ["JavaScript", "React", "Node.js"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paris",
      "addressCountry": "FR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "12"
    }
  }
</script>
```

#### Resultat : Rich Snippets

```text
SANS JSON-LD (resultat basique)
───────────────────────────────
┌─────────────────────────────────────────────────────┐
│ Marie Dupont - Cours de JavaScript | SkillSwap      │
│ https://skill-swap.fr/profil/42                     │
│ Marie propose des cours de JavaScript et React...   │
└─────────────────────────────────────────────────────┘

AVEC JSON-LD (rich snippet)
───────────────────────────
┌─────────────────────────────────────────────────────┐
│ Marie Dupont - Cours de JavaScript | SkillSwap      │
│ ⭐⭐⭐⭐⭐ 4.8 (12 avis)                           │ ← Etoiles !
│ https://skill-swap.fr/profil/42                     │
│ Competences: JavaScript, React, Node.js             │ ← Liste skills !
│ Localisation: Paris                                 │ ← Lieu !
│ Marie propose des cours de JavaScript et React...   │
└─────────────────────────────────────────────────────┘

→ Resultat beaucoup plus visible
→ Taux de clic 2-3x superieur
```

---

### 3.5 Canonical tags

#### Definition

Une balise qui indique la version "officielle" d'une page quand plusieurs URLs menent au meme contenu.

#### Le probleme

```text
Ces 4 URLs affichent le MEME contenu :

https://skill-swap.fr/profil/42
https://skill-swap.fr/profil/42?ref=search
https://skill-swap.fr/profil/42?utm_source=email
https://skill-swap.fr/profil/42#skills

Sans canonical, Google peut :
  1. Indexer les 4 versions separement
  2. Les considerer comme contenu duplique
  3. Penaliser le site
  4. Choisir arbitrairement laquelle afficher
```

#### La solution

```html
<head>
  <link rel="canonical" href="https://skill-swap.fr/profil/42" />
</head>
```

Cette balise dit a Google : "Ignore les parametres et fragments, cette URL est la reference."

---

### 3.6 Client-side vs Server-side Rendering (SSR/ISR)

#### Le probleme du Client-Side Rendering (CSR)

Actuellement, `app/(app)/profil/[id]/page.tsx` est un **Client Component** (`'use client'`).

```text
ETAPE 1 : Googlebot arrive sur /profil/42
──────────────────────────────────────────

Ce qu'il recoit du serveur :

<!DOCTYPE html>
<html>
<head>
  <title>Profil - SkillSwap</title>  ← Titre generique
</head>
<body>
  <div id="root"></div>              ← PAGE VIDE !
  <script src="/bundle.js"></script> ← JS a executer
</body>
</html>

ETAPE 2 : Googlebot execute le JavaScript (peut-etre)
─────────────────────────────────────────────────────

Problemes potentiels :
  - Timeout (le JS met trop de temps)
  - Erreurs JS (API indisponible, etc.)
  - Budget de rendu limite

Resultat : indexation incomplete ou differee
```

#### La solution : Server-Side Rendering (SSR) / ISR

```text
ETAPE 1 : Googlebot arrive sur /profil/42
──────────────────────────────────────────

Ce qu'il recoit du serveur (pre-rendu) :

<!DOCTYPE html>
<html>
<head>
  <title>Marie Dupont - JavaScript | SkillSwap</title>  ← Titre dynamique
  <meta name="description" content="Marie propose..."/> ← Description dynamique
  <script type="application/ld+json">...</script>       ← JSON-LD
</head>
<body>
  <h1>Marie Dupont</h1>              ← Contenu visible !
  <p>Developpeuse Web</p>
  <ul>
    <li>JavaScript</li>
    <li>React</li>
  </ul>
  <script src="/bundle.js"></script>
</body>
</html>

→ Contenu indexable immediatement
→ Pas de dependance au JavaScript
→ Performance optimale (Time to First Byte)
```

#### ISR (Incremental Static Regeneration)

ISR combine le meilleur des deux mondes :

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   1er visiteur         Serveur genere         Page mise     │
│   sur /profil/42  →    la page en HTML   →    en cache      │
│                                                             │
│   2e visiteur          Page servie           Ultra rapide   │
│   sur /profil/42  →    depuis le cache  →    (~50ms)        │
│                                                             │
│   Apres X heures       Serveur regenere      Cache mis      │
│   (revalidation)  →    en arriere-plan  →    a jour         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Avantages :
  ✅ Performance de pages statiques
  ✅ Contenu toujours a jour (revalidation)
  ✅ SEO optimal (HTML pre-rendu)
  ✅ Pas de rebuild complet du site
```

---

## 4. Plan d'implementation

### Phase 0 : Documentation ✅ FAIT

- [x] Mise a jour de `structure-actuelle.md`
- [x] Creation de ce guide SEO
- [x] Creation du `README.md` pour `.code-review/`

### Phase 1 : Fondations SEO ✅ FAIT

| Tache                                   | Fichier cree/modifie | Statut |
| --------------------------------------- | -------------------- | ------ |
| Ajouter variable `NEXT_PUBLIC_SITE_URL` | `.env.example`       | ✅     |
| Creer robots.ts dynamique               | `app/robots.ts`      | ✅     |
| Creer sitemap dynamique                 | `app/sitemap.ts`     | ✅     |
| Config Docker `INTERNAL_API_URL`        | `devops/.env.docker` | ✅     |

**Note Docker** : Le sitemap utilise `INTERNAL_API_URL=http://backend:3000` pour les appels serveur dans Docker (le backend ecoute sur le port 3000 en interne).

### Phase 2 : Pages profil optimisees ✅ (Strategie Teaser)

> **Documentation detaillee** : [profil-teaser-strategy.md](./profil-teaser-strategy.md)

| Tache                                | Fichier                                              | Statut |
| ------------------------------------ | ---------------------------------------------------- | ------ |
| Convertir en Server Component        | `app/(app)/profil/[id]/page.tsx`                     | ✅     |
| Ajouter `generateMetadata()`         | `app/(app)/profil/[id]/page.tsx`                     | ✅     |
| Configurer ISR (revalidate)          | `app/(app)/profil/[id]/page.tsx`                     | ✅     |
| Supprimer layout.tsx                 | `app/(app)/profil/[id]/layout.tsx`                   | ✅     |
| Modifier middleware (route publique) | `src/middleware.ts`                                  | ✅     |
| Creer endpoint API teaser            | `backend/src/services/profile.service.ts`            | ✅     |
| Creer composant ProfileTeaser        | `components/organisms/ProfilePage/ProfileTeaser.tsx` | ✅     |
| Creer composant ProfileFull          | `components/organisms/ProfilePage/ProfileFull.tsx`   | ✅     |
| Modifier ProfileClient (orchestr.)   | `components/organisms/ProfilePage/ProfileClient.tsx` | ✅     |
| Ajouter type ProfileTeaser           | `lib/api-types.ts`                                   | ✅     |
| Ajouter `generateStaticParams()`     | `app/(app)/profil/[id]/page.tsx`                     | ⏳     |

**Strategie Teaser (compromis SEO/Conversion)** :

Visiteurs non connectes voient un profil **limite** (teaser) avec CTA inscription :

- Visible : `firstname`, `lastnameInitial` (ex: "Alice D."), `city`, `avatar`, `skills`, `averageRating`, `reviewCount`, `descriptionPreview` (150 chars)
- Masque : nom complet, description complete, avis detailles, disponibilites, interets
- CTA : "Connectez-vous pour voir le profil complet"

Utilisateurs connectes voient le profil **complet** avec toutes les fonctionnalites.

**Metadata generees dynamiquement** :

- `<title>` : "Alice D. - JavaScript | SkillSwap"
- `<meta name="description">` : Description tronquee (150 caracteres)
- `<link rel="canonical">` : URL canonique du profil
- `<meta property="og:*">` : Open Graph complet

**Endpoint API teaser** : `GET /api/v1/profiles/public/:id`

### Phase 3 : Donnees structurees

| Tache                       | Fichier                     | Statut |
| --------------------------- | --------------------------- | ------ |
| Creer composant JsonLd      | `components/seo/JsonLd.tsx` | ⏳     |
| Ajouter schema Person       | Page profil                 | ⏳     |
| Ajouter schema Organization | Page accueil                | ⏳     |
| Ajouter schema WebSite      | Layout racine               | ⏳     |

### Phase 4 : Optimisations avancees

| Tache                        | Fichier                               | Statut |
| ---------------------------- | ------------------------------------- | ------ |
| Open Graph images dynamiques | `app/profil/[id]/opengraph-image.tsx` | ⏳     |
| Pages categories statiques   | `app/competences/[slug]/page.tsx`     | ⏳     |
| Breadcrumbs avec schema      | Composant + JSON-LD                   | ⏳     |

---

## 5. Code et exemples

### 5.1 Variable d'environnement

```bash
# frontend/.env.local (developpement)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# frontend/.env.production (production)
NEXT_PUBLIC_API_URL=https://api.skill-swap.fr
NEXT_PUBLIC_SITE_URL=https://skill-swap.fr
```

### 5.2 robots.ts (dynamique)

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // En dev/staging : bloquer completement l'indexation
  if (process.env.NODE_ENV !== 'production') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // En production : regles SEO optimisees
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/recherche', '/profil/'],
        disallow: [
          '/conversation',
          '/mon-profil',
          '/connexion',
          '/inscription',
          '/_next/',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

**Pourquoi ce code ?**

- `MetadataRoute.Robots` : Type Next.js pour le typage strict
- `process.env.NODE_ENV` : Detecte automatiquement l'environnement
- `NEXT_PUBLIC_SITE_URL` : URL configurable selon l'environnement
- Retourne un objet que Next.js convertit automatiquement en fichier texte

### 5.3 Sitemap dynamique

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
// Pour les appels serveur (SSR/sitemap), utiliser l'URL interne Docker si disponible
const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URLs statiques
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/recherche`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // URLs dynamiques : recuperer les profils publics depuis l'API
  // Utilise /top-rated car c'est une route publique (pas d'auth requise)
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/search/top-rated?limit=100`,
      {
        next: { revalidate: 3600 }, // Cache 1 heure
      },
    );

    if (!response.ok) {
      console.error('Sitemap: erreur API', response.status);
      return staticUrls;
    }

    const data = await response.json();
    const members = data.data || [];

    const profileUrls: MetadataRoute.Sitemap = members.map(
      (member: { id: number; updatedAt?: string }) => ({
        url: `${siteUrl}/profil/${member.id}`,
        lastModified: member.updatedAt
          ? new Date(member.updatedAt)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }),
    );

    return [...staticUrls, ...profileUrls];
  } catch (error) {
    console.error('Sitemap: erreur fetch', error);
    return staticUrls;
  }
}
```

**Points cles :**

- **INTERNAL_API_URL** : URL interne Docker pour les appels serveur (reseau Docker)
- Utilise `/api/v1/search/top-rated` : route publique sans authentification
- Gestion d'erreur : retourne au moins les URLs statiques si l'API echoue
- `revalidate: 3600` : le sitemap est regenere toutes les heures
- Types stricts avec `MetadataRoute.Sitemap`

**Configuration Docker** (`devops/.env.docker`) :

```bash
# URL publique (pour le navigateur)
NEXT_PUBLIC_API_URL=http://localhost:8888

# URL interne (pour les appels serveur dans Docker)
INTERNAL_API_URL=http://backend:3000
```

### 5.4 Metadata dynamique pour profils (Phase 2)

```typescript
// app/(app)/profil/[id]/page.tsx
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  bio: string;
  avatar: string;
  skills: { skill: { name: string } }[];
  averageRating: number;
  reviewCount: number;
}

interface Props {
  params: Promise<{ id: string }>;
}

// Fetch profil (utilise par generateMetadata ET le composant)
async function getProfile(id: string): Promise<Profile | null> {
  try {
    const response = await fetch(`${apiUrl}/api/v1/profiles/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch {
    return null;
  }
}

// Generation des metadonnees dynamiques
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    return {
      title: 'Profil non trouve - SkillSwap',
      description: 'Ce profil n\'existe pas ou a ete supprime.',
    };
  }

  const mainSkill = profile.skills[0]?.skill?.name || 'Membre';
  const title = `${profile.firstname} ${profile.lastname} - ${mainSkill} | SkillSwap`;
  const description = profile.bio
    ? `${profile.bio.slice(0, 150)}...`
    : `${profile.firstname} propose ses competences sur SkillSwap. ${profile.reviewCount} avis.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteUrl}/profil/${id}`,
      images: profile.avatar ? [{ url: profile.avatar }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/profil/${id}`,
    },
  };
}

// ISR : regenerer la page toutes les heures
export const revalidate = 3600;

// Page component (Server Component)
export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    // Gerer le cas 404
    return <div>Profil non trouve</div>;
  }

  // JSON-LD pour les donnees structurees
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${profile.firstname} ${profile.lastname}`,
    description: profile.bio,
    image: profile.avatar,
    url: `${siteUrl}/profil/${id}`,
    knowsAbout: profile.skills.map((s) => s.skill?.name),
    ...(profile.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: profile.averageRating,
        reviewCount: profile.reviewCount,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Composant client pour les parties interactives */}
      {/* <ProfileClient profile={profile} /> */}
    </>
  );
}
```

### 5.5 Composant JSON-LD reutilisable (Phase 3)

```typescript
// components/seo/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...data,
        }),
      }}
    />
  );
}

// Schemas pre-definis pour SkillSwap
export const schemas = {
  organization: {
    '@type': 'Organization',
    name: 'SkillSwap',
    url: 'https://skill-swap.fr',
    logo: 'https://skill-swap.fr/logo.png',
    description: "Plateforme d'echange de competences entre particuliers",
    sameAs: [
      'https://twitter.com/skillswap',
      'https://linkedin.com/company/skillswap',
    ],
  },

  website: {
    '@type': 'WebSite',
    name: 'SkillSwap',
    url: 'https://skill-swap.fr',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://skill-swap.fr/recherche?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },

  person: (profile: {
    firstname: string;
    lastname: string;
    bio?: string;
    avatar?: string;
    id: number;
    skills: { skill: { name: string } }[];
    averageRating?: number;
    reviewCount?: number;
  }) => ({
    '@type': 'Person',
    name: `${profile.firstname} ${profile.lastname}`,
    description: profile.bio,
    image: profile.avatar,
    url: `https://skill-swap.fr/profil/${profile.id}`,
    knowsAbout: profile.skills.map((s) => s.skill?.name),
    ...(profile.reviewCount && profile.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: profile.averageRating,
        reviewCount: profile.reviewCount,
      },
    }),
  }),
};
```

---

## 6. Checklist finale

### Pre-deploiement

- [x] Variable `NEXT_PUBLIC_SITE_URL` configuree
- [x] `robots.txt` accessible sur `/robots.txt`
- [x] `sitemap.xml` accessible sur `/sitemap.xml`
- [ ] Toutes les pages publiques ont des metadata uniques
- [ ] Canonical tags sur toutes les pages
- [ ] JSON-LD valide (tester sur [Rich Results Test](https://search.google.com/test/rich-results))
- [ ] Open Graph tags presents

### Post-deploiement

- [ ] Soumettre sitemap dans Google Search Console
- [ ] Verifier indexation avec `site:skill-swap.fr` sur Google
- [ ] Tester les rich snippets avec l'outil Google
- [ ] Monitorer les erreurs dans Search Console
- [ ] Verifier le Core Web Vitals (LCP, FID, CLS)

### Outils de test

| Outil                        | URL                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| Google Rich Results Test     | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| Google Search Console        | [search.google.com/search-console](https://search.google.com/search-console)       |
| Schema.org Validator         | [validator.schema.org](https://validator.schema.org/)                              |
| PageSpeed Insights           | [pagespeed.web.dev](https://pagespeed.web.dev/)                                    |
| Lighthouse (Chrome DevTools) | F12 → Lighthouse                                                                   |
| Meta Tags Preview            | [metatags.io](https://metatags.io/)                                                |

---

## Ressources

- [Next.js SEO Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js robots.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Schema.org Full List](https://schema.org/docs/full.html)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

---

[← Retour au README](./README.md)
