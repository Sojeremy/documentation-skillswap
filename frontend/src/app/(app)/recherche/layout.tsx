import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recherche - SkillSwap',
  description:
    'Recherchez des membres SkillSwap par compétence et trouvez le partenaire idéal pour échanger vos savoirs.',
};

export default function RechercheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
