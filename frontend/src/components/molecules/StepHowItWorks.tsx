import { cn } from '@/lib/utils';

// ============================================================================
// Composant StepHowItWorks
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche une étape du processus "Comment ça marche" avec :
// - Un cercle numéroté (1, 2, 3)
// - Un titre
// - Une description
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : section "Comment ça marche ?" (3 étapes)
//
// COMMENT L'UTILISER ?
//   <StepHowItWorks
//     stepNumber={1}
//     title="Créez votre profil"
//     description="Listez vos compétences à partager..."
//   />
//
// ============================================================================

interface StepHowItWorksProps {
  stepNumber: number; // Numéro de l'étape (1, 2, 3)
  title: string; // Titre de l'étape
  description: string; // Description de l'étape
  className?: string;
}

export function StepHowItWorks({
  stepNumber,
  title,
  description,
  className,
}: StepHowItWorksProps) {
  return (
    <div
      className={cn('flex flex-col items-center text-center', className)}
      aria-label={`Étape ${stepNumber}: ${title}`}
    >
      {/* Cercle numéroté */}
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
        aria-hidden="true"
      >
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
          {stepNumber}
        </span>
      </div>

      {/* Titre */}
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
        {description}
      </p>
    </div>
  );
}
