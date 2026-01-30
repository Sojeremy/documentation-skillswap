import { describe, it, expect } from 'vitest';
import {
  cn,
  getInitialsFromUser,
  getInitialsFromName,
  calculateRating,
} from './utils';

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('fusionne plusieurs classes avec valeurs conditionnelles', () => {
      // Arrange
      const isActive = true;
      const isDisabled = false;

      // Act
      const result = cn('base', isActive && 'active', isDisabled && 'disabled');

      // Assert
      expect(result).toBe('base active');
    });

    it('résout les conflits Tailwind (dernière classe gagne)', () => {
      // Arrange & Act
      const result = cn('px-4', 'px-8');

      // Assert
      expect(result).toBe('px-8');
    });
  });

  describe('getInitialsFromUser', () => {
    it('retourne les initiales depuis un utilisateur complet', () => {
      // Arrange
      const user = { id: 1, firstname: 'Sophie', lastname: 'Martin' };

      // Act
      const result = getInitialsFromUser(user);

      // Assert
      expect(result).toBe('SM');
    });

    it('retourne "?" si les champs sont vides ou undefined', () => {
      // Arrange
      const emptyUser = { id: 2, firstname: '', lastname: '' };
      // Test defensive behavior with type assertion for edge case
      const undefinedUser = {
        id: 3,
        firstname: undefined,
        lastname: undefined,
      } as unknown as {
        id: number;
        firstname: string;
        lastname: string;
      };

      // Act & Assert
      expect(getInitialsFromUser(emptyUser)).toBe('?');
      expect(getInitialsFromUser(undefinedUser)).toBe('?');
    });
  });

  describe('getInitialsFromName', () => {
    it('retourne les initiales depuis un nom complet', () => {
      // Arrange & Act & Assert
      expect(getInitialsFromName('Sophie Martin')).toBe('SM');
      expect(getInitialsFromName('jean dupont')).toBe('JD'); // minuscules
    });

    it('gère les cas limites (prénom seul, vide)', () => {
      // Arrange & Act & Assert
      expect(getInitialsFromName('Sophie')).toBe('S');
      expect(getInitialsFromName('')).toBe('');
    });
  });

  describe('calculateRating', () => {
    it('calcule la moyenne des scores avec arrondi', () => {
      // Arrange
      const evaluations = [{ score: 4 }, { score: 4 }, { score: 5 }];

      // Act
      const result = calculateRating(evaluations);

      // Assert - (4+4+5)/3 = 4.333... arrondi à 4.3
      expect(result).toBe(4.3);
    });

    it('retourne 0 pour tableau vide, null ou undefined', () => {
      // Arrange & Act & Assert
      expect(calculateRating([])).toBe(0);
      expect(calculateRating(null)).toBe(0);
      expect(calculateRating(undefined)).toBe(0);
    });
  });
});
