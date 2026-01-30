import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConversationItem } from './ConversationItem';

const meta = {
  title: 'Molecules/ConversationItem',
  component: ConversationItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConversationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockParticipant = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
};

const mockMessage = {
  id: 1,
  content: 'Bonjour ! Je suis disponible pour la session de demain.',
  timestamp: new Date().toISOString(),
  senderId: 1,
  conversationId: 1,
};

export const Default: Story = {
  args: {
    participant: mockParticipant,
    conversationTitle: 'Sophie Martin',
    lastMessage: mockMessage,
    unreadCount: 0,
    isActive: false,
    onClick: () => console.log('Clicked'),
  },
};

export const WithUnread: Story = {
  args: {
    participant: mockParticipant,
    conversationTitle: 'Sophie Martin',
    lastMessage: mockMessage,
    unreadCount: 3,
    isActive: false,
    onClick: () => console.log('Clicked'),
  },
};

export const Active: Story = {
  args: {
    participant: mockParticipant,
    conversationTitle: 'Sophie Martin',
    lastMessage: mockMessage,
    unreadCount: 0,
    isActive: true,
    onClick: () => console.log('Clicked'),
  },
};

export const ActiveWithUnread: Story = {
  args: {
    participant: mockParticipant,
    conversationTitle: 'Sophie Martin',
    lastMessage: {
      ...mockMessage,
      content: 'Nouveau message important !',
    },
    unreadCount: 5,
    isActive: true,
    onClick: () => console.log('Clicked'),
  },
};

export const WithoutAvatar: Story = {
  args: {
    participant: {
      id: 2,
      firstname: 'Jean',
      lastname: 'Dupont',
      avatarUrl: undefined,
    },
    conversationTitle: 'Jean Dupont',
    lastMessage: {
      ...mockMessage,
      content: 'Merci pour votre aide !',
    },
    unreadCount: 1,
    onClick: () => console.log('Clicked'),
  },
};

export const LongMessage: Story = {
  args: {
    participant: mockParticipant,
    conversationTitle: 'Sophie Martin',
    lastMessage: {
      ...mockMessage,
      content:
        "Bonjour ! Je voulais vous remercier pour la session d'hier, c'était vraiment très instructif et j'ai beaucoup appris.",
    },
    unreadCount: 0,
    onClick: () => console.log('Clicked'),
  },
};

export const ConversationList: Story = {
  args: { conversationTitle: 'Conversation' },
  render: () => (
    <div className="flex flex-col w-80 border rounded-lg overflow-hidden">
      <ConversationItem
        participant={mockParticipant}
        conversationTitle="Sophie Martin"
        lastMessage={mockMessage}
        unreadCount={3}
        isActive={true}
        onClick={() => {}}
      />
      <ConversationItem
        participant={{
          id: 2,
          firstname: 'Jean',
          lastname: 'Dupont',
          avatarUrl: undefined,
        }}
        conversationTitle="Jean Dupont"
        lastMessage={{
          ...mockMessage,
          content: 'À bientôt !',
        }}
        unreadCount={0}
        onClick={() => {}}
      />
      <ConversationItem
        participant={{
          id: 3,
          firstname: 'Marie',
          lastname: 'Lambert',
          avatarUrl: 'https://i.pravatar.cc/150?u=marie',
        }}
        conversationTitle="Marie Lambert"
        lastMessage={{
          ...mockMessage,
          content: 'Super, merci beaucoup !',
        }}
        unreadCount={1}
        onClick={() => {}}
      />
    </div>
  ),
};
