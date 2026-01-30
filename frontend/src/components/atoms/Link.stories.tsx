import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Link } from './Link';

const meta = {
  title: 'Atoms/Link',
  component: Link,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'nav', 'footer', 'cta'],
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Lien par défaut',
    variant: 'default',
  },
};

export const Navigation: Story = {
  args: {
    href: '#',
    children: 'Accueil',
    variant: 'nav',
  },
};

export const Footer: Story = {
  args: {
    href: '#',
    children: 'Mentions légales',
    variant: 'footer',
  },
};

export const CallToAction: Story = {
  args: {
    href: '#',
    children: 'Voir plus →',
    variant: 'cta',
  },
};

export const AllVariants: Story = {
  args: { href: '#', children: 'Link' },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-20 text-xs text-zinc-500">Default:</span>
        <Link href="#" variant="default">
          Lien discret
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-xs text-zinc-500">Nav:</span>
        <Link href="#" variant="nav">
          Navigation
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-xs text-zinc-500">Footer:</span>
        <Link href="#" variant="footer">
          Lien footer
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-20 text-xs text-zinc-500">CTA:</span>
        <Link href="#" variant="cta">
          Call to action
        </Link>
      </div>
    </div>
  ),
};

export const NavigationBar: Story = {
  args: { href: '#', children: 'Link' },
  render: () => (
    <nav className="flex items-center gap-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
      <Link href="#" variant="nav">
        Accueil
      </Link>
      <Link href="#" variant="nav">
        Recherche
      </Link>
      <Link href="#" variant="nav">
        Messages
      </Link>
      <Link href="#" variant="nav">
        Profil
      </Link>
    </nav>
  ),
};

export const FooterLinks: Story = {
  args: { href: '#', children: 'Link' },
  render: () => (
    <footer className="flex flex-col gap-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <Link href="#" variant="footer">
        Conditions d&apos;utilisation
      </Link>
      <Link href="#" variant="footer">
        Politique de confidentialité
      </Link>
      <Link href="#" variant="footer">
        Contact
      </Link>
      <Link href="#" variant="footer">
        FAQ
      </Link>
    </footer>
  ),
};

export const InlineWithText: Story = {
  args: { href: '#', children: 'Link' },
  render: () => (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      En vous inscrivant, vous acceptez nos{' '}
      <Link href="#" variant="cta">
        conditions d&apos;utilisation
      </Link>{' '}
      et notre{' '}
      <Link href="#" variant="cta">
        politique de confidentialité
      </Link>
      .
    </p>
  ),
};
