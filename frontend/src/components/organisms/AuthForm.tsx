'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  PasswordInput,
  Input,
} from '@/components/atoms';
import { AuthFormData, AuthFormMode } from '@/lib/api-types';
import { cn, validate } from '@/lib/utils';
import {
  LoginFormSchema,
  RegisterFormSchema,
} from '@/lib/validation/auth.validation';
import { FormEvent, useState } from 'react';

interface AuthFormProps {
  mode: AuthFormMode;
  onSubmit: (data: AuthFormData) => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function AuthForm({
  onSubmit,
  isLoading = false,
  error,
  mode,
  className,
}: AuthFormProps) {
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    confirmation: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AuthFormData, string>>
  >({});

  // Validate each field of form data
  function validateForm(formData: AuthFormData) {
    const schema = mode === 'login' ? LoginFormSchema : RegisterFormSchema;
    return validate(schema, formData, setErrors);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Validate form data before submit
    if (validateForm(formData)) {
      onSubmit(formData);
    }
  }

  // Function to controll a field in the form
  function updateField<K extends keyof AuthFormData>(
    fieldName: K,
    newValue: string,
  ) {
    // Update the value of the field in formData state
    setFormData((previousFormData) => ({
      ...previousFormData, // keep other fields unchanged
      [fieldName]: newValue, // update the current field with the new value
    }));

    // Reset the error for the field that was just updated
    setErrors((previousErrors) => {
      const updatedErrors = { ...previousErrors }; // create a copy to avoid mutating state directly
      delete updatedErrors[fieldName]; // remove the error for this field
      return updatedErrors; // set the new errors object without the field
    });

    // Check if password is valid (only in register mode)
    if (mode === 'register' && fieldName === 'password') {
      if (newValue.length < 8) {
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
    }
  }

  return (
    <>
      <Card className={cn('w-full max-w-sm', className)}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Bon retour !' : 'Bienvenue !'}
          </CardTitle>
          <CardDescription className="text-sm">
            {mode === 'login'
              ? 'Connectez-vous pour continuer'
              : 'Rejoignez la communauté SkillSwap'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="grid p-3 rounded-lg bg-error/5 text-error text-xs whitespace-pre-line">
                  {error}
                </div>
              )}
              {mode === 'register' && (
                <>
                  <div className="grid gap-2">
                    <Input
                      label="Prénom *"
                      id="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => updateField('firstname', e.target.value)}
                      error={errors.firstname}
                      placeholder="John"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      label="Nom *"
                      id="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => updateField('lastname', e.target.value)}
                      error={errors.lastname}
                      placeholder="Doe"
                    />
                  </div>
                </>
              )}
              <div className="grid gap-2">
                <Input
                  label="Email *"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-2">
                <PasswordInput
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  id="password"
                  label="Mot de passe *"
                />
                {mode === 'register' && !errors.password && (
                  <p
                    className={cn(
                      'grid gap-2 text-sm text-error',
                      isValidPassword && 'text-green-700',
                    )}
                  >
                    Minimum 8 caractères
                  </p>
                )}
              </div>
              {mode === 'register' && (
                <div className="grid gap-2">
                  <PasswordInput
                    name="confirmation"
                    placeholder="••••••••"
                    value={formData.confirmation}
                    onChange={(e) =>
                      updateField('confirmation', e.target.value)
                    }
                    error={errors.confirmation}
                    id="confirmation"
                    label="Confirmer le mot de passe *"
                  />
                </div>
              )}
              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Connexion"
                className="w-full"
              >
                {mode === 'login' ? 'Se connecter' : "S'inscrire"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="w-full flex justify-center">
            <p className="text-xs inline-flex items-center justify-center ">
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            </p>
            <Button variant="ghost" asChild={true} className="text-xs">
              {mode === 'login' ? (
                <a href="/inscription">Créer un compte</a>
              ) : (
                <a href="/connexion">Se connecter</a>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
