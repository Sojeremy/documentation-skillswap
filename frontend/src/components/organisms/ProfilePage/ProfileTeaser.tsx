'use client';

// =============================================================================
// PROFILE TEASER - Version limitée pour visiteurs non connectés
// =============================================================================
//
// Stratégie SEO/Conversion :
// - Montre assez d'infos pour intéresser le visiteur
// - Masque le contenu premium pour inciter à l'inscription
// - Google peut indexer les données visibles (SEO)
//
// @see /frontend/src/.code-review/profil-teaser-strategy.md
// =============================================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Star,
  Lock,
  MessageCircle,
  Heart,
  Calendar,
  FileText,
} from 'lucide-react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { MainLayout } from '@/components/layouts/MainLayout';
import type { ProfileTeaser as ProfileTeaserType } from '@/lib/api-types';

interface ProfileTeaserProps {
  profile: ProfileTeaserType;
}

export function ProfileTeaser({ profile }: ProfileTeaserProps) {
  const pathname = usePathname();
  const loginUrl = `/connexion?redirect=${encodeURIComponent(pathname)}`;
  const registerUrl = `/inscription?redirect=${encodeURIComponent(pathname)}`;

  // Initiales pour l'avatar fallback
  const firstInitial = profile.firstname?.charAt(0) || '?';
  const lastInitial = profile.lastnameInitial?.charAt(0) || '?';
  const initials = `${firstInitial}${lastInitial}`;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header du profil */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <Avatar
            src={profile.avatarUrl}
            initials={initials}
            size="2xl"
            alt={`${profile.firstname} ${profile.lastnameInitial}`}
            className="border-4 border-background shadow-lg"
          />

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {profile.firstname} {profile.lastnameInitial}
            </h1>

            {profile.city && (
              <p className="text-muted-foreground mb-2">{profile.city}</p>
            )}

            {/* Note moyenne */}
            {profile.averageRating !== null && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{profile.averageRating}</span>
                <span className="text-muted-foreground">
                  ({profile.reviewCount} avis)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Compétences - VISIBLE (important pour SEO) */}
        {profile.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Compétences proposées
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s.skillId} variant="secondary" className="text-sm">
                  {s.skill?.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Description - TRONQUÉE */}
        {profile.descriptionPreview && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">À propos</h2>
            <p className="text-muted-foreground leading-relaxed">
              {profile.descriptionPreview}
            </p>
          </section>
        )}

        {/* Bloc CTA - Incitation à l'inscription */}
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                Connectez-vous pour voir le profil complet
              </h3>
            </div>

            <p className="text-muted-foreground mb-4">
              Créez un compte gratuit pour accéder à toutes les fonctionnalités
              :
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>Description complète de {profile.firstname}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span>
                  {profile.reviewCount > 0
                    ? `${profile.reviewCount} avis détaillés de la communauté`
                    : 'Avis de la communauté'}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Ses disponibilités</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span>Ses centres d&apos;intérêt</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span>La possibilité de contacter {profile.firstname}</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link href={registerUrl}>Créer un compte gratuit</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href={loginUrl}>Se connecter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
