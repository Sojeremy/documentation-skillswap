# Structure Actuelle du Frontend

> **Derniere mise a jour**: 27 janvier 2026 (branch `SEO` - implementation SEO + Profil Teaser)

[← Retour au README](./README.md)

---

## Arborescence complete

```plaintext
frontend/src/                              # ~123 fichiers TS/TSX
│
├── middleware.ts                          # Middleware Next.js (protection routes)
│
├── app/                                   # Next.js App Router (12 fichiers)
│   ├── globals.css                        # Styles globaux Tailwind
│   ├── layout.tsx                         # Layout racine + metadata SEO
│   ├── page.tsx                           # Landing page (/)
│   │
│   ├── (app)/                             # Routes authentifiees
│   │   ├── conversation/
│   │   │   └── page.tsx                   # Page messagerie (/conversation)
│   │   ├── mon-profil/
│   │   │   └── page.tsx                   # Page edition profil (/mon-profil) ✅ NEW
│   │   ├── profil/
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Server Component + generateMetadata ✅ SEO
│   │   └── recherche/
│   │       ├── layout.tsx                 # Layout recherche + metadata SEO
│   │       └── page.tsx                   # Page recherche (/recherche)
│   │
│   └── (auth)/                            # Routes non-authentifiees
│       ├── connexion/
│       │   ├── layout.tsx                 # Layout connexion + metadata SEO
│       │   └── page.tsx                   # Page login (/connexion)
│       └── inscription/
│           ├── layout.tsx                 # Layout inscription + metadata SEO
│           └── page.tsx                   # Page register (/inscription)
│
├── components/                            # Composants React (~73 fichiers)
│   │
│   ├── atoms/                             # 18 fichiers
│   │   ├── index.ts                       # Barrel export
│   │   ├── Avatar.tsx                     # Avatar utilisateur
│   │   ├── Badge.tsx                      # Badge/tag stylise (+ variant selected)
│   │   ├── Button.tsx                     # Bouton avec variants
│   │   ├── Card.tsx                       # Card + sous-composants
│   │   ├── Dialog.tsx                     # Modal dialog
│   │   ├── DropdownMenu.tsx               # Menu deroulant
│   │   ├── Form.tsx                       # Composants formulaire (react-hook-form) ✅ NEW
│   │   ├── Icons.tsx                      # Icones SVG (factory pattern)
│   │   ├── Input.tsx                      # Champ texte
│   │   ├── Label.tsx                      # Label formulaire
│   │   ├── Link.tsx                       # Lien Next.js
│   │   ├── Logo.tsx                       # Logo SkillSwap
│   │   ├── PasswordInput.tsx              # Input mot de passe avec toggle ✅ NEW
│   │   ├── Rating.tsx                     # Etoiles notation
│   │   ├── Select.tsx                     # Select dropdown ✅ NEW
│   │   ├── Separator.tsx                  # Separateur horizontal
│   │   ├── Textarea.tsx                   # Zone texte multiligne
│   │   └── Toast.tsx                      # Toast notifications (sonner)
│   │
│   ├── molecules/                         # 10 fichiers
│   │   ├── index.ts                       # Barrel export
│   │   ├── ConfirmDialog.tsx              # Dialog de confirmation
│   │   ├── ConversationItem.tsx           # Item liste conversations
│   │   ├── ConversationSkeleton.tsx       # Skeleton loading
│   │   ├── EmptyState.tsx                 # Etat vide generique
│   │   ├── MessageBubble.tsx              # Bulle de message
│   │   ├── Pagination.tsx                 # Pagination composant ✅ NEW
│   │   ├── ProfileCard.tsx                # Carte profil membre
│   │   ├── StepHowItWorks.tsx             # Etape how it works
│   │   └── UserDropdown.tsx               # Dropdown utilisateur Header
│   │
│   ├── organisms/                         # Structure par feature (~43 fichiers)
│   │   ├── index.ts                       # Barrel export
│   │   ├── AuthForm.tsx                   # Formulaire login/register
│   │   ├── Footer.tsx                     # Footer site
│   │   │
│   │   ├── Header/                        # Navigation principale (6 fichiers)
│   │   │   ├── index.tsx                  # Orchestration
│   │   │   ├── AuthButtons.tsx            # Boutons connexion/inscription
│   │   │   ├── DesktopNav.tsx             # Navigation desktop
│   │   │   ├── MobileNav.tsx              # Menu hamburger mobile
│   │   │   ├── AccountSettingsDialog.tsx  # Dialog parametres compte
│   │   │   └── SettingsPanel.tsx          # Panneau parametres
│   │   │
│   │   ├── HomePage/                      # Landing page (5 fichiers)
│   │   │   ├── index.ts                   # Barrel export
│   │   │   ├── HeroSection.tsx            # Hero avec CTA
│   │   │   ├── HowItWorksSection.tsx      # Section "Comment ca marche"
│   │   │   ├── CategoriesSection.tsx      # Section categories
│   │   │   └── MembersSection.tsx         # Section membres
│   │   │
│   │   ├── ConversationPage/              # Messagerie (12 fichiers)
│   │   │   ├── index.ts                   # Barrel export
│   │   │   ├── ConversationSection.tsx    # Liste conversations
│   │   │   ├── NewConversationDialog.tsx  # Dialog nouvelle conversation
│   │   │   ├── NewMessageDialog.tsx       # Dialog nouveau message
│   │   │   ├── RatingDialog.tsx           # Dialog notation utilisateur
│   │   │   ├── useConversationState.ts    # Hook etat conversations ✅ NEW
│   │   │   │
│   │   │   └── MessageThread/             # Thread de messages (6 fichiers)
│   │   │       ├── index.tsx              # Orchestration
│   │   │       ├── ThreadHeader.tsx       # Header thread
│   │   │       ├── MessageList.tsx        # Liste messages
│   │   │       ├── MessageInput.tsx       # Zone saisie
│   │   │       ├── ThreadDialogs.tsx      # Dialogs rating/confirm
│   │   │       └── useThreadState.ts      # Hook etat thread
│   │   │
│   │   ├── ProfilePage/                   # Page profil (14 fichiers)
│   │   │   ├── index.ts                   # Barrel export
│   │   │   ├── ProfileClient.tsx          # Orchestrateur teaser/full ✅ SEO
│   │   │   ├── ProfileTeaser.tsx          # Vue limitee (visiteurs) ✅ SEO
│   │   │   ├── ProfileFull.tsx            # Vue complete (connectes) ✅ SEO
│   │   │   ├── ProfileHeader.tsx          # Header profil
│   │   │   ├── SkillsSection.tsx          # Section competences
│   │   │   ├── InterestsSection.tsx       # Section centres d'interet
│   │   │   ├── AvailabilitySection.tsx    # Section disponibilites
│   │   │   ├── ReviewsSection.tsx         # Section avis recus
│   │   │   │
│   │   │   └── EditPage/                  # Edition profil (5 fichiers)
│   │   │       ├── AddAvailabilityDialog.tsx   # Dialog ajout disponibilite
│   │   │       ├── AddSkillDialog.tsx          # Dialog ajout competence
│   │   │       ├── PrivateSettingSection.tsx   # Parametres prives
│   │   │       ├── ProfileUpdateHeader.tsx     # Header edition
│   │   │       └── UpdateAvatarDialog.tsx      # Dialog changement avatar
│   │   │
│   │   └── SearchPage/                    # Page recherche (5 fichiers)
│   │       ├── index.tsx                  # Orchestration principale
│   │       ├── SearchBar.tsx              # Input + icone + bouton
│   │       ├── CategoryFilter.tsx         # Badges categories cliquables
│   │       ├── SearchResults.tsx          # Grid ProfileCards + EmptyState
│   │       └── SearchResultSkeleton.tsx   # Skeleton loading recherche ✅ NEW
│   │
│   ├── layouts/                           # 1 fichier
│   │   └── MainLayout.tsx                 # Layout principal (Header + Footer)
│   │
│   └── providers/                         # 1 fichier
│       └── AuthProvider.tsx               # Provider authentification
│
├── hooks/                                 # Custom hooks (22 fichiers)
│   ├── index.ts                           # Barrel export
│   ├── useAccount.ts                      # Operations compte utilisateur ✅ NEW
│   ├── useAutoScroll.ts                   # Auto-scroll pour messages
│   ├── useFormState.ts                    # Hook formulaires generique
│   ├── useIsMobile.ts                     # Detection mobile
│   ├── useMessaging.ts                    # Hook facade messaging
│   ├── useSearch.ts                       # Hook recherche avec debounce
│   ├── useSocket.ts                       # Hook connexion WebSocket ✅ NEW
│   ├── useTopCategories.ts                # Hook categories populaires ✅ NEW
│   │
│   ├── messaging/                         # Hooks messagerie (8 fichiers)
│   │   ├── index.ts                       # Barrel export
│   │   ├── useConversationActions.ts      # CRUD actions
│   │   ├── useConversationList.ts         # Liste conversations
│   │   ├── useConversationMessages.ts     # Messages d'une conversation ✅ NEW
│   │   ├── useFollowedUsers.ts            # Utilisateurs suivis
│   │   ├── useGlobalSocket.ts             # Socket global temps reel ✅ NEW
│   │   ├── useMessagingScroll.ts          # Scroll infini messages ✅ NEW
│   │   └── useSelectedConversation.ts     # Selection conversation
│   │
│   └── profile/                           # Hooks profil (7 fichiers) ✅ NEW
│       ├── index.ts                       # Barrel export
│       ├── useAvailabilities.ts           # Gestion disponibilites
│       ├── useDialogs.ts                  # Gestion modales profil
│       ├── useInterests.ts                # Gestion centres d'interet
│       ├── useProfile.ts                  # Fetch profil utilisateur
│       ├── useProfileUpdate.ts            # Mise a jour profil
│       └── useSkills.ts                   # Gestion competences
│
└── lib/                                   # Utilitaires (15 fichiers)
    ├── api-client.ts                      # Client API centralise
    ├── api-types.ts                       # Types reponses API
    ├── dateTime.utils.ts                  # Utilitaires date/heure
    ├── form-styles.ts                     # Styles partages formulaires
    ├── socket-client.ts                   # Client Socket.io ✅ NEW
    ├── utils.ts                           # Fonctions utilitaires
    │
    ├── mock-data/                         # Donnees de test (6 fichiers)
    │   ├── mockCategories.ts              # Categories mock
    │   ├── mockConversation.ts            # Conversations mock
    │   ├── mockMembers.ts                 # Membres mock
    │   ├── mockProfile.ts                 # Profil mock
    │   ├── mockSearch.ts                  # Recherche mock
    │   └── mockUser.ts                    # Utilisateur mock
    │
    └── validation/                        # Schemas Zod (4 fichiers)
        ├── auth.validation.ts             # Validation login/register
        ├── conversation.validation.ts     # Validation conversations
        ├── updatePassword.validation.ts   # Validation changement mdp ✅ NEW
        └── updateProfile.validation.ts    # Validation mise a jour profil ✅ NEW
```

