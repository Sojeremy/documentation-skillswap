import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Label } from './Label';

const meta = {
  title: 'Atoms/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Adresse email',
    htmlFor: 'email',
  },
};

export const Required: Story = {
  render: () => (
    <Label htmlFor="required">
      Nom complet <span className="text-destructive">*</span>
    </Label>
  ),
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="demo-input">Votre message</Label>
      <input
        id="demo-input"
        className="border rounded px-3 py-2 text-sm"
        placeholder="Tapez ici..."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="group" data-disabled="true">
      <Label htmlFor="disabled">Champ désactivé</Label>
    </div>
  ),
};
