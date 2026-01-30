import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URLs statiques publiques
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/connexion`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/inscription`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // URLs dynamiques : profils publics
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/search/top-rated?limit=1000`, // Augmenter la limite
      {
        next: { revalidate: 3600 },
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
