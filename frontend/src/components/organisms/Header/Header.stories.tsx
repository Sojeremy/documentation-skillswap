'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CurrentUser } from '@/lib/api-types';

// Import sub-components for isolated testing
import { DesktopNav } from './DesktopNav';
import { AuthButtons } from './AuthButtons';
import { Logo } from '@/components/atoms/Logo';

// ============================================================================
// Mock Users
// ============================================================================

const mockUser: CurrentUser = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
  email: 'sophie.martin@example.com',
};

const mockUserNoAvatar: CurrentUser = {
  id: 2,
  firstname: 'Jean',
  lastname: 'Dupont',
  email: 'jean.dupont@example.com',
};

// ============================================================================
// Header Layout Component (for stories)
// Since Header uses useAuth internally, we create a composed version
// ============================================================================

interface HeaderLayoutProps {
  isAuthenticated: boolean;
  user?: CurrentUser;
  isLoading?: boolean;
  isHomePage?: boolean;
}

function HeaderLayout({
  isAuthenticated,
  user,
  isLoading = false,
  isHomePage = false,
}: HeaderLayoutProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="xl" />
        <DesktopNav isHomePage={isHomePage} />
        <AuthButtons
          user={user}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onLogout={() => console.log('Logout clicked')}
          onOpenSettings={() => console.log('Settings clicked')}
        />
      </div>
    </header>
  );
}

// ============================================================================
// Stories
// ============================================================================

const meta = {
  title: 'Organisms/Header',
  component: HeaderLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-[200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeaderLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    isAuthenticated: false,
    isHomePage: false,
  },
};

export const LoggedOutHomePage: Story = {
  args: {
    isAuthenticated: false,
    isHomePage: true,
  },
};

export const LoggedIn: Story = {
  args: {
    isAuthenticated: true,
    user: mockUser,
    isHomePage: false,
  },
};

export const LoggedInHomePage: Story = {
  args: {
    isAuthenticated: true,
    user: mockUser,
    isHomePage: true,
  },
};

export const LoggedInNoAvatar: Story = {
  args: {
    isAuthenticated: true,
    user: mockUserNoAvatar,
    isHomePage: false,
  },
};

export const Loading: Story = {
  args: {
    isAuthenticated: false,
    isLoading: true,
  },
};

export const WithContent: Story = {
  args: { isAuthenticated: true, user: mockUser },
  render: () => (
    <div>
      <HeaderLayout isAuthenticated={true} user={mockUser} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Contenu de la page</h1>
        <p className="text-muted-foreground">
          Cette story montre le header avec du contenu en dessous pour illustrer
          le comportement sticky et le backdrop blur.
        </p>
        <div className="mt-8 space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="p-4 bg-muted/30 rounded">
              Paragraphe {i + 1}
            </div>
          ))}
        </div>
      </main>
    </div>
  ),
};
