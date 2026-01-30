import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '@/components/atoms/Button';

const meta = {
  title: 'Molecules/ConfirmDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { isOpen: false, onClose: () => {}, onConfirm: () => {} },
  render: function DefaultDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir le dialog</Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log('Confirmed')}
        />
      </>
    );
  },
};

export const DeleteConfirmation: Story = {
  args: { isOpen: false, onClose: () => {}, onConfirm: () => {} },
  render: function DeleteDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          Supprimer le compte
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log('Account deleted')}
          title="Supprimer votre compte"
          question="Voulez-vous vraiment supprimer"
          subject="votre compte"
          description="Cette action est irréversible."
          confirmLabel="Supprimer"
        />
      </>
    );
  },
};

export const LogoutConfirmation: Story = {
  args: { isOpen: false, onClose: () => {}, onConfirm: () => {} },
  render: function LogoutDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Déconnexion
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log('Logged out')}
          title="Déconnexion"
          question="Voulez-vous vous déconnecter de"
          subject="SkillSwap"
          confirmLabel="Se déconnecter"
        />
      </>
    );
  },
};

export const CancelAction: Story = {
  args: { isOpen: false, onClose: () => {}, onConfirm: () => {} },
  render: function CancelDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setIsOpen(true)}>
          Annuler la réservation
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => console.log('Cancelled')}
          title="Annuler la réservation"
          question="Voulez-vous annuler la session avec"
          subject="Sophie Martin"
          description="Un email sera envoyé pour prévenir l'autre participant."
          confirmLabel="Annuler la session"
        />
      </>
    );
  },
};

export const Loading: Story = {
  args: { isOpen: false, onClose: () => {}, onConfirm: () => {} },
  render: function LoadingDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);
      }, 2000);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Action avec chargement</Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => !isLoading && setIsOpen(false)}
          onConfirm={handleConfirm}
          title="Enregistrement"
          question="Voulez-vous enregistrer les modifications"
          subject=""
          isLoading={isLoading}
          confirmLabel="Enregistrer"
        />
      </>
    );
  },
};
