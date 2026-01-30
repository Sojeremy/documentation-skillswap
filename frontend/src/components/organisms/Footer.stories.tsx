'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Image from 'next/image';
import { Link } from '@/components/atoms/Link';
import type { CurrentUser } from '@/lib/api-types';

// ============================================================================
// Footer Layout Component (for stories)
// Since Footer uses useAuth internally, we create a version with explicit props
// ============================================================================

interface FooterLayoutProps {
  isAuthenticated: boolean;
  user?: CurrentUser;
}

function FooterLayout({ isAuthenticated, user }: FooterLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Liens légaux */}
          <nav
            aria-label="Liens légaux"
            className="flex flex-col items-center gap-3 md:items-start"
          >
            <Link href="/mentions-legales" variant="footer">
              Mentions légales
            </Link>
            <Link href="/confidentialite" variant="footer">
              Confidentialité
            </Link>
            <Link href="/cgu" variant="footer">
              CGU
            </Link>
          </nav>

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/assets/LOGO-TODOS.png"
              alt="SkillSwap - Échangez vos compétences"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Navigation conditionnelle */}
          <nav
            aria-label="Navigation pied de page"
            className="flex flex-col items-center gap-3 md:items-end"
          >
            {isAuthenticated ? (
              <>
                <Link href="/recherche" variant="footer">
                  Recherche
                </Link>
                <Link href="/conversation" variant="footer">
                  Messages
                </Link>
                <Link
                  href={user ? `/profil/${user.id}` : '/connexion'}
                  variant="footer"
                >
                  Mon profil
                </Link>
              </>
            ) : (
              <>
                <Link href="/inscription" variant="footer">
                  Inscription
                </Link>
                <Link href="/connexion" variant="footer">
                  Connexion
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            © {currentYear} SkillSwap. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Mock User
// ============================================================================

const mockUser: CurrentUser = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
  email: 'sophie.martin@example.com',
};

// ============================================================================
// Stories
// ============================================================================

const meta = {
  title: 'Organisms/Footer',
  component: FooterLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    isAuthenticated: false,
  },
};

export const LoggedIn: Story = {
  args: {
    isAuthenticated: true,
    user: mockUser,
  },
};

export const WithContent: Story = {
  args: { isAuthenticated: true },
  render: () => (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Contenu principal</h1>
        <p className="text-muted-foreground mb-8">
          Cette story montre le footer avec du contenu au-dessus pour illustrer
          sa position en bas de page.
        </p>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 bg-muted/30 rounded">
              Section {i + 1}
            </div>
          ))}
        </div>
      </main>
      <FooterLayout isAuthenticated={true} user={mockUser} />
    </div>
  ),
};

export const FullPage: Story = {
  args: { isAuthenticated: false },
  render: () => (
    <div className="min-h-screen flex flex-col">
      {/* Simple header for context */}
      <header className="border-b p-4">
        <div className="mx-auto max-w-7xl">
          <span className="font-bold text-primary-600">SkillSwap</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Page exemple</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cette story montre une page complète avec header, contenu et footer
            pour visualiser la mise en page globale.
          </p>
        </div>
      </main>

      {/* Footer */}
      <FooterLayout isAuthenticated={false} />
    </div>
  ),
};
