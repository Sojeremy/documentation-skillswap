import { describe, it, expect } from 'vitest';
import { LoginFormSchema, RegisterFormSchema } from './auth.validation';

describe('auth.validation', () => {
  describe('LoginFormSchema', () => {
    it('valide des identifiants corrects', () => {
      // Arrange
      const validData = { email: 'test@example.com', password: 'password123' };

      // Act
      const result = LoginFormSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('rejette email invalide et mot de passe trop court', () => {
      // Arrange
      const invalidEmail = { email: 'invalid', password: 'password123' };
      const shortPassword = { email: 'test@example.com', password: '1234567' };

      // Act & Assert
      expect(LoginFormSchema.safeParse(invalidEmail).success).toBe(false);
      expect(LoginFormSchema.safeParse(shortPassword).success).toBe(false);
    });
  });

  describe('RegisterFormSchema', () => {
    const validData = {
      email: 'test@example.com',
      firstname: 'Jean',
      lastname: 'Dupont',
      password: 'password123',
      confirmation: 'password123',
    };

    it('valide une inscription complète', () => {
      // Arrange & Act
      const result = RegisterFormSchema.safeParse(validData);

      // Assert
      expect(result.success).toBe(true);
    });

    it('accepte les prénoms avec accents, tirets et apostrophes', () => {
      // Arrange
      const accentedName = { ...validData, firstname: 'François-Éric' };
      const apostropheName = { ...validData, firstname: "M'Bappé" };

      // Act & Assert
      expect(RegisterFormSchema.safeParse(accentedName).success).toBe(true);
      expect(RegisterFormSchema.safeParse(apostropheName).success).toBe(true);
    });

    it('rejette les caractères invalides dans le prénom', () => {
      // Arrange
      const invalidName = { ...validData, firstname: 'Jean123' };

      // Act
      const result = RegisterFormSchema.safeParse(invalidName);

      // Assert
      expect(result.success).toBe(false);
    });

    it('rejette les mots de passe non correspondants', () => {
      // Arrange
      const mismatchedPasswords = {
        ...validData,
        confirmation: 'different123',
      };

      // Act
      const result = RegisterFormSchema.safeParse(mismatchedPasswords);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});
