import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';

// ============================================================================
// Composant HeroSection
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche la bannière principale de la landing page avec :
// - Un titre accrocheur
// - Une description de la plateforme
// - Un bouton CTA (Call to Action) pour s'inscrire
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : section hero en haut de page
//
// COMMENT L'UTILISER ?
//   <HeroSection />
//
// ============================================================================

export function HeroSection() {
  return (
    <section
      id="discover"
      className="bg-linear-to-b from-primary-50 to-white dark:from-zinc-900 dark:to-zinc-950 py-16 md:py-24"
    >
      <div className="container mx-auto px-4 text-center">
        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Échangez vos{' '}
          <span className="text-primary-600 dark:text-primary-400">
            compétences
          </span>
        </h1>

        {/* Sous-titre / Description */}
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
          SkillSwap connecte les personnes qui veulent apprendre avec celles qui
          veulent enseigner. Partagez vos talents, découvrez de nouvelles
          passions.
        </p>

        {/* Boutons CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild={true}>
            <Link href="/inscription">Commencer gratuitement </Link>
          </Button>
          <Button variant="outline" size="lg" asChild={true}>
            <Link href="/recherche">Explorer les compétences</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
