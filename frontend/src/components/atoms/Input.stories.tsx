import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Entrez votre texte...',
    id: 'default-input',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Adresse email',
    placeholder: 'exemple@email.com',
    type: 'email',
    id: 'email-input',
  },
};

export const WithError: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    error: 'Le mot de passe doit contenir au moins 8 caractères',
    id: 'password-input',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Champ désactivé',
    placeholder: 'Non modifiable',
    disabled: true,
    id: 'disabled-input',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Input id="text" placeholder="Texte simple" />
      <Input id="label" label="Avec label" placeholder="Placeholder" />
      <Input id="error" label="Avec erreur" error="Message d'erreur" />
      <Input
        id="disabled"
        label="Désactivé"
        disabled
        placeholder="Non modifiable"
      />
    </div>
  ),
};
