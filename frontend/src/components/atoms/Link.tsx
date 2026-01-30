import { cva, type VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import { type ComponentProps } from 'react';

// Définition des variantes de style pour les liens
const linkVariants = cva(
  // Classes de base : transition et style de focus pour l'accessibilité
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // Lien par défaut : discret, s'éclaircit au hover
        default: 'dark:text-zinc-400 dark:hover:text-white',

        // Lien de navigation : pour le header, plus visible
        nav: 'text-zinc-700 hover:text-primary-500 dark:text-zinc-300 dark:hover:text-primary-400 font-medium',

        // Lien de footer : plus petit et discret
        footer:
          'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-sm',

        // Lien call-to-action : couleur primaire, attire l'attention
        cta: 'text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-semibold',
      },
    },
    // Variante par défaut
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Interface des props
// ComponentProps<typeof NextLink> : hérite de toutes les props de next/link
// (href, target, prefetch, replace, scroll, etc.)
// VariantProps<typeof linkVariants> : ajoute la prop "variant" typée
interface LinkProps
  extends ComponentProps<typeof NextLink>, VariantProps<typeof linkVariants> {}

export function Link({ variant, className, ...props }: LinkProps) {
  return (
    <NextLink
      // cn() fusionne les classes CVA avec les classes custom
      className={cn(linkVariants({ variant }), className)}
      // Spread des autres props (href, children, etc.)
      {...props}
    />
  );
}
