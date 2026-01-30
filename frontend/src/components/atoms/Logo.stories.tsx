import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Logo } from './Logo';

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    asLink: { control: 'boolean' },
    showText: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    asLink: false,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    asLink: false,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    asLink: false,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    asLink: false,
  },
};

export const IconOnly: Story = {
  args: {
    size: 'md',
    iconOnly: true,
    asLink: false,
  },
};

export const WithoutText: Story = {
  args: {
    size: 'lg',
    showText: false,
    asLink: false,
  },
};

export const AsLink: Story = {
  args: {
    size: 'md',
    asLink: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo size="sm" asLink={false} />
      <Logo size="md" asLink={false} />
      <Logo size="lg" asLink={false} />
      <Logo size="xl" asLink={false} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div>
        <p className="text-xs text-zinc-500 mb-2">Avec texte (défaut)</p>
        <Logo size="md" asLink={false} />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-2">Sans texte</p>
        <Logo size="md" showText={false} asLink={false} />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-2">Icône seule</p>
        <Logo size="md" iconOnly asLink={false} />
      </div>
    </div>
  ),
};
