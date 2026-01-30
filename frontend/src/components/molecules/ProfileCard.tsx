import { cn, getInitialsFromName } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { Rating } from '@/components/atoms/Rating';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Link } from '@/components/atoms/Link';

// ============================================================================
// Composant ProfileCard
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche une carte de profil membre avec :
// - Avatar + Nom
// - Badges de compétences
// - Note (étoiles) + nombre d'avis
// - Bouton "Voir" pour accéder au profil
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : section "Membres de la communauté"
// - Page recherche : résultats de recherche
//
// COMMENT L'UTILISER ?
//   <ProfileCard
//     id={1}
//     firstname="Sophie"
//     lastname="Martin"
//     avatarUrl="/avatars/sophie.jpg"
//     skills={["React", "TypeScript"]}
//     rating={4.5}
//     reviewCount={12}
//   />
//
// ============================================================================

interface ProfileCardProps {
  id: number | string; // ID du profil (pour le lien)
  firstname: string;
  lastname: string;
  avatarUrl?: string | null;
  skills: string[]; // Liste des compétences à afficher (max 2-3)
  rating?: number; // Note moyenne (0-5)
  reviewCount?: number; // Nombre d'avis
  className?: string;
}

export function ProfileCard({
  id,
  firstname,
  lastname,
  avatarUrl,
  skills,
  rating = 0,
  reviewCount = 0,
  className,
}: ProfileCardProps) {
  // Initiales pour l'avatar (ex: "SM" pour Sophie Martin)
  const initials = getInitialsFromName(`${firstname} ${lastname}`);

  return (
    <Card
      className={cn(
        `p-4 flex flex-col gap-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg`,
        className,
      )}
    >
      {/* Ligne du haut : Avatar + Nom */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={avatarUrl} initials={initials} size="md" />
        <span className="font-medium text-zinc-900">
          {firstname} {lastname}
        </span>
      </div>

      {/* Badges de compétences */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.slice(0, 3).map((skill) => (
          <Badge key={skill} size="sm">
            {skill}
          </Badge>
        ))}
      </div>

      {/* Ligne du bas : Rating + Bouton Voir */}
      <div className="flex items-center justify-between">
        <Rating score={rating} showCount count={reviewCount} size={14} />

        <Button variant="outline" size="sm" asChild={true}>
          <Link href={`/profil/${id}`}>Voir</Link>
        </Button>
      </div>
    </Card>
  );
}
