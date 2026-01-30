import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProfileCard } from './ProfileCard';

const meta = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 1,
    firstname: 'Sophie',
    lastname: 'Martin',
    avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
    skills: ['React', 'TypeScript', 'Next.js'],
    rating: 4.5,
    reviewCount: 28,
  },
};

export const WithoutAvatar: Story = {
  args: {
    id: 2,
    firstname: 'Jean',
    lastname: 'Dupont',
    avatarUrl: undefined,
    skills: ['Python', 'Django'],
    rating: 4.0,
    reviewCount: 15,
  },
};

export const ManySkills: Story = {
  args: {
    id: 3,
    firstname: 'Marie',
    lastname: 'Lambert',
    avatarUrl: 'https://i.pravatar.cc/150?u=marie',
    skills: ['UX Design', 'Figma', 'Photoshop', 'Illustrator', 'CSS'],
    rating: 5.0,
    reviewCount: 42,
  },
};

export const NoReviews: Story = {
  args: {
    id: 4,
    firstname: 'Lucas',
    lastname: 'Bernard',
    avatarUrl: 'https://i.pravatar.cc/150?u=lucas',
    skills: ['Node.js', 'Express'],
    rating: 0,
    reviewCount: 0,
  },
};

export const SingleSkill: Story = {
  args: {
    id: 5,
    firstname: 'Emma',
    lastname: 'Petit',
    avatarUrl: 'https://i.pravatar.cc/150?u=emma',
    skills: ['Photographie'],
    rating: 4.8,
    reviewCount: 56,
  },
};

export const CardGrid: Story = {
  args: { id: 1, firstname: 'Sophie', lastname: 'Martin', skills: ['React'] },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      <ProfileCard
        id={1}
        firstname="Sophie"
        lastname="Martin"
        avatarUrl="https://i.pravatar.cc/150?u=sophie"
        skills={['React', 'TypeScript']}
        rating={4.5}
        reviewCount={28}
      />
      <ProfileCard
        id={2}
        firstname="Jean"
        lastname="Dupont"
        skills={['Python', 'Django', 'FastAPI']}
        rating={4.0}
        reviewCount={15}
      />
      <ProfileCard
        id={3}
        firstname="Marie"
        lastname="Lambert"
        avatarUrl="https://i.pravatar.cc/150?u=marie"
        skills={['UX Design', 'Figma']}
        rating={5.0}
        reviewCount={42}
      />
    </div>
  ),
};
