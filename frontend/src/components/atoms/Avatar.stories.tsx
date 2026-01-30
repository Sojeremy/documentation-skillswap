import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
    },
    showStatus: { control: 'boolean' },
    isOnline: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
};

const mockUserNoAvatar = {
  id: 2,
  firstname: 'Jean',
  lastname: 'Dupont',
  avatarUrl: undefined,
};

export const WithImage: Story = {
  args: {
    user: mockUser,
  },
};

export const WithInitials: Story = {
  args: {
    user: mockUserNoAvatar,
  },
};

export const CustomInitials: Story = {
  args: {
    initials: 'AB',
  },
};

export const WithStatus: Story = {
  args: {
    user: mockUser,
    showStatus: true,
    isOnline: true,
  },
};

export const Offline: Story = {
  args: {
    user: mockUser,
    showStatus: true,
    isOnline: false,
  },
};

export const AllSizes: Story = {
  args: {},
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar initials="SM" size="sm" />
      <Avatar initials="MD" size="md" />
      <Avatar initials="LG" size="lg" />
      <Avatar initials="XL" size="xl" />
      <Avatar initials="2X" size="2xl" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar user={mockUser} size="lg" />
      <Avatar user={mockUserNoAvatar} size="lg" />
      <Avatar initials="?" size="lg" />
      <Avatar user={mockUser} size="lg" showStatus isOnline />
      <Avatar user={mockUser} size="lg" showStatus isOnline={false} />
    </div>
  ),
};
