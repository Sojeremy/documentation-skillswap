import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'category',
        'availability',
        'primary',
        'selected',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Category: Story = {
  args: {
    children: 'Développement',
    variant: 'category',
  },
};

export const Availability: Story = {
  args: {
    children: 'Disponible',
    variant: 'availability',
  },
};

export const Primary: Story = {
  args: {
    children: 'Nouveau',
    variant: 'primary',
  },
};

export const Selected: Story = {
  args: {
    children: 'Sélectionné',
    variant: 'selected',
  },
};

export const WithRemove: Story = {
  args: {
    children: 'React',
    variant: 'selected',
    onRemove: () => console.log('Badge removed'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="category">Category</Badge>
      <Badge variant="availability">Disponible</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="selected">Selected</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const SkillTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="category">React</Badge>
      <Badge variant="category">TypeScript</Badge>
      <Badge variant="selected">Next.js</Badge>
      <Badge variant="category">Node.js</Badge>
    </div>
  ),
};
