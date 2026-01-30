import { describe, it, expect } from 'vitest';
import { UpdatePasswordSchema } from './updatePassword.validation';

describe('UpdatePasswordSchema', () => {
  it('valide un changement de mot de passe correct', () => {
    // Arrange
    const validData = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
      confirmation: 'newPassword456',
    };

    // Act
    const result = UpdatePasswordSchema.safeParse(validData);

    // Assert
    expect(result.success).toBe(true);
  });

  it('rejette un mot de passe trop court (< 8 caractères)', () => {
    // Arrange
    const shortPassword = {
      currentPassword: '1234567', // 7 chars
      newPassword: 'newPassword456',
      confirmation: 'newPassword456',
    };

    // Act
    const result = UpdatePasswordSchema.safeParse(shortPassword);

    // Assert
    expect(result.success).toBe(false);
  });

  it('rejette des mots de passe non correspondants', () => {
    // Arrange
    const mismatchedPasswords = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
      confirmation: 'differentPassword',
    };

    // Act
    const result = UpdatePasswordSchema.safeParse(mismatchedPasswords);

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmationError = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmation',
      );
      expect(confirmationError?.message).toBe(
        'Les nouveaux mots de passe ne correspondent pas',
      );
    }
  });
});
