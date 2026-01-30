import type { MetadataRoute } from 'next';

/**
 * Génère dynamiquement le fichier robots.txt
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 *
 * Comportement :
 * - En dev/staging : bloque complètement l'indexation
 * - En production : autorise les pages publiques, bloque les pages privées
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // En dev/staging : bloquer complètement l'indexation
  // Évite que Google indexe un environnement de test par erreur
  if (process.env.NODE_ENV !== 'production') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  // En production : règles SEO optimisées
  return {
    rules: [
      {
        userAgent: '*',
        // Pages publiques autorisées
        allow: ['/', '/profil/'],
        // Pages privées ou inutiles à indexer
        disallow: [
          '/conversation', // Messagerie privée
          '/mon-profil', // Édition de profil (authentifié)
          '/connexion', // Page de login
          '/inscription', // Page d'inscription
          '/_next/', // Fichiers Next.js internes
          '/api/', // Routes API
          '/recherche',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
