import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'nav',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Variants
export const Default: Story = {
  args: {
    children: 'Bouton par défaut',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Supprimer',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Bouton outline',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Bouton secondaire',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Bouton ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Bouton lien',
    variant: 'link',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Petit bouton',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Grand bouton',
    size: 'lg',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Enregistrer',
    isLoading: true,
    loadingText: 'Enregistrement',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Bouton désactivé',
    disabled: true,
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
