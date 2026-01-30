import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatMessageDate, formatConversationDate } from './dateTime.utils';

describe('dateTime.utils', () => {
  beforeEach(() => {
    // Arrange global : Mock la date actuelle (23 janvier 2025, 14:30)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-23T14:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatMessageDate', () => {
    it("formate correctement selon la date (aujourd'hui, hier, ancienne)", () => {
      // Arrange
      const today = '2025-01-23T11:47:00';
      const yesterday = '2025-01-22T09:15:00';
      const oldDate = '2025-01-10T11:10:00';

      // Act & Assert
      expect(formatMessageDate(today)).toContain('hui 11:47');
      expect(formatMessageDate(yesterday)).toBe('Hier 09:15');
      expect(formatMessageDate(oldDate)).toBe('10/01/2025 11:10');
    });

    it('retourne une chaîne vide pour valeurs invalides', () => {
      // Arrange & Act & Assert
      expect(formatMessageDate(undefined)).toBe('');
      expect(formatMessageDate('')).toBe('');
    });
  });

  describe('formatConversationDate', () => {
    it('formate en temps relatif (minutes, heures, jours)', () => {
      // Arrange
      const fiveMinutesAgo = '2025-01-23T14:25:00';
      const threeHoursAgo = '2025-01-23T11:30:00';
      const fiveDaysAgo = '2025-01-18T14:30:00';

      // Act & Assert
      expect(formatConversationDate(fiveMinutesAgo)).toBe('il y a 5 minutes');
      expect(formatConversationDate(threeHoursAgo)).toBe('il y a 3 heures');
      expect(formatConversationDate(fiveDaysAgo)).toBe('il y a 5 jours');
    });

    it('retourne une chaîne vide pour valeurs invalides', () => {
      // Arrange & Act & Assert
      expect(formatConversationDate(undefined)).toBe('');
      expect(formatConversationDate('')).toBe('');
    });
  });
});
