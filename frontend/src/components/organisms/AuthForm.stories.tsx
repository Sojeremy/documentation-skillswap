'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { AuthForm } from './AuthForm';

const meta = {
  title: 'Organisms/AuthForm',
  component: AuthForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: {
    mode: 'login',
    onSubmit: (data) => console.log('Login:', data),
    isLoading: false,
  },
};

export const Register: Story = {
  args: {
    mode: 'register',
    onSubmit: (data) => console.log('Register:', data),
    isLoading: false,
  },
};

export const LoginLoading: Story = {
  args: {
    mode: 'login',
    onSubmit: (data) => console.log('Login:', data),
    isLoading: true,
  },
};

export const RegisterLoading: Story = {
  args: {
    mode: 'register',
    onSubmit: (data) => console.log('Register:', data),
    isLoading: true,
  },
};

export const LoginWithError: Story = {
  args: {
    mode: 'login',
    onSubmit: (data) => console.log('Login:', data),
    error: 'Email ou mot de passe incorrect',
  },
};

export const RegisterWithError: Story = {
  args: {
    mode: 'register',
    onSubmit: (data) => console.log('Register:', data),
    error: 'Cet email est déjà utilisé.\nVeuillez en choisir un autre.',
  },
};

export const Interactive: Story = {
  args: { mode: 'login', onSubmit: () => {} },
  render: function InteractiveDemo() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleSubmit = () => {
      setError(undefined);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setError('Erreur de connexion. Veuillez réessayer.');
      }, 2000);
    };

    return (
      <AuthForm
        mode="login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    );
  },
};

export const SideBySide: Story = {
  args: { mode: 'login', onSubmit: () => {} },
  render: () => (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div>
        <h3 className="text-sm font-medium mb-4 text-center">Connexion</h3>
        <AuthForm
          mode="login"
          onSubmit={(data) => console.log('Login:', data)}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4 text-center">Inscription</h3>
        <AuthForm
          mode="register"
          onSubmit={(data) => console.log('Register:', data)}
        />
      </div>
    </div>
  ),
};
