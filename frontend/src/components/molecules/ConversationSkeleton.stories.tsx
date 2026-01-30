import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConversationSkeleton } from './ConversationSkeleton';

const meta = {
  title: 'Molecules/ConversationSkeleton',
  component: ConversationSkeleton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConversationSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80 border rounded-lg overflow-hidden">
      <ConversationSkeleton />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-md border rounded-lg overflow-hidden">
      <ConversationSkeleton />
    </div>
  ),
};

export const InSidebar: Story = {
  render: () => (
    <div className="flex h-96">
      <aside className="w-80 border-r">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <ConversationSkeleton />
      </aside>
      <main className="flex-1 flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Sélectionnez une conversation</p>
      </main>
    </div>
  ),
};
