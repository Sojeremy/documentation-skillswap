import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MessageBubble } from './MessageBubble';

const meta = {
  title: 'Molecules/MessageBubble',
  component: MessageBubble,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSender = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
};

export const Received: Story = {
  args: {
    content: 'Bonjour ! Comment puis-je vous aider ?',
    timestamp: new Date().toISOString(),
    isOwn: false,
    sender: mockSender,
  },
};

export const Sent: Story = {
  args: {
    content: 'Salut ! Je suis intéressé par vos cours de React.',
    timestamp: new Date().toISOString(),
    isOwn: true,
  },
};

export const LongMessage: Story = {
  args: {
    content:
      "Merci pour votre message ! Je serais ravi de vous aider à apprendre React. J'ai plusieurs années d'expérience dans ce domaine et je peux vous proposer un programme adapté à votre niveau. Quand seriez-vous disponible pour une première session ?",
    timestamp: new Date().toISOString(),
    isOwn: false,
    sender: mockSender,
  },
};

export const WithoutAvatar: Story = {
  args: {
    content: "Message d'un utilisateur sans avatar",
    timestamp: new Date().toISOString(),
    isOwn: false,
    sender: {
      id: 2,
      firstname: 'Jean',
      lastname: 'Dupont',
      avatarUrl: undefined,
    },
  },
};

export const Conversation: Story = {
  args: { content: 'Message', isOwn: false },
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md p-4">
      <MessageBubble
        content="Bonjour ! Je suis disponible pour vous aider avec React."
        timestamp={new Date(Date.now() - 3600000).toISOString()}
        isOwn={false}
        sender={mockSender}
      />
      <MessageBubble
        content="Super ! Quand êtes-vous disponible ?"
        timestamp={new Date(Date.now() - 1800000).toISOString()}
        isOwn={true}
      />
      <MessageBubble
        content="Je suis libre demain après-midi, vers 14h. Cela vous convient ?"
        timestamp={new Date(Date.now() - 900000).toISOString()}
        isOwn={false}
        sender={mockSender}
      />
      <MessageBubble
        content="Parfait, c'est noté ! À demain alors."
        timestamp={new Date().toISOString()}
        isOwn={true}
      />
    </div>
  ),
};
