// =============================================================================
// Section 08 — Sécurité (REAC §8)
// Volume cible : 2-3 pages
// Réf : docs/documentation-implementation/arc42/08-crosscutting/security.md
// =============================================================================

= Sécurité

== Sécurité de la messagerie temps réel — 6 contrôles

// TODO : détailler les 6 contrôles présents dans backend/src/realtime/socket.ts

=== 1. Authentification socket par cookie JWT
// Le serveur lit le cookie httpOnly accessToken au handshake, vérifie la
// signature JWT, extrait userId. Refus de la connexion si invalide.
// Réf : socket.ts:88-122

=== 2. Vérification participant à `conversation:join`
// Avant d'autoriser un client à rejoindre une room conversation, le serveur
// vérifie via UserHasConversation que l'utilisateur en est bien membre.
// Réf : socket.ts:136-152

=== 3. Vérification participant à `message:send` (défense en profondeur)
// Même un client qui aurait contourné le join ne peut pas envoyer un message
// dans une conversation dont il n'est pas membre — vérif systématique.
// Réf : socket.ts:222-230

=== 4. Validation stricte des entrées
// `Number.isInteger(conversationId)`, `String().trim()`, longueur message
// bornée à 2000 caractères. Refus avec event `error` typé (FORBIDDEN /
// VALIDATION).
// Réf : socket.ts:131-186

=== 5. Refus si conversation fermée
// Si Conversation.status === 'Close', le serveur refuse l'envoi (event error
// FORBIDDEN). Côté UI, l'input est désactivé, mais la défense côté serveur
// est indépendante (defense in depth).
// Réf : socket.ts:214-220, MessageInput.tsx:41

=== 6. Cloisonnement par rooms
// Deux types de rooms : `conversation:${id}` (clients actifs sur ce thread)
// et `user:${id}` (notifications globales par utilisateur). Empêche la
// diffusion croisée.
// Réf : socket.ts:128, 155, 444-446

== Authentification — argon2 + JWT + refresh token rotatif

=== Hashing argon2
// argon2 (memory-hard, résistant aux GPU) plutôt que bcrypt.
// Décision documentée dans ADR-007.
// Réf : backend/src/services/auth.service.ts:21

=== JWT en cookie httpOnly
// accessToken : JWT court (ex. 15 min), cookie httpOnly + secure (en prod) +
// sameSite='strict' (en prod) → inaccessible au JavaScript, protégé contre
// CSRF par sameSite.
// Réf : auth.controller.ts:68-94

=== Rotation refresh token
// À chaque /refresh, l'ancien refresh token est invalidé et un nouveau est
// émis. Empêche le rejeu en cas de fuite (window de validité minimale).
// Réf : auth.service.ts:103-108

== Validation des entrées — Zod sur tous les endpoints REST

// TODO : Zod appliqué via le middleware `validate(dataSource, schema)` sur
// chaque route REST sensible (auth, profile, conversation, search, follow).
// Schémas dans backend/src/validation/*.

```ts
// backend/src/middlewares/auth.middleware.ts:8-13
export const validate = (dataSource: DataSource, schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req[dataSource]);
    next();
  };
};
```

== Upload avatar — défense en profondeur

// TODO :
// - Front : validation MIME `image/*`, taille ≤ 5 Mo, preview FileReader.
// - Back : multer fileFilter whitelist (jpeg/jpg/png), limite 5 Mo,
//   nommage forcé serveur (`avatar-${userId}-${timestamp}.ext`) → pas de
//   path traversal possible.
// Réf : middlewares/upload.middleware.ts, UpdateAvatarDialog.tsx

== CORS et headers

// TODO :
// - CORS configuré sur `config.allowedOrigin` avec `credentials: true`
//   (cookies cross-origin contrôlés)
// - HTTPS Let's Encrypt en prod
// - Headers nginx (à détailler depuis devops/nginx/prod.conf)

== Dette assumée

// TODO : être honnête avec le jury (gain de crédibilité)
// - Helmet absent — pas de durcissement headers HTTP côté Express
//   (à ajouter en V2)
// - Rate limiting absent (express-rate-limit) — surface DoS
// - Validation Socket.IO non-Zod (manuelle, `Number.isInteger` + `String()`)
//   — trade-off documenté
// - RGAA non auditée formellement (accessibilité testée à la main)
// - CSP : pas de Content-Security-Policy stricte
