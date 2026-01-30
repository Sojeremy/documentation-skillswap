import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PasswordInput } from './PasswordInput';

const meta = {
  title: 'Atoms/PasswordInput',
  component: PasswordInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Entrez votre mot de passe',
    id: 'default-password',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Mot de passe',
    placeholder: '••••••••',
    id: 'label-password',
  },
};

export const WithError: Story = {
  args: {
    label: 'Mot de passe',
    error: 'Le mot de passe doit contenir au moins 8 caractères',
    id: 'error-password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Mot de passe',
    placeholder: 'Non modifiable',
    disabled: true,
    id: 'disabled-password',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Mot de passe actuel',
    defaultValue: 'monMotDePasse123',
    id: 'value-password',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <PasswordInput id="simple" placeholder="Simple" />
      <PasswordInput id="labeled" label="Avec label" placeholder="••••••••" />
      <PasswordInput
        id="errored"
        label="Avec erreur"
        error="Mot de passe invalide"
      />
      <PasswordInput id="disabled" label="Désactivé" disabled />
    </div>
  ),
};
