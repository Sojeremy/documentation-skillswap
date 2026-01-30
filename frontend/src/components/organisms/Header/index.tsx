'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/components/providers/AuthProvider';
import { CloseIcon, MenuIcon } from '@/components/atoms/Icons';
import { toast } from 'sonner';
import { AccountSettingsDialog } from './AccountSettingsDialog';
import { DesktopNav } from './DesktopNav';
import { AuthButtons } from './AuthButtons';
import { MobileNav } from './MobileNav';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMobileMenu();
    try {
      await logout();
      window.location.href = '/';
      toast.info('Au revoir !', {
        description: 'Vous avez été déconnecté.',
      });
    } catch {
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la déconnexion.',
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo size="xl" />
          <DesktopNav isHomePage={isHomePage} />
          <AuthButtons
            user={user}
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            onLogout={handleLogout}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Menu principal"
          >
            {isMobileMenuOpen ? (
              <CloseIcon size={24} />
            ) : (
              <MenuIcon size={24} />
            )}
          </button>
        </div>
        <MobileNav
          isOpen={isMobileMenuOpen}
          isHomePage={isHomePage}
          user={user}
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          onClose={closeMobileMenu}
          onLogout={handleLogout}
          onOpenSettings={() => {
            setIsSettingsOpen(true);
            closeMobileMenu();
          }}
        />
      </header>
      <AccountSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