---

## Comptage par dossier

| Dossier                 | Fichiers | Evolution | Notes                                |
| ----------------------- | -------- | --------- | ------------------------------------ |
| `app/`                  | 12       | +1        | + mon-profil page                    |
| `components/atoms/`     | 18       | +2        | + Form, PasswordInput, Select        |
| `components/molecules/` | 10       | +1        | + Pagination                         |
| `components/organisms/` | ~43      | +6        | + EditPage/, SearchResultSkeleton    |
| `components/layouts/`   | 1        | -         | MainLayout                           |
| `components/providers/` | 1        | -         | AuthProvider                         |
| `hooks/`                | 22       | +12       | + messaging/, profile/, useSocket... |
| `lib/`                  | 15       | +3        | + socket-client, validations         |
| **Root**                | 1        | -         | middleware.ts                        |
| **TOTAL**               | **~123** | **+28**   | (hors .code-review/)                 |

---

## Nouveautes depuis le 21 janvier 2026

### SEO & Profil Teaser (27 janvier 2026)

- `app/robots.ts` - robots.txt dynamique
- `app/sitemap.ts` - Sitemap dynamique (tous profils)
- `app/(app)/profil/[id]/page.tsx` - Server Component + generateMetadata
- `organisms/ProfilePage/ProfileClient.tsx` - Orchestrateur teaser/full
- `organisms/ProfilePage/ProfileTeaser.tsx` - Vue limitee (visiteurs)
- `organisms/ProfilePage/ProfileFull.tsx` - Vue complete (connectes)
- `lib/api-types.ts` - Type ProfileTeaser ajoute
- `middleware.ts` - Route /profil/\* rendue publique

