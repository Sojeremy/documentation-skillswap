import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion - SkillSwap',
  description:
    'Connectez-vous à votre compte SkillSwap pour échanger vos compétences.',
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
