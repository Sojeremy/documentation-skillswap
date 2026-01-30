import { describe, it, expect } from 'vitest';
import {
  UpdateUserProfileSchema,
  AddUserSkillSchema,
  AddUserAvailabilitySchema,
} from './updateProfile.validation';

describe('updateProfile.validation', () => {
  describe('UpdateUserProfileSchema', () => {
    it('valide un objet vide (tous les champs sont optionnels)', () => {
      // Arrange & Act
      const result = UpdateUserProfileSchema.safeParse({});

      // Assert
      expect(result.success).toBe(true);
    });

    it('coerce et valide un code postal (string → number)', () => {
      // Arrange - le formulaire envoie souvent des strings
      const stringPostalCode = { postalCode: '75001' };
      const invalidPostalCode = { postalCode: '123' }; // trop court

      // Act
      const validResult = UpdateUserProfileSchema.safeParse(stringPostalCode);
      const invalidResult =
        UpdateUserProfileSchema.safeParse(invalidPostalCode);

      // Assert
      expect(validResult.success).toBe(true);
      if (validResult.success) {
        expect(validResult.data.postalCode).toBe(75001); // converti en number
      }
      expect(invalidResult.success).toBe(false);
    });

    it('valide les contraintes de description (10-500 caractères)', () => {
      // Arrange
      const tooShort = { description: 'Court' }; // < 10
      const valid = {
        description: 'Une description valide de plus de 10 caractères.',
      };
      const tooLong = { description: 'A'.repeat(501) }; // > 500

      // Act & Assert
      expect(UpdateUserProfileSchema.safeParse(tooShort).success).toBe(false);
      expect(UpdateUserProfileSchema.safeParse(valid).success).toBe(true);
      expect(UpdateUserProfileSchema.safeParse(tooLong).success).toBe(false);
    });

    it('vérifie la correspondance des mots de passe (refine)', () => {
      // Arrange - Ce test a permis de découvrir un bug (.optional vs .optional())
      const mismatchedPasswords = {
        password: 'password123',
        confirmation: 'different123',
      };

      // Act
      const result = UpdateUserProfileSchema.safeParse(mismatchedPasswords);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('AddUserSkillSchema', () => {
    it('valide un skillId entier positif, rejette invalides', () => {
      // Arrange & Act & Assert
      expect(AddUserSkillSchema.safeParse({ skillId: 1 }).success).toBe(true);
      expect(AddUserSkillSchema.safeParse({ skillId: 0 }).success).toBe(false);
      expect(AddUserSkillSchema.safeParse({ skillId: -1 }).success).toBe(false);
      expect(AddUserSkillSchema.safeParse({ skillId: 1.5 }).success).toBe(
        false,
      );
    });
  });

  describe('AddUserAvailabilitySchema', () => {
    it('valide une disponibilité correcte (jour français + créneau)', () => {
      // Arrange
      const valid = { day: 'Lundi', timeSlot: 'Morning' };

      // Act
      const result = AddUserAvailabilitySchema.safeParse(valid);

      // Assert
      expect(result.success).toBe(true);
    });

    it('rejette un jour en anglais ou créneau invalide', () => {
      // Arrange
      const englishDay = { day: 'Monday', timeSlot: 'Morning' };
      const invalidSlot = { day: 'Lundi', timeSlot: 'Evening' };

      // Act & Assert
      expect(AddUserAvailabilitySchema.safeParse(englishDay).success).toBe(
        false,
      );
      expect(AddUserAvailabilitySchema.safeParse(invalidSlot).success).toBe(
        false,
      );
    });
  });
});