### WebSocket & Temps reel

- `lib/socket-client.ts` - Configuration Socket.io client
- `hooks/useSocket.ts` - Hook connexion WebSocket
- `hooks/messaging/useGlobalSocket.ts` - Socket global pour notifications
- `hooks/messaging/useConversationMessages.ts` - Messages temps reel
- `hooks/messaging/useMessagingScroll.ts` - Infinite scroll messages

### Edition de profil

- `app/(app)/mon-profil/page.tsx` - Nouvelle page edition
- `hooks/profile/*` - 7 hooks dedies au profil
- `organisms/ProfilePage/EditPage/*` - 5 composants d'edition
- `lib/validation/updateProfile.validation.ts` - Validation Zod
- `lib/validation/updatePassword.validation.ts` - Validation mot de passe

### Composants UI

- `atoms/Form.tsx` - Integration react-hook-form
- `atoms/PasswordInput.tsx` - Input avec toggle visibilite
- `atoms/Select.tsx` - Select dropdown accessible
- `molecules/Pagination.tsx` - Composant pagination
- `organisms/SearchPage/SearchResultSkeleton.tsx` - Loading state

---

## Patterns utilises

| Pattern              | Emplacement             | Description                    |
| -------------------- | ----------------------- | ------------------------------ |
| Atomic Design        | `components/`           | atoms → molecules → organisms  |
| Feature Folders      | `organisms/*/`          | Groupement par fonctionnalite  |
| Barrel Exports       | `*/index.ts`            | Imports simplifies             |
| Factory Pattern      | `atoms/Icons.tsx`       | Creation d'icones standardisee |
| Facade Pattern       | `hooks/useMessaging.ts` | Abstraction des hooks internes |
| API Client Singleton | `lib/api-client.ts`     | Point d'acces unique API       |
| Socket Singleton     | `lib/socket-client.ts`  | Connexion WebSocket partagee   |
| Validation Zod       | `lib/validation/*.ts`   | Schemas type-safe              |
| Custom Hooks         | `hooks/profile/*`       | Separation logique metier/UI   |
| Infinite Scroll      | `useMessagingScroll.ts` | Chargement progressif messages |

---

## Stack technique

| Technologie      | Version | Usage                        |
| ---------------- | ------- | ---------------------------- |
| Next.js          | 16.1.1  | Framework React (App Router) |
| React            | 19.2.3  | UI Library                   |
| TypeScript       | 5.x     | Typage statique              |
| Tailwind CSS     | 4.1.18  | Styling utility-first        |
| shadcn/ui        | -       | Composants accessibles       |
| Socket.io-client | 4.8.3   | WebSocket temps reel         |
| React Hook Form  | 7.71.1  | Gestion formulaires          |
| Zod              | 4.3.5   | Validation schemas           |
| Lucide React     | -       | Icones                       |
| Sonner           | -       | Toast notifications          |

---

[← Retour au README](./README.md)
