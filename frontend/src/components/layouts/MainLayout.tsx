import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  isFullHeight?: boolean;
}

export function MainLayout({ children, isFullHeight }: MainLayoutProps) {
  return (
    <div
      className={`flex flex-col bg-zinc-50 font-sans dark:bg-black ${
        isFullHeight ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-100 focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="flex-1 min-h-0">
        {children}
      </main>

      {!isFullHeight && <Footer />}
    </div>
  );
}
