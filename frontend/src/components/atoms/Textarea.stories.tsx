import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    rows: { control: { type: 'number', min: 2, max: 10 } },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Écrivez votre message...',
    id: 'default-textarea',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Décrivez vos compétences...',
    id: 'label-textarea',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Parlez-nous de vous...',
    helperText: 'Maximum 500 caractères',
    id: 'helper-textarea',
  },
};

export const WithError: Story = {
  args: {
    label: 'Message',
    error: 'Le message est obligatoire',
    id: 'error-textarea',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Champ désactivé',
    placeholder: 'Non modifiable',
    disabled: true,
    id: 'disabled-textarea',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Textarea id="simple" placeholder="Simple" />
      <Textarea id="labeled" label="Avec label" placeholder="Placeholder" />
      <Textarea id="helper" label="Avec aide" helperText="Texte d'aide" />
      <Textarea id="errored" label="Avec erreur" error="Message d'erreur" />
      <Textarea id="disabled" label="Désactivé" disabled />
    </div>
  ),
};
