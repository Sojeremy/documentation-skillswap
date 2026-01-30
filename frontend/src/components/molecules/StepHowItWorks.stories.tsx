import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StepHowItWorks } from './StepHowItWorks';

const meta = {
  title: 'Molecules/StepHowItWorks',
  component: StepHowItWorks,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof StepHowItWorks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1: Story = {
  args: {
    stepNumber: 1,
    title: 'Créez votre profil',
    description:
      'Listez vos compétences à partager et celles que vous souhaitez apprendre.',
  },
};

export const Step2: Story = {
  args: {
    stepNumber: 2,
    title: 'Trouvez un partenaire',
    description:
      'Recherchez des membres avec les compétences qui vous intéressent.',
  },
};

export const Step3: Story = {
  args: {
    stepNumber: 3,
    title: 'Échangez vos savoirs',
    description:
      "Organisez des sessions d'apprentissage mutuel et progressez ensemble.",
  },
};

export const AllSteps: Story = {
  args: { stepNumber: 1, title: 'Step', description: 'Description' },
  render: () => (
    <div className="flex flex-col md:flex-row gap-8 max-w-4xl">
      <StepHowItWorks
        stepNumber={1}
        title="Créez votre profil"
        description="Listez vos compétences à partager et celles que vous souhaitez apprendre."
      />
      <StepHowItWorks
        stepNumber={2}
        title="Trouvez un partenaire"
        description="Recherchez des membres avec les compétences qui vous intéressent."
      />
      <StepHowItWorks
        stepNumber={3}
        title="Échangez vos savoirs"
        description="Organisez des sessions d'apprentissage mutuel et progressez ensemble."
      />
    </div>
  ),
};

export const LongDescription: Story = {
  args: {
    stepNumber: 1,
    title: 'Étape avec une longue description',
    description:
      'Cette description est volontairement très longue pour montrer comment le composant gère le texte qui dépasse la largeur normale. Le texte reste centré et lisible.',
  },
};
