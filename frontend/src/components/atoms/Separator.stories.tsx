import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="h-24 flex items-center">
        <Story />
      </div>
    ),
  ],
};

export const InContent: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm">Section 1</p>
      <Separator />
      <p className="text-sm">Section 2</p>
      <Separator />
      <p className="text-sm">Section 3</p>
    </div>
  ),
};

export const VerticalInline: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-6">
      <span className="text-sm">Accueil</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Profil</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Messages</span>
    </div>
  ),
};
