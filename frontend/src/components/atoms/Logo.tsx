import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Définition des variantes de taille pour le conteneur
const logoVariants = cva(
  // Classes de base : flexbox pour aligner icône + texte
  'inline-flex items-center gap-2 transition-opacity hover:opacity-80',
  {
    variants: {
      // Taille : contrôle la dimension de l'image et du texte
      size: {
        sm: 'text-lg', // Petit : footer, navbar mobile
        md: 'text-xl', // Moyen : header principal
        lg: 'text-2xl', // Grand : hero section
        xl: 'text-3xl', // Très grand.
      },
    },
    defaultVariants: {
      size: 'xl',
    },
  },
);

// Mapping des tailles vers les dimensions de l'image en pixels
const imageSizes = {
  sm: 28, // Petite icône
  md: 36, // Icône moyenne
  lg: 48, // Grande icône
  xl: 120, // Très grande icône
};

// Interface des props du composant
interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string; // Classes CSS additionnelles
  asLink?: boolean; // Si true, le logo est cliquable (lien vers /)
  showText?: boolean; // Si true, affiche "SkillSwap" à côté de l'icône
  iconOnly?: boolean; // Si true, affiche uniquement l'icône (sans texte)
}

export function Logo({
  size = 'md',
  className,
  asLink = true,
  showText = true,
  iconOnly = false,
}: LogoProps) {
  // Récupère la dimension de l'image selon la taille choisie
  const imageSize = imageSizes[size || 'md'];

  // Contenu du logo : icône + texte optionnel
  const content = (
    <span className={cn(logoVariants({ size }), className)}>
      {/* Image du logo (LOGO-SOLO.png) */}
      <Image
        src="/assets/LOGO-SOLO.png"
        alt="SkillSwap"
        width={imageSize}
        height={imageSize}
        className="object-contain"
        priority // Charge l'image en priorité (au-dessus de la ligne de flottaison)
      />

      {/* Texte "SkillSwap" affiché si showText=true et iconOnly=false */}
      {showText && !iconOnly && (
        <span className="hidden font-bold tracking-tight sm:flex">
          {/* "Skill" en rouge (couleur primaire) */}
          <span className="text-primary-700">Skill</span>
          {/* "Swap" en gris foncé / blanc en dark mode */}
          <span className="text-zinc-700 dark:text-zinc-300">Swap</span>
        </span>
      )}
    </span>
  );

  // Si asLink est true, on wrappe le contenu dans un Link
  if (asLink) {
    return (
      <Link href="/" className="inline-block">
        {content}
      </Link>
    );
  }

  // Sinon on retourne juste le contenu
  return content;
}
