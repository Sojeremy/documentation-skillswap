# Strategie Profil Teaser - SEO & Conversion

> **Date de creation** : 27 janvier 2026
> **Derniere mise a jour** : 27 janvier 2026
> **Auteur** : Equipe SEO
> **Statut** : ✅ Implemente
> **Branch** : `SEO`

[← Retour au README](./README.md)

---

## Table des matieres

1. [Contexte et problematique](#1-contexte-et-problematique)
2. [La strategie Profil Teaser](#2-la-strategie-profil-teaser)
3. [Avantages de cette approche](#3-avantages-de-cette-approche)
4. [Specification fonctionnelle](#4-specification-fonctionnelle)
5. [Architecture technique](#5-architecture-technique)
6. [Statut d'implementation](#6-statut-dimplementation)
7. [Exemples de code](#7-exemples-de-code)

---

## 1. Contexte et problematique

### Situation initiale

Dans SkillSwap, les pages profil (`/profil/[id]`) etaient des **routes protegees** : un visiteur devait obligatoirement etre connecte pour y acceder. Cette decision metier avait pour but de :

- Forcer l'inscription pour acceder au contenu
- Proteger les donnees des membres
- Maximiser la conversion visiteur → utilisateur

### Le probleme SEO

Cette approche bloque completement le referencement :

```text
Google Bot visite /profil/5
        ↓
Middleware detecte : pas de cookie d'auth
        ↓
Redirection vers /connexion
        ↓
Google indexe une page de connexion, pas le profil
        ↓
Aucune visibilite sur les recherches type "cours React Paris"
```

**Resultat** : Les profils SkillSwap sont invisibles sur Google, alors qu'ils representent le contenu le plus valuable pour le SEO (competences + localisation = mots-cles de recherche).

### Le dilemme

| Option                | SEO | Conversion | Probleme                   |
| --------------------- | --- | ---------- | -------------------------- |
| Profils 100% proteges | ❌  | ✅         | Google ne peut pas indexer |
| Profils 100% publics  | ✅  | ❌         | Plus besoin de s'inscrire  |

**Solution : Le Profil Teaser** - Un compromis intelligent utilise par LinkedIn, Superprof, Malt, etc.

---

## 2. La strategie Profil Teaser

### Principe

Afficher une **version limitee** du profil aux visiteurs non connectes :

- Suffisamment d'informations pour que Google indexe la page
- Suffisamment attrayant pour donner envie de s'inscrire
- Pas assez complet pour satisfaire le visiteur sans inscription

### Analogie

C'est comme la vitrine d'un magasin :

- On voit les produits (attractif)
- On lit les prix (information utile)
- Mais pour acheter, il faut entrer (conversion)

### Schema du flux utilisateur

```text
┌─────────────────────────────────────────────────────────────────┐
│                    VISITEUR ARRIVE SUR /profil/5                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Est connecte ? │
                    └─────────────────┘
                      │           │
                     NON         OUI
                      │           │
                      ▼           ▼
        ┌─────────────────┐   ┌─────────────────┐
        │  PROFIL TEASER  │   │  PROFIL COMPLET │
        │                 │   │                 │
        │ • Prenom + Init │   │ • Nom complet   │
        │ • Photo         │   │ • Photo         │
        │ • Ville         │   │ • Ville         │
        │ • Competences   │   │ • Competences   │
        │ • Note moyenne  │   │ • Tous les avis │
        │ • Desc tronquee │   │ • Desc complete │
        │                 │   │ • Disponibilites│
        │ ┌─────────────┐ │   │ • Btn Contacter │
        │ │ CTA Login   │ │   │ • Btn Suivre    │
        │ └─────────────┘ │   └─────────────────┘
        └─────────────────┘
                 │
                 ▼
        Clic sur "Se connecter"
                 │
                 ▼
        ┌─────────────────┐
        │ /connexion      │
        │ ?redirect=      │
        │ /profil/5       │
        └─────────────────┘
                 │
                 ▼
        Apres connexion → retour sur /profil/5 en mode COMPLET
```

---

## 3. Avantages de cette approche

### 3.1 SEO

| Element           | Impact                                           |
| ----------------- | ------------------------------------------------ |
| Titre dynamique   | "Alice D. - Cours de React a Paris \| SkillSwap" |
| Meta description  | Competences + ville = mots-cles recherches       |
| Contenu indexable | Google voit le teaser = la page existe           |
| URL canonique     | Evite le contenu duplique                        |

**Resultat attendu** : Les profils apparaissent dans les recherches type :

- "cours de guitare paris"
- "professeur react freelance"
- "apprendre typescript lyon"

### 3.2 Conversion

| Mecanisme               | Effet psychologique                   |
| ----------------------- | ------------------------------------- |
| Photo + prenom visibles | Cree une connexion humaine            |
| Competences affichees   | Confirme la pertinence                |
| Note moyenne visible    | Social proof (confiance)              |
| Description tronquee    | Frustration positive → curiosite      |
| Avis masques            | "Je veux lire les avis" → inscription |
| Bouton contact masque   | Action impossible → inscription       |

**Resultat attendu** : Augmentation du taux de conversion visiteur → inscription.

### 3.3 Protection des donnees

| Donnee         | Teaser | Complet | Justification                 |
| -------------- | ------ | ------- | ----------------------------- |
| Nom complet    | ❌     | ✅      | Evite contact hors plateforme |
| Email          | ❌     | ❌      | Jamais expose (RGPD)          |
| Adresse        | ❌     | ❌      | Jamais expose (RGPD)          |
| Disponibilites | ❌     | ✅      | Info a valeur ajoutee         |
| Avis detailles | ❌     | ✅      | Contenu premium               |

### 3.4 Comparaison avec la concurrence

| Plateforme | Strategie                           | Notre approche                           |
| ---------- | ----------------------------------- | ---------------------------------------- |
| LinkedIn   | Profil teaser + "Voir plus" payant  | ✅ Similar                               |
| Superprof  | Profil visible, contact payant      | Nous : contact gratuit apres inscription |
| Malt       | Profil complet, devis = inscription | ✅ Similar                               |

---

## 4. Specification fonctionnelle

### 4.1 Donnees affichees en mode Teaser

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   [Avatar 80px]    Alice D.                      ⭐ 4.8 (12)   │
│                    Paris, France                                │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ JavaScript    React    TypeScript                       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   A propos                                                      │
│   ─────────────────────────────────────────────────────────    │
│   Developpeur web passionne depuis 5 ans, je propose des       │
│   cours de React et TypeScript adaptes a votre niveau...       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                          │  │
│   │   🔒  Connectez-vous pour voir le profil complet        │  │
│   │                                                          │  │
│   │   Ce que vous debloquerez :                              │  │
│   │   • Description complete d'Alice                         │  │
│   │   • 12 avis detailles de la communaute                   │  │
│   │   • Ses disponibilites                                   │  │
│   │   • La possibilite de la contacter                       │  │
│   │                                                          │  │
│   │   [Se connecter]    [Creer un compte gratuit]            │  │
│   │                                                          │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Donnees affichees en mode Complet (connecte)

Tout le contenu actuel de la page profil :

- Nom complet (prenom + nom)
- Description complete
- Toutes les competences avec details
- Tous les centres d'interet
- Tous les avis avec commentaires
- Toutes les disponibilites
- Bouton "Contacter"
- Bouton "Suivre"

### 4.3 Regles metier

| Regle                  | Description                                  |
| ---------------------- | -------------------------------------------- |
| Troncature description | Maximum 150 caracteres + "..."               |
| Format nom teaser      | Prenom + initiale nom (ex: "Alice D.")       |
| Note moyenne           | Calculee cote backend, arrondie a 1 decimale |
| Nombre d'avis          | Affiche le count, pas le contenu             |
| Redirection post-login | Retour automatique sur le profil consulte    |

---

## 5. Architecture technique

### 5.1 Vue d'ensemble

```text
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  /profil/[id]/page.tsx (Server Component)                       │
│         │                                                       │
│         ├── Fetch donnees teaser (API publique)                 │
│         ├── Generate metadata SEO                               │
│         └── Render ProfileClient                                │
│                   │                                             │
│                   ▼                                             │
│         ProfileClient.tsx (Client Component)                    │
│                   │                                             │
│         ┌────────┴────────┐                                     │
│         │                 │                                     │
│    isAuthenticated?   !isAuthenticated?                         │
│         │                 │                                     │
│         ▼                 ▼                                     │
│  ProfileFull.tsx    ProfileTeaser.tsx                           │
│  (fetch complet)    (affiche teaser + CTA)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GET /api/v1/profiles/public/:id    (sans auth)                 │
│         │                                                       │
│         └── Retourne donnees TEASER uniquement                  │
│             • firstname                                         │
│             • lastnameInitial (calculee)                        │
│             • city                                              │
│             • avatarUrl                                         │
│             • descriptionPreview (tronquee)                     │
│             • skills[]                                          │
│             • averageRating                                     │
│             • reviewCount                                       │
│                                                                 │
│  GET /api/v1/profiles/:id           (avec auth)                 │
│         │                                                       │
│         └── Retourne donnees COMPLETES (existant)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Flux de donnees

```text
1. Google Bot ou Visiteur anonyme
   │
   ▼
2. GET /profil/5
   │
   ▼
3. Server Component (page.tsx)
   │
   ├── Fetch API publique: GET /api/v1/profiles/public/5
   │   └── Response: { firstname: "Alice", lastnameInitial: "D.", ... }
   │
   ├── generateMetadata() avec donnees teaser
   │   └── <title>Alice D. - JavaScript | SkillSwap</title>
   │
   └── Render <ProfileClient teaserProfile={data} />
       │
       ▼
4. Client Component (ProfileClient.tsx)
   │
   ├── useAuth() → isAuthenticated = false
   │
   └── Render <ProfileTeaser /> avec CTA

---

1. Utilisateur connecte
   │
   ▼
2. GET /profil/5
   │
   ▼
3. Server Component (page.tsx)
   │
   └── Meme chose (teaser pour metadata SEO)
       │
       ▼
4. Client Component (ProfileClient.tsx)
   │
   ├── useAuth() → isAuthenticated = true
   │
   ├── Fetch API authentifiee: GET /api/v1/profiles/5
   │   └── Response: { firstname: "Alice", lastname: "Dupont", ... }
   │
   └── Render <ProfileFull /> avec toutes les fonctionnalites
```

---

## 6. Statut d'implementation

> **Toutes les phases ont ete implementees le 27 janvier 2026**

### Resume des fichiers crees/modifies

| Fichier                          | Action  | Description                 |
| -------------------------------- | ------- | --------------------------- |
| `backend/.../profile.service.ts` | Modifie | Endpoint teaser             |
| `ProfilePage/ProfileTeaser.tsx`  | Cree    | Vue limitee visiteurs       |
| `ProfilePage/ProfileFull.tsx`    | Cree    | Vue complete connectes      |
| `ProfilePage/ProfileClient.tsx`  | Modifie | Orchestrateur teaser/full   |
| `lib/api-types.ts`               | Modifie | Type ProfileTeaser ajoute   |
| `app/.../profil/[id]/page.tsx`   | Modifie | Server Component + metadata |
| `middleware.ts`                  | Modifie | Route /profil/\* publique   |

### Phases completees

| Phase | Description                        | Statut |
| ----- | ---------------------------------- | ------ |
| 1     | Backend - Endpoint teaser          | ✅     |
| 2     | Frontend - Composant ProfileTeaser | ✅     |
| 3     | Frontend - Modifier ProfileClient  | ✅     |
| 4     | Types TypeScript                   | ✅     |
| 5     | Tests et validation                | ✅     |

### Tests effectues

- [x] Visiteur anonyme voit le teaser + CTA inscription
- [x] Utilisateur connecte voit le profil complet
- [x] Metadata SEO dynamiques (title, description, canonical)
- [x] Redirection post-login vers le profil consulte

---

## 7. Exemples de code

### 7.1 Backend - Service teaser

```typescript
// backend/src/services/profile.service.ts

export const getPublicProfileService = async (profileId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      firstname: true,
      lastname: true, // On recupere pour calculer l'initiale
      city: true,
      avatarUrl: true,
      description: true,
      skills: {
        include: { skill: true },
      },
      evaluationsReceived: {
        select: { score: true }, // Seulement les scores pour calculer la moyenne
      },
    },
  });

  if (!user) {
    throw new NotFoundError("L'utilisateur n'a pas ete trouve");
  }

  // Calculer les donnees teaser
  const reviewCount = user.evaluationsReceived.length;
  const averageRating =
    reviewCount > 0
      ? user.evaluationsReceived.reduce((sum, r) => sum + r.score, 0) /
        reviewCount
      : null;

  return {
    id: user.id,
    firstname: user.firstname,
    lastnameInitial: user.lastname.charAt(0).toUpperCase() + '.',
    city: user.city,
    avatarUrl: user.avatarUrl,
    descriptionPreview: user.description
      ? user.description.slice(0, 150) +
        (user.description.length > 150 ? '...' : '')
      : null,
    skills: user.skills,
    averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
    reviewCount,
  };
};
```

### 7.2 Frontend - Type ProfileTeaser

```typescript
// frontend/src/lib/api-types.ts

export interface ProfileTeaser {
  id: number;
  firstname: string;
  lastnameInitial: string; // "D."
  city: string | null;
  avatarUrl: string | null;
  descriptionPreview: string | null; // Tronquee a 150 chars
  skills: Array<{
    skillId: number;
    skill: { id: number; name: string };
  }>;
  averageRating: number | null; // 4.8
  reviewCount: number; // 12
}
```

### 7.3 Frontend - ProfileClient avec condition

```typescript
// frontend/src/components/organisms/ProfilePage/ProfileClient.tsx

'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { ProfileTeaser } from './ProfileTeaser';
import { ProfileFull } from './ProfileFull';
import type { ProfileTeaser as ProfileTeaserType } from '@/lib/api-types';

interface ProfileClientProps {
  teaserProfile: ProfileTeaserType;
}

export function ProfileClient({ teaserProfile }: ProfileClientProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Pendant le chargement de l'auth, afficher le teaser
  if (isLoading) {
    return <ProfileTeaser profile={teaserProfile} />;
  }

  // Non connecte : afficher teaser + CTA
  if (!isAuthenticated) {
    return <ProfileTeaser profile={teaserProfile} />;
  }

  // Connecte : afficher profil complet
  return <ProfileFull profileId={teaserProfile.id} />;
}
```

### 7.4 Frontend - Composant ProfileTeaser

```typescript
// frontend/src/components/organisms/ProfilePage/ProfileTeaser.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Badge, Button, Card } from '@/components/atoms';
import { Star, Lock } from 'lucide-react';
import type { ProfileTeaser as ProfileTeaserType } from '@/lib/api-types';

interface ProfileTeaserProps {
  profile: ProfileTeaserType;
}

export function ProfileTeaser({ profile }: ProfileTeaserProps) {
  const pathname = usePathname();
  const loginUrl = `/connexion?redirect=${encodeURIComponent(pathname)}`;
  const registerUrl = `/inscription?redirect=${encodeURIComponent(pathname)}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          src={profile.avatarUrl}
          alt={profile.firstname}
          className="w-20 h-20"
        />
        <div>
          <h1 className="text-2xl font-bold">
            {profile.firstname} {profile.lastnameInitial}
          </h1>
          {profile.city && (
            <p className="text-muted-foreground">{profile.city}</p>
          )}
          {profile.averageRating && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{profile.averageRating}</span>
              <span className="text-muted-foreground">
                ({profile.reviewCount} avis)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Competences */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Competences</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <Badge key={s.skillId} variant="secondary">
              {s.skill.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Description tronquee */}
      {profile.descriptionPreview && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">A propos</h2>
          <p className="text-muted-foreground">{profile.descriptionPreview}</p>
        </section>
      )}

      {/* CTA Block */}
      <Card className="p-6 bg-muted/50 border-2 border-dashed">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">
            Connectez-vous pour voir le profil complet
          </h3>
        </div>

        <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
          <li>• Description complete de {profile.firstname}</li>
          <li>• {profile.reviewCount} avis detailles de la communaute</li>
          <li>• Ses disponibilites</li>
          <li>• La possibilite de contacter {profile.firstname}</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href={loginUrl}>Se connecter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={registerUrl}>Creer un compte gratuit</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

---

## Ressources

- [LinkedIn Public Profile Strategy](https://engineering.linkedin.com/blog)
- [Superprof SEO Case Study](https://www.superprof.fr/)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/building-your-application/authentication)

---

## Changelog

| Date       | Auteur     | Modification                                              |
| ---------- | ---------- | --------------------------------------------------------- |
| 27/01/2026 | Equipe SEO | Implementation complete (backend + frontend + composants) |
| 27/01/2026 | Equipe SEO | Creation du document                                      |
