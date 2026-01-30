import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription - SkillSwap',
  description:
    'Créez votre compte SkillSwap et commencez à échanger vos compétences.',
};

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
