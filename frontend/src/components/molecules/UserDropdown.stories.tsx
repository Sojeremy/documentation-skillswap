import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserDropdown } from './UserDropdown';
import type { CurrentUser } from '@/lib/api-types';

const meta = {
  title: 'Molecules/UserDropdown',
  component: UserDropdown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof UserDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser: CurrentUser = {
  id: 1,
  firstname: 'Sophie',
  lastname: 'Martin',
  avatarUrl: 'https://i.pravatar.cc/150?u=sophie',
  email: 'sophie.martin@example.com',
};

const mockUserWithoutAvatar: CurrentUser = {
  id: 2,
  firstname: 'Jean',
  lastname: 'Dupont',
  email: 'jean.dupont@example.com',
};

export const Default: Story = {
  args: {
    user: mockUser,
    onLogout: () => console.log('Logout clicked'),
    onOpenSettings: () => console.log('Settings clicked'),
  },
};

export const WithoutAvatar: Story = {
  args: {
    user: mockUserWithoutAvatar,
    onLogout: () => console.log('Logout clicked'),
    onOpenSettings: () => console.log('Settings clicked'),
  },
};

export const WithoutSettings: Story = {
  args: {
    user: mockUser,
    onLogout: () => console.log('Logout clicked'),
  },
};

export const InHeader: Story = {
  args: { user: mockUser, onLogout: () => {} },
  render: () => (
    <div className="flex items-center justify-end w-80 p-4 bg-background border rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Sophie Martin</span>
        <UserDropdown
          user={mockUser}
          onLogout={() => console.log('Logout')}
          onOpenSettings={() => console.log('Settings')}
        />
      </div>
    </div>
  ),
};
