import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MessageSquare, Search, Users, Inbox } from 'lucide-react';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoConversations: Story = {
  args: {
    icon: <MessageSquare className="h-12 w-12 opacity-20" />,
    title: 'Aucune conversation',
    description:
      "Commencez à échanger avec d'autres membres pour voir vos conversations ici.",
    actionLabel: 'Trouver des membres',
    onAction: () => console.log('Action clicked'),
  },
};

export const NoResults: Story = {
  args: {
    icon: <Search className="h-12 w-12 opacity-20" />,
    title: 'Aucun résultat',
    description:
      "Aucun membre ne correspond à votre recherche. Essayez d'autres termes.",
  },
};

export const NoMembers: Story = {
  args: {
    icon: <Users className="h-12 w-12 opacity-20" />,
    title: 'Aucun membre trouvé',
    description: "Il n'y a pas encore de membres avec ces compétences.",
    actionLabel: 'Voir toutes les compétences',
    onAction: () => console.log('Action clicked'),
  },
};

export const EmptyInbox: Story = {
  args: {
    icon: <Inbox className="h-12 w-12 opacity-20" />,
    title: 'Boîte de réception vide',
    description: "Vous n'avez pas de nouveaux messages.",
  },
};

export const WithoutAction: Story = {
  args: {
    title: 'Rien à afficher',
    description: "Il n'y a pas de contenu à afficher pour le moment.",
  },
};

export const CustomIcon: Story = {
  args: {
    icon: (
      <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-2xl">🎉</span>
      </div>
    ),
    title: 'Félicitations !',
    description: 'Vous avez terminé toutes vos tâches.',
    actionLabel: "Voir l'historique",
    onAction: () => console.log('View history'),
  },
};

export const AllVariants: Story = {
  args: { title: 'Empty', description: 'No content' },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
      <div className="border rounded-lg">
        <EmptyState
          icon={<MessageSquare className="h-12 w-12 opacity-20" />}
          title="Aucune conversation"
          description="Commencez à échanger avec d'autres membres."
          actionLabel="Trouver des membres"
          onAction={() => {}}
        />
      </div>
      <div className="border rounded-lg">
        <EmptyState
          icon={<Search className="h-12 w-12 opacity-20" />}
          title="Aucun résultat"
          description="Essayez d'autres termes de recherche."
        />
      </div>
    </div>
  ),
};
