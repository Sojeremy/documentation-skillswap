import { StepHowItWorks } from '@/components/molecules/StepHowItWorks';

// ============================================================================
// Composant HowItWorksSection
// ============================================================================
//
// À QUOI SERT CE FICHIER ?
// Affiche la section "Comment ça marche ?" avec les 3 étapes :
// 1. Créez votre profil
// 2. Trouvez un partenaire
// 3. Échangez vos savoirs
//
// OÙ EST-IL UTILISÉ ?
// - Landing page : deuxième section après le Hero
//
// COMMENT L'UTILISER ?
//   <HowItWorksSection />
//
// ============================================================================

// Données des 3 étapes
const steps = [
  {
    stepNumber: 1,
    title: 'Créez votre profil',
    description:
      'Listez vos compétences à partager et celles que vous souhaitez apprendre.',
  },
  {
    stepNumber: 2,
    title: 'Trouvez un partenaire',
    description:
      "Parcourez les profils et trouvez quelqu'un dont les compétences vous intéressent.",
  },
  {
    stepNumber: 3,
    title: 'Échangez vos savoirs',
    description: "Organisez une session d'échange et apprenez mutuellement.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 bg-white dark:bg-zinc-950"
    >
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-12">
          Comment ça marche ?
        </h2>

        {/* Grille des 3 étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <StepHowItWorks
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
